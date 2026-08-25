import {
  cinemaShowAreas,
  contentAreas,
  emptyCredit,
  emptyEpisode,
  emptyInfo,
  emptyPerson,
  emptyRelatedLink,
  emptyResource,
  emptySession,
  emptySessionFilm,
  eventYearOptions,
  initialForm,
} from "./constants";
import {
  areaForType,
  cleanUrlList,
  ensureTextList,
  ensureUrlList,
  extractShowNumber,
  nonEmptyObjects,
  selectedEventYear,
  showSlugFromTitle,
} from "./utils";

const clone = (value) => JSON.parse(JSON.stringify(value));

function viralAuthorNamesFromContent(content, metadata) {
  const storedNames = ensureTextList(
    metadata.viralAuthors,
    metadata.authors,
    metadata.authorNames,
    metadata.authorName,
  ).filter(Boolean);

  return storedNames.length ? storedNames : ensureTextList(content.researcherName);
}

function viralAuthorBioFromContent(content, metadata) {
  return metadata.viralAuthorBio
    || metadata.authorBio
    || (content.type === "VIRAL_ESCAPE_LINES" ? content.description : "")
    || "";
}

function viralBodyTextFromContent(content, metadata) {
  if (metadata.bodyText) return metadata.bodyText;
  return content.type === "VIRAL_ESCAPE_LINES" && metadata.authorBio
    ? content.description || ""
    : "";
}

function eventRelatedLinksFromContent(content, metadata) {
  const relatedLinks = (Array.isArray(metadata.links) ? metadata.links : [])
    .map((link, index) => ({
      name: String(link?.name || link?.label || `Link relacionado ${index + 1}`).trim(),
      url: String(link?.url || link?.href || link?.to || "").trim(),
    }))
    .filter((link) => link.url);
  const knownUrls = new Set(relatedLinks.map((link) => link.url));

  ensureUrlList(metadata.fileUrls, content.fileUrl, content.externalUrl)
    .filter(Boolean)
    .forEach((url) => {
      if (knownUrls.has(url)) return;
      relatedLinks.push({ name: `Link relacionado ${relatedLinks.length + 1}`, url });
      knownUrls.add(url);
    });

  return relatedLinks.length ? relatedLinks : [{ ...emptyRelatedLink }];
}

function formFilmsFromSession(session = {}) {
  const hasStoredFilms = Object.prototype.hasOwnProperty.call(session, "films");
  let storedFilms = Array.isArray(session.films) ? session.films.filter(Boolean) : [];

  if (!hasStoredFilms) {
    const archiveUrls = ensureUrlList(session.archiveFilmUrls, session.archiveFilmUrl, session.filmUrl)
      .filter(Boolean);
    const filmIds = Array.isArray(session.filmIds) && session.filmIds.length
      ? session.filmIds.filter(Boolean)
      : session.filmId || session.archiveFilmId
        ? [session.filmId || session.archiveFilmId]
        : [];
    const itemCount = Math.max(archiveUrls.length, filmIds.length, 1);

    storedFilms = Array.from({ length: itemCount }, (_, index) => ({
      filmId: filmIds[index] || "",
      title: index === 0 ? session.filmTitle || session.title || "" : "",
      filmUrl: archiveUrls[index] || "",
      direction: index === 0 ? session.direction || session.director || "" : "",
      year: index === 0 ? session.year || session.filmYear || "" : "",
    }));
  }

  if (storedFilms.length === 0) return [{ ...emptySessionFilm }];

  return storedFilms.map((film) => {
    const filmId = film.filmId || film.id || "";
    const filmUrl = film.filmUrl || film.archiveFilmUrl || film.url || "";
    return {
      ...emptySessionFilm,
      filmId,
      addToDatabase: Boolean(film.addToDatabase) || (!filmId && Boolean(film.title || filmUrl)),
      title: film.title || "",
      filmUrl,
      direction: film.direction || film.director || "",
      year: String(film.year || film.filmYear || ""),
    };
  });
}

export function createInitialForm(areaValue = "CINEMA_DITADURA", typeValue) {
  const area = contentAreas.find((item) => item.value === areaValue) || contentAreas[0];
  const type = typeValue && area.types.includes(typeValue) ? typeValue : area.types[0];
  return { ...clone(initialForm), area: area.value, type };
}

export function formFromContent(content) {
  const metadata = content.metadata || {};
  const areaValue = content.type === "CINEMA_SHOW"
    ? "EVENTOS_ATIVIDADES"
    : Array.isArray(metadata.editorialAreas)
      ? metadata.editorialAreas[0]
      : metadata.editorialArea || areaForType(content.type)?.value || "CINEMA_DITADURA";
  const base = createInitialForm(areaValue, content.type);
  const storedYear = String(metadata.eventYear || metadata.showYear || metadata.year || "");

  return {
    ...base,
    title: content.title || "",
    researcherName: content.researcherMember?.name || content.researcherName || "",
    researcherMemberId: content.researcherMemberId
      || content.researcherMember?.id
      || metadata.researcherMemberId
      || (content.researcherName ? `name:${content.researcherName}` : ""),
    description: content.description || "",
    bodyText: viralBodyTextFromContent(content, metadata),
    imageUrl: metadata.imageUrl || "",
    imageUrls: ensureUrlList(
      metadata.imageUrls,
      metadata.images,
      metadata.imageUrl,
      metadata.thumbnail,
      content.type === "VIRAL_ESCAPE_LINES" ? content.fileUrl : "",
    ),
    fileUrl: content.fileUrl || "",
    fileUrls: ensureUrlList(metadata.fileUrls, content.fileUrl),
    relatedLinks: content.type === "EVENT"
      ? eventRelatedLinksFromContent(content, metadata)
      : [{ ...emptyRelatedLink }],
    videoUrl: metadata.videoUrl || (content.type === "INTERVIEW" || content.type === "FILM" ? content.externalUrl : "") || "",
    podcastUrl: metadata.podcastUrl || (content.type === "PODCAST" ? content.externalUrl : "") || "",
    pdfUrl: metadata.pdfUrl || (content.type === "ARTICLE" ? content.fileUrl || content.externalUrl : "") || "",
    alphabetLetter: String(metadata.alphabetLetter || metadata.letter || "A").toUpperCase(),
    direction: metadata.direction || metadata.director || "",
    filmYear: String(metadata.year || metadata.releaseYear || ""),
    authorNames: ensureTextList(metadata.authors, metadata.authorNames),
    viralAuthorNames: viralAuthorNamesFromContent(content, metadata),
    viralAuthorBio: viralAuthorBioFromContent(content, metadata),
    articleAuthorIds: Array.isArray(metadata.authorIds) ? metadata.authorIds : [],
    relatedFilmIds: Array.isArray(metadata.relatedFilmIds) ? metadata.relatedFilmIds : [],
    references: ensureTextList(metadata.references),
    episodes: Array.isArray(metadata.episodes) && metadata.episodes.length
      ? metadata.episodes.map((item) => ({ ...emptyEpisode, ...item }))
      : [{ ...emptyEpisode }],
    people: Array.isArray(metadata.people) && metadata.people.length
      ? metadata.people.map((item) => ({ ...emptyPerson, ...item }))
      : [{ ...emptyPerson }],
    credits: Array.isArray(metadata.credits) && metadata.credits.length
      ? metadata.credits.map((item) => ({ ...emptyCredit, ...item }))
      : [{ ...emptyCredit }],
    researchTeam: Array.isArray(metadata.team) && metadata.team.length
      ? metadata.team.map((item) => ({ ...emptyPerson, ...item }))
      : Array.isArray(metadata.researchers) && metadata.researchers.length
        ? metadata.researchers.map((item) => ({
          ...emptyPerson,
          ...item,
          lattesUrl: item.lattesUrl || item.lattes || "",
        }))
        : [{ ...emptyPerson }],
    researchCommission: metadata.commission || "",
    additionalInfo: Array.isArray(metadata.additionalInfo) && metadata.additionalInfo.length
      ? metadata.additionalInfo.map((item) => ({ ...emptyInfo, ...item }))
      : [{ ...emptyInfo }],
    resources: Array.isArray(metadata.resources) && metadata.resources.length
      ? metadata.resources.map((item) => ({ ...emptyResource, ...item }))
      : [{ ...emptyResource }],
    showNumber: metadata.showNumber || "",
    eventYear: eventYearOptions.includes(storedYear) ? storedYear : "2026",
    createCinemaPage: metadata.createCinemaPage !== false && metadata.cinemaPath !== null,
    playlistUrl: metadata.playlistUrl || (content.type === "CINEMA_SHOW" ? content.externalUrl : "") || "",
    playlistUrls: ensureUrlList(metadata.playlistUrls, metadata.playlistUrl, content.type === "CINEMA_SHOW" ? content.externalUrl : ""),
    sessions: Array.isArray(metadata.sessions) && metadata.sessions.length
      ? metadata.sessions.map((session) => ({
        ...emptySession,
        ...session,
        title: session.sessionTitle || session.title || "",
        films: formFilmsFromSession(session),
        sessionUrls: ensureUrlList(session.sessionUrls, session.sessionUrl),
      }))
      : [{ ...emptySession }],
  };
}

function commonMetadata(form, existingMetadata = {}) {
  const imageUrls = cleanUrlList(form.imageUrls);
  return {
    ...existingMetadata,
    editorialArea: form.area,
    imageUrl: imageUrls[0] || null,
    imageUrls,
  };
}

export function buildContentPayload(form, existingMetadata = {}) {
  const metadata = commonMetadata(form, existingMetadata);
  const payload = {
    title: form.title.trim(),
    researcherName: form.researcherName.trim(),
    researcherMemberId: form.researcherMemberId && !form.researcherMemberId.startsWith("name:")
      ? form.researcherMemberId
      : null,
    type: form.type,
    description: form.description.trim(),
    externalUrl: "",
    fileUrl: "",
    metadata,
  };

  switch (form.type) {
    case "INTERVIEW":
      metadata.videoUrl = form.videoUrl.trim() || null;
      metadata.people = nonEmptyObjects(form.people, ["name", "role", "description", "lattesUrl"]);
      metadata.credits = nonEmptyObjects(form.credits, ["title", "value", "description", "url"]);
      payload.externalUrl = metadata.videoUrl || "";
      break;

    case "PODCAST":
      metadata.podcastUrl = form.podcastUrl.trim() || null;
      metadata.episodes = nonEmptyObjects(form.episodes, ["title", "description", "url"]);
      metadata.people = nonEmptyObjects(form.people, ["name", "role", "description", "lattesUrl"]);
      metadata.credits = nonEmptyObjects(form.credits, ["title", "value", "description", "url"]);
      payload.externalUrl = metadata.podcastUrl || "";
      break;

    case "VIRAL_ESCAPE_LINES":
      metadata.viralAuthors = ensureTextList(form.viralAuthorNames).filter(Boolean);
      metadata.authorBio = form.viralAuthorBio.trim() || null;
      metadata.bodyText = form.bodyText.trim() || null;
      delete metadata.authors;
      delete metadata.authorNames;
      delete metadata.authorName;
      delete metadata.viralAuthorBio;
      delete metadata.images;
      delete metadata.thumbnail;
      payload.description = metadata.authorBio || "";
      payload.fileUrl = metadata.imageUrl || "";
      break;

    case "ARTICLE":
      metadata.pdfUrl = form.pdfUrl.trim() || null;
      metadata.authorIds = [...new Set(form.articleAuthorIds.filter(Boolean))];
      payload.fileUrl = metadata.pdfUrl || "";
      payload.externalUrl = metadata.pdfUrl || "";
      break;

    case "RESEARCH":
      metadata.team = nonEmptyObjects(form.researchTeam, ["name", "role", "description", "lattesUrl"]);
      metadata.commission = form.researchCommission.trim() || null;
      metadata.additionalInfo = nonEmptyObjects(form.additionalInfo, ["title", "description"]);
      metadata.resources = nonEmptyObjects(form.resources, ["title", "kind", "url"]);
      delete metadata.researchers;
      delete metadata.shortTitle;
      break;

    case "FILM":
      metadata.alphabetLetter = form.alphabetLetter;
      metadata.direction = form.direction.trim() || null;
      metadata.year = form.filmYear.trim() || null;
      delete metadata.director;
      delete metadata.releaseYear;
      metadata.videoUrl = form.videoUrl.trim() || null;
      metadata.cardExcerptWords = 45;
      payload.externalUrl = metadata.videoUrl || "";
      break;

    case "GLOSSARY":
      metadata.alphabetLetter = form.alphabetLetter;
      metadata.authors = ensureTextList(form.authorNames).filter(Boolean);
      metadata.relatedFilmIds = [...new Set(form.relatedFilmIds.filter(Boolean))];
      metadata.references = ensureTextList(form.references).filter(Boolean);
      metadata.cardExcerptWords = 55;
      break;

    case "CINEMA_SHOW": {
      const year = selectedEventYear(form);
      const showNumber = extractShowNumber(form.title);
      const slug = showSlugFromTitle(form.title);
      const playlistUrls = cleanUrlList(form.playlistUrls);

      metadata.editorialArea = form.createCinemaPage ? "CINEMA_DITADURA" : "EVENTOS_ATIVIDADES";
      metadata.editorialAreas = form.createCinemaPage ? cinemaShowAreas : ["EVENTOS_ATIVIDADES"];
      metadata.createCinemaPage = form.createCinemaPage;
      metadata.showNumber = showNumber;
      metadata.showSlug = slug;
      metadata.eventYear = year;
      metadata.showYear = year;
      metadata.year = year;
      metadata.cinemaPath = form.createCinemaPage && slug ? `/cinema-e-ditadura/${slug}` : null;
      metadata.eventPath = year ? `/eventos/${year}` : null;
      metadata.detailMode = "PAGE";
      metadata.detailPath = metadata.cinemaPath;
      metadata.playlistUrl = playlistUrls[0] || null;
      metadata.playlistUrls = playlistUrls;
      metadata.sessions = form.sessions
        .map((session) => {
          const sessionUrls = cleanUrlList(session.sessionUrls);
          const films = session.films
            .map((film) => {
              const usesFilmDatabase = Boolean(film.filmId);
              const filmUrl = film.filmUrl.trim();
              return {
                filmId: film.filmId || null,
                title: usesFilmDatabase ? "" : film.title.trim(),
                archiveFilmUrl: usesFilmDatabase ? null : filmUrl || null,
                archiveFilmUrls: usesFilmDatabase ? [] : filmUrl ? [filmUrl] : [],
                direction: usesFilmDatabase ? null : film.direction.trim() || null,
                year: usesFilmDatabase ? null : film.year.trim() || null,
              };
            })
            .filter((film) => film.filmId || film.title || film.archiveFilmUrl);
          return {
            date: session.date.trim(),
            title: session.title.trim(),
            films,
            filmIds: films.map((film) => film.filmId).filter(Boolean),
            sessionUrl: sessionUrls[0] || null,
            sessionUrls,
          };
        })
        .filter((session) => session.date || session.films.length || session.title || session.sessionUrl);
      payload.externalUrl = metadata.playlistUrl || "";
      break;
    }

    case "EVENT": {
      const year = selectedEventYear(form);
      const relatedLinks = form.relatedLinks
        .map((link) => ({ name: link.name.trim(), url: link.url.trim() }))
        .filter((link) => link.name || link.url);
      const externalUrls = relatedLinks
        .map((link) => link.url)
        .filter((url) => !url.startsWith("/"));
      metadata.eventYear = year;
      metadata.year = year;
      metadata.eventPath = year ? `/eventos/${year}` : null;
      metadata.detailMode = "MODAL";
      delete metadata.playlistUrl;
      delete metadata.playlistUrls;
      metadata.links = relatedLinks.map((link) => (
        link.url.startsWith("/")
          ? { label: link.name, to: link.url }
          : { label: link.name, href: link.url }
      ));
      metadata.fileUrls = cleanUrlList(externalUrls);
      payload.fileUrl = metadata.fileUrls[0] || "";
      payload.externalUrl = metadata.fileUrls[0] || "";
      break;
    }

    default:
      break;
  }

  return payload;
}
