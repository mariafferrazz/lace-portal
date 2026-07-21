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

export function sessionWatchUrls(session) {
  return uniqueUrls(session?.sessionUrls, session?.sessionUrl);
}

export function sessionArchiveUrls(session) {
  return uniqueUrls(session?.archiveFilmUrls, session?.archiveFilmUrl);
}
