const {
  normalizeTitleForLookup,
  parseMetadata,
  uniqueValues,
} = require("../utils/content.utils");

function filmArchiveUrl(content) {
  const metadata = parseMetadata(content.metadata);
  if (content.externalUrl) return content.externalUrl;
  if (metadata.videoUrl) return metadata.videoUrl;
  if (metadata.youtubeId) return `https://www.youtube.com/watch?v=${metadata.youtubeId}`;
  if (metadata.vimeoId) return `https://vimeo.com/${metadata.vimeoId}`;
  return null;
}

function buildFilmArchiveIndex(contents = []) {
  return contents
    .filter((content) => content.type === "FILM")
    .map((content) => {
      const url = filmArchiveUrl(content);
      const normalizedTitle = normalizeTitleForLookup(content.title);
      return normalizedTitle ? {
        id: content.id,
        title: content.title,
        direction: parseMetadata(content.metadata).direction || parseMetadata(content.metadata).director || null,
        normalizedTitle,
        url,
      } : null;
    })
    .filter(Boolean);
}

function findFilmArchiveUrl(filmIndex, title = "") {
  const normalizedTitle = normalizeTitleForLookup(title);
  if (!normalizedTitle) return null;

  const exact = filmIndex.find((film) => film.normalizedTitle === normalizedTitle);
  if (exact) return exact.url;

  if (normalizedTitle.length < 6) return null;

  const partial = filmIndex.find((film) => (
    film.normalizedTitle.includes(normalizedTitle)
    || normalizedTitle.includes(film.normalizedTitle)
  ));

  return partial?.url || null;
}

function enrichCinemaShowContent(content, filmIndex = []) {
  if (content.type !== "CINEMA_SHOW") return content;

  const metadata = parseMetadata(content.metadata);
  const sessions = Array.isArray(metadata.sessions) ? metadata.sessions : [];
  const enrichedSessions = sessions.map((session) => {
    const sessionUrls = uniqueValues(session.sessionUrls, session.sessionUrl);
    const existingArchiveUrls = uniqueValues(session.archiveFilmUrls, session.archiveFilmUrl)
      .filter((url) => !sessionUrls.includes(url));
    const linkedFilm = session.filmId
      ? filmIndex.find((film) => film.id === session.filmId)
      : null;
    const matchedArchiveUrl = linkedFilm?.url
      || findFilmArchiveUrl(filmIndex, session.filmTitle || session.title);
    const archiveFilmUrls = uniqueValues(matchedArchiveUrl, existingArchiveUrls);

    return {
      ...session,
      title: session.title || linkedFilm?.title || "",
      direction: session.direction || linkedFilm?.direction || null,
      sessionUrl: sessionUrls[0] || null,
      sessionUrls,
      archiveFilmUrl: archiveFilmUrls[0] || null,
      archiveFilmUrls,
    };
  });

  return {
    ...content,
    metadata: {
      ...metadata,
      sessions: enrichedSessions,
    },
  };
}

function enrichCinemaShows(contents = []) {
  const filmIndex = buildFilmArchiveIndex(contents);
  return contents.map((content) => enrichCinemaShowContent(content, filmIndex));
}

module.exports = {
  filmArchiveUrl,
  buildFilmArchiveIndex,
  findFilmArchiveUrl,
  enrichCinemaShowContent,
  enrichCinemaShows,
};
