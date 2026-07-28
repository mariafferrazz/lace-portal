const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 15000;

function instagramMediaUrl(value) {
  let url;
  try {
    url = new URL(String(value || "").trim());
  } catch {
    throw Object.assign(new Error("Informe a URL de uma publicação válida do Instagram."), { statusCode: 400 });
  }

  if (!/(^|\.)instagram\.com$/i.test(url.hostname)) {
    throw Object.assign(new Error("A imagem precisa vir de uma publicação do Instagram."), { statusCode: 400 });
  }

  const shortcode = url.pathname.match(/^\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i)?.[1];
  if (!shortcode) {
    throw Object.assign(new Error("Informe a URL de uma publicação válida do Instagram."), { statusCode: 400 });
  }

  return `https://www.instagram.com/p/${shortcode}/media/?size=l`;
}

async function loadInstagramImage(value) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(instagramMediaUrl(value), {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (compatible; LACE-UFF/1.0; +https://www.lablace.com.br)",
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const contentLength = Number(response.headers.get("content-length") || 0);
    if (!response.ok || !contentType.toLowerCase().startsWith("image/")) {
      throw new Error("O Instagram não disponibilizou a imagem desta publicação.");
    }
    if (contentLength > MAX_IMAGE_BYTES) {
      throw new Error("A imagem do Instagram excede o limite permitido.");
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > MAX_IMAGE_BYTES) {
      throw new Error("A imagem do Instagram excede o limite permitido.");
    }

    return { buffer, contentType };
  } catch (error) {
    if (error.statusCode) throw error;
    const message = error.name === "AbortError"
      ? "O Instagram demorou demais para responder."
      : error.message;
    throw Object.assign(new Error(message), { statusCode: 502 });
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = { loadInstagramImage };
