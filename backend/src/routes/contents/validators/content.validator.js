const { cinemaShowAreas, contentTypes } = require("../constants");
const {
  extractShowNumber,
  showSlug,
  uniqueValues,
} = require("../utils/content.utils");

function normalizeContentData(data) {
  if (data.type === undefined && data.metadata === undefined) return data;

  const metadata = data.metadata && typeof data.metadata === "object" && !Array.isArray(data.metadata)
    ? { ...data.metadata }
    : {};

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
  }

  data.metadata = metadata;
  return data;
}

function parseContent(body, partial = false) {
  const data = {};
  const required = (field, label) => {
    if (!partial && !String(body[field] || "").trim()) {
      throw new Error(`${label} e obrigatorio.`);
    }
    if (body[field] !== undefined) data[field] = String(body[field]).trim();
  };

  required("title", "Titulo");
  required("researcherName", "Nome do pesquisador");

  if (!partial && !contentTypes.has(body.type)) {
    throw new Error("Tipo de conteudo invalido.");
  }

  if (body.type !== undefined) {
    if (!contentTypes.has(body.type)) throw new Error("Tipo de conteudo invalido.");
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
