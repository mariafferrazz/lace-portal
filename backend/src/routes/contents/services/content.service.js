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

async function listPublishedContents(type) {
  const where = type ? { type, published: true } : { published: true };
  const contents = await prisma.content.findMany({
    where,
    include: {
      createdBy: { select: { id: true, name: true, role: true } },
      researcherMember: { select: { id: true, name: true, role: true } },
    },
    orderBy: { title: "asc" },
  });

  return enrichCinemaShows(contents);
}

async function listNavigationContents() {
  return prisma.content.findMany({
    where: { published: true, type: { in: ["EVENT", "CINEMA_SHOW"] } },
    select: { id: true, title: true, type: true, metadata: true },
    orderBy: { createdAt: "desc" },
  });
}

async function listHighlights() {
  return prisma.content.findMany({
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
    orderBy: [{ createdAt: "desc" }],
    take: 12,
  });
}

async function listCinemaShowSourceContents() {
  return prisma.content.findMany({
    where: { published: true, type: { in: ["CINEMA_SHOW", "FILM"] } },
    include: {
      createdBy: { select: { id: true, name: true, role: true } },
      researcherMember: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function listEventYearSourceContents() {
  return prisma.content.findMany({
    where: { published: true, type: { in: ["EVENT", "CINEMA_SHOW", "FILM"] } },
    include: {
      createdBy: { select: { id: true, name: true, role: true } },
      researcherMember: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  });
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
    select: { id: true, title: true, type: true, researcherName: true },
  });
  const toOption = (content) => ({
    id: content.id,
    title: content.title,
    subtitle: content.researcherName || undefined,
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
