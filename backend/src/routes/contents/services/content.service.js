const prisma = require("../../../db");
const { parseMetadata } = require("../utils/content.utils");
const { enrichCinemaShows } = require("./cinemaShow.service");

function normalizeRawContent(content) {
  return {
    ...content,
    metadata: parseMetadata(content.metadata),
    published: Boolean(content.published),
    createdBy: null,
    researcherMember: null,
    summaryOnly: false,
  };
}

function normalizeContentMetadata(content) {
  return {
    ...content,
    metadata: parseMetadata(content.metadata),
  };
}

const basicContentSelect = {
  id: true,
  title: true,
  description: true,
  type: true,
  researcherName: true,
  fileUrl: true,
  externalUrl: true,
  metadata: true,
  published: true,
  createdById: true,
  researcherMemberId: true,
  createdAt: true,
  updatedAt: true,
};

const publicContentSelect = {
  id: true,
  title: true,
  description: true,
  type: true,
  researcherName: true,
  fileUrl: true,
  externalUrl: true,
  metadata: true,
  published: true,
  createdAt: true,
  updatedAt: true,
};

function sortNewestFirst(contents) {
  return contents.sort((left, right) => (
    new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime()
  ));
}

function eventYearValue(content) {
  const metadata = parseMetadata(content.metadata);
  const year = Number(metadata.eventYear || metadata.year || metadata.showYear || 0);
  return Number.isFinite(year) ? year : 0;
}

function sortHighlightsNewestFirst(contents) {
  return contents.sort((left, right) => {
    const yearDifference = eventYearValue(right) - eventYearValue(left);
    if (yearDifference !== 0) return yearDifference;
    return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
  });
}

function referenceTypeFor(type) {
  if (type === "GLOSSARY") return "FILM";
  if (type === "ARTICLE") return "ARTICLE_AUTHOR";
  if (type === "CINEMA_SHOW") return "FILM";
  return null;
}

function enrichPublicReferences(contents, references) {
  const referencesById = new Map(references.map((content) => [content.id, content]));

  return contents.map((content) => {
    const metadata = parseMetadata(content.metadata);
    let relationKey = null;
    let ids = [];

    if (content.type === "GLOSSARY") {
      relationKey = "relatedFilms";
      ids = Array.isArray(metadata.relatedFilmIds) ? metadata.relatedFilmIds : [];
    } else if (content.type === "ARTICLE") {
      relationKey = "articleAuthors";
      ids = Array.isArray(metadata.authorIds) ? metadata.authorIds : [];
    }

    if (!relationKey) return { ...content, metadata };

    return {
      ...content,
      metadata: {
        ...metadata,
        [relationKey]: ids.map((id) => referencesById.get(id)).filter(Boolean),
      },
    };
  });
}

async function listPublishedContents(type) {
  const where = type ? { type, published: true } : { published: true };
  const referenceType = referenceTypeFor(type);
  const [contents, referenceRows] = await Promise.all([
    prisma.content.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true, role: true } },
        researcherMember: { select: { id: true, name: true, role: true } },
      },
      orderBy: { title: "asc" },
    }),
    referenceType
      ? prisma.content.findMany({
        where: { type: referenceType },
        select: publicContentSelect,
      })
      : Promise.resolve([]),
  ]);

  const normalizedContents = contents.map(normalizeContentMetadata);
  const normalizedReferences = referenceRows.map(normalizeContentMetadata);
  const cinemaEnrichmentSource = type
    ? [...normalizedContents, ...normalizedReferences]
    : normalizedContents;
  const cinemaEnrichedContents = enrichCinemaShows(cinemaEnrichmentSource)
    .slice(0, normalizedContents.length);

  return enrichPublicReferences(
    cinemaEnrichedContents,
    normalizedReferences.length > 0 ? normalizedReferences : normalizedContents,
  );
}

async function listNavigationContents() {
  const contents = await prisma.content.findMany({
    where: { published: true, type: { in: ["EVENT", "CINEMA_SHOW"] } },
    select: { id: true, title: true, type: true, metadata: true, createdAt: true },
  });
  return sortNewestFirst(contents.map(normalizeContentMetadata));
}

async function listHighlights() {
  const contents = await prisma.content.findMany({
    where: { published: true, type: { in: ["EVENT", "CINEMA_SHOW"] } },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      fileUrl: true,
      externalUrl: true,
      metadata: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return sortHighlightsNewestFirst(contents.map(normalizeContentMetadata)).slice(0, 12);
}

async function listCinemaShowSourceContents() {
  const contents = await prisma.content.findMany({
    where: { published: true, type: { in: ["CINEMA_SHOW", "FILM"] } },
    select: publicContentSelect,
  });
  return sortNewestFirst(contents.map(normalizeContentMetadata));
}

async function listEventYearSourceContents() {
  const contents = await prisma.content.findMany({
    where: { published: true, type: { in: ["EVENT", "CINEMA_SHOW", "FILM"] } },
    select: publicContentSelect,
  });
  return sortNewestFirst(contents.map(normalizeContentMetadata));
}

async function listManageContents() {
  const [contentRows, users, teamMembers] = await Promise.all([
    prisma.content.findMany({
      select: basicContentSelect,
    }),
    prisma.user.findMany({ select: { id: true, name: true, role: true } }),
    prisma.teamMember.findMany({ select: { id: true, name: true, role: true } }),
  ]);

  const usersById = new Map(users.map((user) => [user.id, user]));
  const teamMembersById = new Map(teamMembers.map((member) => [member.id, member]));
  const contents = contentRows.map((content) => ({
    ...normalizeRawContent(content),
    createdBy: usersById.get(content.createdById) || null,
    researcherMember: teamMembersById.get(content.researcherMemberId) || null,
  })).sort((left, right) => (
    new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime()
  ));

  return enrichCinemaShows(contents);
}

async function findManageContent(id) {
  try {
    return await prisma.content.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, role: true } },
        researcherMember: { select: { id: true, name: true, role: true } },
      },
    });
  } catch (error) {
    console.error("Erro ao carregar relacionamentos do conteudo. Usando leitura basica:", error);
    const content = await prisma.content.findUnique({ where: { id }, select: basicContentSelect });
    return content ? normalizeRawContent(content) : null;
  }
}

async function listManageReferenceOptions() {
  const rows = await prisma.content.findMany({
    where: { type: { in: ["FILM", "ARTICLE_AUTHOR"] } },
    select: { id: true, title: true, type: true, researcherName: true, externalUrl: true, metadata: true },
  });
  const toOption = (content) => ({
    id: content.id,
    title: content.title,
    subtitle: content.researcherName || undefined,
    url: content.externalUrl || parseMetadata(content.metadata).videoUrl || "",
  });
  const byTitle = (left, right) => left.title.localeCompare(right.title, "pt-BR");

  return {
    films: rows.filter((content) => content.type === "FILM").map(toOption).sort(byTitle),
    articleAuthors: rows.filter((content) => content.type === "ARTICLE_AUTHOR").map(toOption).sort(byTitle),
  };
}

async function listFilmsForEnrichment() {
  return prisma.content.findMany({
    where: { type: "FILM" },
    select: { id: true, title: true, type: true, externalUrl: true, metadata: true },
  });
}

async function createContent(data, userId) {
  return prisma.content.create({ data: { ...data, createdById: userId } });
}

async function findContentById(id) {
  return prisma.content.findUnique({ where: { id } });
}

async function updateContent(id, data) {
  return prisma.content.update({ where: { id }, data });
}

async function deleteContent(id) {
  return prisma.content.delete({ where: { id } });
}

module.exports = {
  normalizeRawContent,
  normalizeContentMetadata,
  listPublishedContents,
  listNavigationContents,
  listHighlights,
  listCinemaShowSourceContents,
  listEventYearSourceContents,
  listManageContents,
  listManageReferenceOptions,
  findManageContent,
  listFilmsForEnrichment,
  createContent,
  findContentById,
  updateContent,
  deleteContent,
};
