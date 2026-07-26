const playlistCache = new Map();
const cacheDurationMs = 30 * 60 * 1000;

function youtubePlaylistId(value = "") {
  const raw = String(value || "").trim();
  if (/^[A-Za-z0-9_-]{10,100}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    if (!/(^|\.)youtube\.com$/.test(url.hostname)) return "";
    const playlistId = url.searchParams.get("list") || "";
    return /^[A-Za-z0-9_-]{10,100}$/.test(playlistId) ? playlistId : "";
  } catch {
    return "";
  }
}

function decodeXml(value = "") {
  return String(value)
    .replace(/^<!\[CDATA\[|\]\]>$/g, "")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

function tagValue(xml, tagName) {
  return decodeXml(xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"))?.[1] || "");
}

function parsePlaylistFeed(xml) {
  return [...String(xml).matchAll(/<entry>([\s\S]*?)<\/entry>/gi)]
    .map((match) => {
      const entry = match[1];
      const id = tagValue(entry, "yt:videoId") || tagValue(entry, "id").replace(/^yt:video:/, "");
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return null;

      const thumbnail = entry.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1]
        || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

      return {
        id,
        title: tagValue(entry, "media:title") || tagValue(entry, "title") || "Vídeo da playlist",
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: decodeXml(thumbnail),
      };
    })
    .filter(Boolean);
}

async function loadYoutubePlaylist(value) {
  const playlistId = youtubePlaylistId(value);
  if (!playlistId) throw new Error("Informe uma URL válida de playlist do YouTube.");

  const cached = playlistCache.get(playlistId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const response = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`, {
    headers: { "User-Agent": "LACE-UFF-Portal/1.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Não foi possível carregar esta playlist do YouTube.");

  const items = parsePlaylistFeed(await response.text());
  if (items.length === 0) throw new Error("Esta playlist não possui vídeos públicos disponíveis.");

  const valueToCache = { playlistId, items };
  playlistCache.set(playlistId, { value: valueToCache, expiresAt: Date.now() + cacheDurationMs });
  return valueToCache;
}

module.exports = {
  loadYoutubePlaylist,
  parsePlaylistFeed,
  youtubePlaylistId,
};
