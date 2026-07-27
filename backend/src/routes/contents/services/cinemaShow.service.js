const {
  normalizeTitleForLookup,
  parseMetadata,
  uniqueValues,
} = require("../utils/content.utils");

const vouContarParaOsMeusFilhosTitle = normalizeTitleForLookup("Vou Contar para os Meus Filhos");

function filmArchiveUrl(content) {
  const metadata = parseMetadata(content.metadata);
  if (content.externalUrl) return content.externalUrl;
  if (metadata.videoUrl) return metadata.videoUrl;
  if (metadata.youtubeId) return `https://www.youtube.com/watch?v=${metadata.youtubeId}`;
  if (metadata.vimeoId) return `https://vimeo.com/${metadata.vimeoId}`;
  return null;
}

function buildFilmArchiveIndex(contents = []) {
  const films = contents
    .filter((content) => content.type === "FILM")
    .map((content) => {
      const metadata = parseMetadata(content.metadata);
      const url = filmArchiveUrl(content);
      const normalizedTitle = normalizeTitleForLookup(content.title);
      return normalizedTitle ? {
        id: content.id,
        title: content.title,
        direction: metadata.direction || metadata.director || null,
        year: String(metadata.year || metadata.releaseYear || "") || null,
        normalizedTitle,
        url,
      } : null;
    })
    .filter(Boolean);

  Object.defineProperties(films, {
    byId: { value: new Map(films.map((film) => [film.id, film])) },
    byTitle: { value: new Map(films.map((film) => [film.normalizedTitle, film])) },
  });

  return films;
}

function findFilmArchive(filmIndex, title = "") {
  const normalizedTitle = normalizeTitleForLookup(title);
  if (!normalizedTitle) return null;

  const exact = filmIndex.byTitle?.get(normalizedTitle)
    || filmIndex.find((film) => film.normalizedTitle === normalizedTitle);
  if (exact) return exact;

  if (normalizedTitle.length < 6) return null;

  const partial = filmIndex.find((film) => (
    film.normalizedTitle.includes(normalizedTitle)
    || normalizedTitle.includes(film.normalizedTitle)
  ));

  return partial || null;
}

function findFilmArchiveUrl(filmIndex, title = "") {
  return findFilmArchive(filmIndex, title)?.url || null;
}

function legacySessionFilms(session, archiveUrls = []) {
  if (Object.prototype.hasOwnProperty.call(session, "films")) {
    return Array.isArray(session.films) ? session.films.filter(Boolean) : [];
  }

  const filmIds = Array.isArray(session.filmIds) && session.filmIds.length
    ? session.filmIds.filter(Boolean)
    : session.filmId || session.archiveFilmId
      ? [session.filmId || session.archiveFilmId]
      : [];
  const legacyTitle = session.filmTitle || session.title || "";
  const itemCount = Math.max(filmIds.length, archiveUrls.length, legacyTitle ? 1 : 0);

  return Array.from({ length: itemCount }, (_, index) => ({
    filmId: filmIds[index] || null,
    title: index === 0 ? legacyTitle : "",
    direction: index === 0 ? session.direction || session.director || null : null,
    year: index === 0 ? session.year || session.filmYear || null : null,
    archiveFilmUrl: archiveUrls[index] || null,
  }));
}

function enrichSessionFilm(film, filmIndex) {
  const linkedFilm = film.filmId
    ? filmIndex.byId?.get(film.filmId) || filmIndex.find((archiveFilm) => archiveFilm.id === film.filmId)
    : null;
  const matchedFilm = linkedFilm || findFilmArchive(filmIndex, film.title);
  const archiveFilmUrls = uniqueValues(
    matchedFilm?.url,
    film.archiveFilmUrls,
    film.archiveFilmUrl,
    film.filmUrl,
    film.url,
  );

  return {
    filmId: film.filmId || matchedFilm?.id || null,
    title: film.title || matchedFilm?.title || "",
    direction: film.direction || film.director || matchedFilm?.direction || null,
    year: String(film.year || film.filmYear || matchedFilm?.year || "") || null,
    archiveFilmUrl: archiveFilmUrls[0] || null,
    archiveFilmUrls,
  };
}

function enrichCinemaShowContent(content, filmIndex = []) {
  if (content.type !== "CINEMA_SHOW") return content;

  const metadata = parseMetadata(content.metadata);
  const sessions = Array.isArray(metadata.sessions) ? metadata.sessions : [];
  const enrichedSessions = sessions.map((session) => {
    const storedSessionUrls = uniqueValues(session.sessionUrls, session.sessionUrl);
    const storedArchiveUrls = uniqueValues(session.archiveFilmUrls, session.archiveFilmUrl);
    const firstStoredFilmTitle = Array.isArray(session.films) ? session.films[0]?.title : "";
    const hasMisplacedSessionUrl = normalizeTitleForLookup(firstStoredFilmTitle || session.title) === vouContarParaOsMeusFilhosTitle
      && storedSessionUrls.length === 0
      && storedArchiveUrls.length > 1;
    const sessionUrls = hasMisplacedSessionUrl
      ? uniqueValues(storedArchiveUrls.slice(1))
      : storedSessionUrls;
    const existingArchiveUrls = (hasMisplacedSessionUrl ? storedArchiveUrls.slice(0, 1) : storedArchiveUrls)
      .filter((url) => !sessionUrls.includes(url));
    const films = legacySessionFilms(session, existingArchiveUrls)
      .map((film) => enrichSessionFilm(film, filmIndex));
    const archiveFilmUrls = uniqueValues(films.flatMap((film) => film.archiveFilmUrls));
    const onlyFilm = films.length === 1 ? films[0] : null;

    return {
      ...session,
      title: session.sessionTitle || session.title || onlyFilm?.title || "",
      films,
      filmIds: films.map((film) => film.filmId).filter(Boolean),
      direction: session.direction || session.director || onlyFilm?.direction || null,
      year: String(session.year || session.filmYear || onlyFilm?.year || "") || null,
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
  findFilmArchive,
  findFilmArchiveUrl,
  legacySessionFilms,
  enrichSessionFilm,
  enrichCinemaShowContent,
  enrichCinemaShows,
};
