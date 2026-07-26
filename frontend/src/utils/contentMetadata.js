export function uniqueUrls(...values) {
  return [
    ...new Set(
      values
        .flat(Infinity)
        .filter(Boolean)
        .map((url) => String(url).trim())
        .filter(Boolean),
    ),
  ];
}

export function contentImage(content, fallback = "") {
  return uniqueUrls(
    content?.metadata?.imageUrls,
    content?.metadata?.imageUrl,
    content?.metadata?.thumbnail,
    content?.metadata?.images,
    fallback,
  )[0] || "";
}

export function contentFileUrls(content) {
  return uniqueUrls(content?.metadata?.fileUrls, content?.fileUrl, content?.externalUrl);
}

export function contentImageUrls(content) {
  return uniqueUrls(content?.metadata?.imageUrls, content?.metadata?.imageUrl, content?.metadata?.images, content?.metadata?.thumbnail);
}

export function contentPlaylistUrls(content) {
  return uniqueUrls(content?.metadata?.playlistUrls, content?.metadata?.playlistUrl, content?.externalUrl);
}

function safeUrl(value) {
  if (!value) return null;
  try {
    return new URL(String(value).trim(), "https://lace.invalid");
  } catch {
    return null;
  }
}

export function youtubeVideoId(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;

  const url = safeUrl(raw);
  if (!url) return "";
  if (url.hostname === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
  if (!/(^|\.)youtube\.com$/.test(url.hostname)) return "";

  return url.searchParams.get("v")
    || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1]
    || "";
}

export function vimeoVideoId(value) {
  const raw = String(value || "").trim();
  if (/^\d+$/.test(raw)) return raw;
  const url = safeUrl(raw);
  if (!url || !/(^|\.)vimeo\.com$/.test(url.hostname)) return "";
  return url.pathname.match(/\/(\d+)(?:$|\/)/)?.[1] || "";
}

export function contentVideo(content) {
  const genericCandidates = uniqueUrls(
    content?.metadata?.videoUrl,
    content?.externalUrl,
  );
  const explicitYoutubeId = youtubeVideoId(content?.metadata?.youtubeId);
  const explicitVimeoId = vimeoVideoId(content?.metadata?.vimeoId);

  return {
    youtubeId: explicitYoutubeId || genericCandidates.map(youtubeVideoId).find(Boolean) || "",
    vimeoId: explicitVimeoId || genericCandidates.map(vimeoVideoId).find(Boolean) || "",
    url: genericCandidates[0]
      || (explicitYoutubeId ? `https://www.youtube.com/watch?v=${explicitYoutubeId}` : "")
      || (explicitVimeoId ? `https://vimeo.com/${explicitVimeoId}` : ""),
  };
}

export function contentDirection(content) {
  return content?.metadata?.direction || content?.metadata?.director || "";
}

export function contentPeople(content) {
  const people = content?.metadata?.people || content?.metadata?.researchers;
  return Array.isArray(people) ? people : [];
}

export function contentCredits(content) {
  return Array.isArray(content?.metadata?.credits) ? content.metadata.credits : [];
}

export function contentText(content) {
  return content?.metadata?.bodyText || content?.description || "";
}

export function sessionWatchUrls(session) {
  return uniqueUrls(session?.sessionUrls, session?.sessionUrl);
}

export function sessionArchiveUrls(session) {
  return uniqueUrls(session?.archiveFilmUrls, session?.archiveFilmUrl);
}
