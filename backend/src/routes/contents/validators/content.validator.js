const { cinemaShowAreas, contentTypes } = require("../constants");
const {
  extractShowNumber,
  showSlug,
  uniqueValues,
} = require("../utils/content.utils");

function objectList(value) {
  return Array.isArray(value)
    ? value.filter((item) => item && typeof item === "object" && !Array.isArray(item))
    : [];
}

function youtubeVideoId(value) {
  const raw = String(value || "").trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    if (url.hostname === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || null;
    if (!/(^|\.)youtube\.com$/.test(url.hostname)) return null;
    return url.searchParams.get("v")
      || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1]
      || null;
  } catch {
    return null;
  }
}

function vimeoVideoId(value) {
  const raw = String(value || "").trim();
  if (/^\d+$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    if (!/(^|\.)vimeo\.com$/.test(url.hostname)) return null;
    return url.pathname.match(/\/(\d+)(?:$|\/)/)?.[1] || null;
  } catch {
    return null;
  }
}

function normalizeEditorialMetadata(data, metadata) {
  const imageUrls = uniqueValues(metadata.imageUrls, metadata.imageUrl, metadata.thumbnail, metadata.images);
  metadata.imageUrl = imageUrls[0] || null;
  metadata.imageUrls = imageUrls;

  if (["FILM", "INTERVIEW"].includes(data.type)) {
    const videoUrl = String(metadata.videoUrl || data.externalUrl || "").trim();
    metadata.videoUrl = videoUrl || null;
    metadata.youtubeId = youtubeVideoId(metadata.youtubeId || videoUrl);
    metadata.vimeoId = vimeoVideoId(metadata.vimeoId || videoUrl);
    data.externalUrl = videoUrl || null;

    if (data.type === "FILM" && !metadata.imageUrl && metadata.youtubeId) {
      metadata.imageUrl = `https://i.ytimg.com/vi/${metadata.youtubeId}/hqdefault.jpg`;
      metadata.imageUrls = [metadata.imageUrl];
    }
  }

  if (data.type === "FILM") {
    const direction = String(metadata.direction || metadata.director || "").trim();
    const year = String(metadata.year || metadata.releaseYear || "").trim();
    metadata.direction = direction || null;
    metadata.year = year || null;
    delete metadata.director;
    delete metadata.releaseYear;
    metadata.alphabetLetter = String(metadata.alphabetLetter || metadata.letter || "").trim().toUpperCase() || null;
  } else if (data.type === "GLOSSARY") {
    metadata.alphabetLetter = String(metadata.alphabetLetter || metadata.letter || "").trim().toUpperCase() || null;
    metadata.authors = uniqueValues(metadata.authors, metadata.authorNames);
    metadata.relatedFilmIds = uniqueValues(metadata.relatedFilmIds);
    metadata.references = uniqueValues(metadata.references);
  } else if (data.type === "INTERVIEW") {
    metadata.people = objectList(metadata.people || metadata.researchers);
    metadata.credits = objectList(metadata.credits);
  } else if (data.type === "PODCAST") {
    const podcastUrl = String(metadata.podcastUrl || data.externalUrl || "").trim();
    metadata.podcastUrl = podcastUrl || null;
    metadata.episodes = objectList(metadata.episodes);
    metadata.people = objectList(metadata.people || metadata.researchers);
    metadata.credits = objectList(metadata.credits);
    data.externalUrl = podcastUrl || null;
  } else if (data.type === "VIRAL_ESCAPE_LINES") {
    metadata.authors = uniqueValues(metadata.authors, metadata.authorNames);
    metadata.bodyText = String(metadata.bodyText || "").trim() || null;
  } else if (data.type === "ARTICLE") {
    const pdfUrl = String(metadata.pdfUrl || data.fileUrl || data.externalUrl || "").trim();
    metadata.pdfUrl = pdfUrl || null;
    metadata.authorIds = uniqueValues(metadata.authorIds);
    data.fileUrl = pdfUrl || null;
    data.externalUrl = pdfUrl || null;
  } else if (data.type === "RESEARCH") {
    metadata.team = objectList(metadata.team);
    metadata.additionalInfo = objectList(metadata.additionalInfo);
    metadata.resources = objectList(metadata.resources);
  }
}

function normalizeContentData(data) {
  if (data.type === undefined && data.metadata === undefined) return data;

  const metadata = data.metadata && typeof data.metadata === "object" && !Array.isArray(data.metadata)
    ? { ...data.metadata }
    : {};

  normalizeEditorialMetadata(data, metadata);

  if (data.type === "CINEMA_SHOW") {
    const showNumber = String(metadata.showNumber || extractShowNumber(data.title) || "").trim();
    const eventYear = String(metadata.eventYear || metadata.showYear || metadata.year || "").trim();
    const imageUrls = uniqueValues(metadata.imageUrls, metadata.imageUrl, metadata.thumbnail, metadata.images);
    const playlistUrls = uniqueValues(metadata.playlistUrls, metadata.playlistUrl, data.externalUrl);
    const createCinemaPage = metadata.createCinemaPage !== false && metadata.cinemaPath !== null;
    const slug = showSlug(showNumber) || metadata.showSlug || (createCinemaPage ? showSlug(data.title) : null);

    metadata.editorialArea = createCinemaPage ? "CINEMA_DITADURA" : "EVENTOS_ATIVIDADES";
    metadata.editorialAreas = createCinemaPage ? cinemaShowAreas : ["EVENTOS_ATIVIDADES"];
    metadata.createCinemaPage = createCinemaPage;
    metadata.showNumber = showNumber;
    metadata.showSlug = slug || null;
    metadata.eventYear = eventYear;
    metadata.showYear = eventYear;
    metadata.year = eventYear;
    metadata.cinemaPath = createCinemaPage && metadata.showSlug
      ? `/cinema-e-ditadura/${metadata.showSlug}`
      : null;
    metadata.eventPath = eventYear ? `/eventos/${eventYear}` : null;
    metadata.imageUrl = imageUrls[0] || null;
    metadata.imageUrls = imageUrls;
    metadata.playlistUrl = playlistUrls[0] || null;
    metadata.playlistUrls = playlistUrls;
    metadata.sessions = Array.isArray(metadata.sessions) ? metadata.sessions : [];
    data.externalUrl = playlistUrls[0] || data.externalUrl || null;
  } else if (data.type === "EVENT") {
    metadata.editorialArea = "EVENTOS_ATIVIDADES";
    metadata.eventYear = String(metadata.eventYear || metadata.year || "").trim();
    metadata.year = metadata.eventYear;
    metadata.eventPath = metadata.eventYear ? `/eventos/${metadata.eventYear}` : null;
    metadata.fileUrls = uniqueValues(metadata.fileUrls, data.fileUrl, data.externalUrl);
    data.fileUrl = metadata.fileUrls[0] || null;
    data.externalUrl = metadata.fileUrls[0] || null;
  }

  data.metadata = metadata;
  return data;
}

function parseContent(body, partial = false) {
  const data = {};
  const required = (field, label) => {
    if (!partial && !String(body[field] || "").trim()) {
      throw new Error(`${label} é obrigatório.`);
    }
    if (body[field] !== undefined) data[field] = String(body[field]).trim();
  };

  required("title", "Título");
  required("researcherName", "Nome do pesquisador");

  if (!partial && !contentTypes.has(body.type)) {
    throw new Error("Tipo de conteúdo inválido.");
  }

  if (body.type !== undefined) {
    if (!contentTypes.has(body.type)) throw new Error("Tipo de conteúdo inválido.");
    data.type = body.type;
  }

  for (const field of ["description", "fileUrl", "externalUrl"]) {
    if (body[field] !== undefined) data[field] = String(body[field]).trim() || null;
  }

  if (body.researcherMemberId !== undefined) {
    data.researcherMemberId = body.researcherMemberId
      ? String(body.researcherMemberId).trim() || null
      : null;
  }

  if (body.metadata !== undefined) data.metadata = body.metadata;
  return normalizeContentData(data);
}

module.exports = {
  normalizeContentData,
  parseContent,
};
