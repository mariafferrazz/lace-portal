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

const filmEnrichmentSelect = {
  id: true,
  title: true,
  type: true,
  externalUrl: true,
  metadata: true,
};

const manageSummarySelect = {
  id: true,
  title: true,
  type: true,
  researcherName: true,
  metadata: true,
  published: true,
  createdById: true,
  researcherMemberId: true,
  createdAt: true,
  updatedAt: true,
};

function eventSummaryMetadata(value) {
  const metadata = parseMetadata(value);
  return {
    eventYear: metadata.eventYear,
    year: metadata.year,
    showYear: metadata.showYear,
    showNumber: metadata.showNumber,
    showSlug: metadata.showSlug,
    createCinemaPage: metadata.createCinemaPage,
    cinemaPath: metadata.cinemaPath,
    eventPath: metadata.eventPath,
    detailPath: metadata.detailPath,
    imageUrl: metadata.imageUrl,
    imageUrls: metadata.imageUrls,
    fileUrls: metadata.fileUrls,
  };
}

function manageSummaryMetadata(value) {
  const metadata = parseMetadata(value);
  return {
    editorialArea: metadata.editorialArea,
    editorialAreas: metadata.editorialAreas,
    eventYear: metadata.eventYear || metadata.year || metadata.showYear,
    showNumber: metadata.showNumber,
    sessionCount: Array.isArray(metadata.sessions) ? metadata.sessions.length : 0,
  };
}

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
    where: { published: true, type: { in: ["EVENT", "CINEMA_SHOW", "ARTICLE_AUTHOR"] } },
    select: { id: true, title: true, type: true, metadata: true, createdAt: true },
  });
  return sortNewestFirst(contents.map((content) => ({
    ...content,
    metadata: content.type === "ARTICLE_AUTHOR" ? {} : eventSummaryMetadata(content.metadata),
  })));
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
  return sortHighlightsNewestFirst(contents.map((content) => ({
    ...content,
    metadata: eventSummaryMetadata(content.metadata),
  }))).slice(0, 12);
}

async function listCinemaShowSourceContents() {
  const [shows, films] = await Promise.all([
    prisma.content.findMany({
      where: { published: true, type: "CINEMA_SHOW" },
      select: publicContentSelect,
    }),
    prisma.content.findMany({
      where: { published: true, type: "FILM" },
      select: filmEnrichmentSelect,
    }),
  ]);
  return sortNewestFirst([...shows, ...films].map(normalizeContentMetadata));
}

async function listEventYearSourceContents() {
  const [events, films] = await Promise.all([
    prisma.content.findMany({
      where: { published: true, type: { in: ["EVENT", "CINEMA_SHOW"] } },
      select: publicContentSelect,
    }),
    prisma.content.findMany({
      where: { published: true, type: "FILM" },
      select: filmEnrichmentSelect,
    }),
  ]);
  return sortNewestFirst([...events, ...films].map(normalizeContentMetadata));
}

async function listManageContents({ summary = false } = {}) {
  const [contentRows, users, teamMembers] = await Promise.all([
    prisma.content.findMany({
      select: summary ? manageSummarySelect : basicContentSelect,
    }),
    prisma.user.findMany({ select: { id: true, name: true, role: true } }),
    prisma.teamMember.findMany({ select: { id: true, name: true, role: true } }),
  ]);

  const usersById = new Map(users.map((user) => [user.id, user]));
  const teamMembersById = new Map(teamMembers.map((member) => [member.id, member]));
  const contents = contentRows.map((content) => {
    const normalized = normalizeRawContent(content);
    return {
      ...normalized,
      metadata: summary ? manageSummaryMetadata(content.metadata) : normalized.metadata,
      summaryOnly: summary,
      createdBy: usersById.get(content.createdById) || null,
      researcherMember: teamMembersById.get(content.researcherMemberId) || null,
    };
  }).sort((left, right) => (
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
    console.error("Erro ao carregar relacionamentos do conteúdo. Usando leitura básica:", error);
    const content = await prisma.content.findUnique({ where: { id }, select: basicContentSelect });
    return content ? normalizeRawContent(content) : null;
  }
}

async function listManageReferenceOptions() {
  const rows = await prisma.content.findMany({
    where: { type: { in: ["FILM", "ARTICLE_AUTHOR", "ARTICLE"] } },
    select: { id: true, title: true, type: true, researcherName: true, externalUrl: true, metadata: true },
  });
  const articleCountsByAuthor = new Map();
  rows.filter((content) => content.type === "ARTICLE").forEach((content) => {
    const metadata = parseMetadata(content.metadata);
    const authorIds = Array.isArray(metadata.authorIds) ? metadata.authorIds : [];
    authorIds.forEach((authorId) => {
      articleCountsByAuthor.set(authorId, (articleCountsByAuthor.get(authorId) || 0) + 1);
    });
  });
  const toOption = (content) => {
    const metadata = parseMetadata(content.metadata);
    const articleCount = content.type === "ARTICLE_AUTHOR" ? articleCountsByAuthor.get(content.id) || 0 : undefined;
    return {
      id: content.id,
      title: content.title,
      subtitle: content.type === "ARTICLE_AUTHOR"
        ? `${articleCount} ${articleCount === 1 ? "artigo vinculado" : "artigos vinculados"}`
        : content.researcherName || undefined,
      url: content.externalUrl || metadata.videoUrl || "",
      direction: metadata.direction || metadata.director || "",
      year: String(metadata.year || metadata.releaseYear || ""),
      articleCount,
    };
  };
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
  const content = await prisma.content.findUnique({ where: { id } });
  if (!content) return null;

  if (content.type !== "ARTICLE_AUTHOR") {
    const deletedContent = await prisma.content.delete({ where: { id } });
    return { deletedContent, deletedWorks: 0, preservedSharedWorks: 0 };
  }

  const articles = await prisma.content.findMany({
    where: { type: "ARTICLE" },
    select: { id: true, metadata: true },
  });
  const relatedArticles = articles
    .map((article) => ({ article, metadata: parseMetadata(article.metadata) }))
    .filter(({ metadata }) => Array.isArray(metadata.authorIds) && metadata.authorIds.includes(id));
  const exclusiveArticles = relatedArticles.filter(({ metadata }) => metadata.authorIds.length === 1);
  const sharedArticles = relatedArticles.filter(({ metadata }) => metadata.authorIds.length > 1);
  const operations = sharedArticles.map(({ article, metadata }) => prisma.content.update({
    where: { id: article.id },
    data: { metadata: { ...metadata, authorIds: metadata.authorIds.filter((authorId) => authorId !== id) } },
  }));

  if (exclusiveArticles.length > 0) {
    operations.push(prisma.content.deleteMany({
      where: { id: { in: exclusiveArticles.map(({ article }) => article.id) } },
    }));
  }
  operations.push(prisma.content.delete({ where: { id } }));

  await prisma.$transaction(operations);
  return {
    deletedContent: content,
    deletedWorks: exclusiveArticles.length,
    preservedSharedWorks: sharedArticles.length,
  };
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
