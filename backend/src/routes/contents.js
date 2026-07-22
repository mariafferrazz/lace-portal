const express = require("express");
const prisma = require("../db");
const { requireAuth, requireCoordinator } = require("../middleware/auth");
const { notifyCoordinatorContentChange } = require("../services/notifications");

const router = express.Router();
const contentTypes = new Set(["FILM", "GLOSSARY", "CINEMA_SHOW", "ARTICLE", "RESEARCH", "TRANSLATION", "VIRAL_ESCAPE_LINES", "INTERVIEW", "PODCAST", "EVENT", "OTHER"]);
const cinemaShowAreas = ["CINEMA_DITADURA", "EVENTOS_ATIVIDADES"];

function uniqueValues(...values) {
  return [
    ...new Set(
      values
        .flat(Infinity)
        .filter(Boolean)
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  ];
}

function parseMetadata(value) {
  if (!value) return {};
  if (Buffer.isBuffer(value)) value = value.toString("utf8");
  if (typeof value === "string") {
    try {
      return JSON.parse(value || "{}");
    } catch {
      return {};
    }
  }
  return value;
}

function normalizeSlug(value = "") {
  return String(value)
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function showSlug(showNumber = "") {
  const slug = normalizeSlug(showNumber);
  return slug ? `${slug}-mostra` : "";
}

function extractShowNumber(title = "") {
  const match = String(title || "").trim().match(/^([IVXLCDM]+)\b/i);
  return match ? match[1].toUpperCase() : "";
}

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
    metadata.cinemaPath = createCinemaPage && metadata.showSlug ? `/cinema-e-ditadura/${metadata.showSlug}` : null;
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

async function listManageContents(summaryOnly = false) {
  if (summaryOnly) {
    const rows = await prisma.$queryRaw`
      SELECT id, title, description, type, researcherName, researcherMemberId, fileUrl, externalUrl, metadata, published, createdById, createdAt, updatedAt
      FROM Content
      ORDER BY createdAt DESC
    `;
    return rows.map((content) => ({
      ...content,
      metadata: parseMetadata(content.metadata),
      published: Boolean(content.published),
      createdBy: null,
      researcherMember: null,
      summaryOnly: false,
    }));
  }

  return prisma.content.findMany({
    include: {
      createdBy: { select: { id: true, name: true, role: true } },
      researcherMember: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  }).then((contents) => contents.map((content) => ({
    ...content,
    summaryOnly: false,
  })));
}

function parseContent(body, partial = false) {
  const data = {};
  const required = (field, label) => {
    if (!partial && !String(body[field] || "").trim()) throw new Error(`${label} e obrigatorio.`);
    if (body[field] !== undefined) data[field] = String(body[field]).trim();
  };

  required("title", "Titulo");
  required("researcherName", "Nome do pesquisador");
  if (!partial && !contentTypes.has(body.type)) throw new Error("Tipo de conteudo invalido.");
  if (body.type !== undefined) {
    if (!contentTypes.has(body.type)) throw new Error("Tipo de conteudo invalido.");
    data.type = body.type;
  }
  for (const field of ["description", "fileUrl", "externalUrl"]) {
    if (body[field] !== undefined) data[field] = String(body[field]).trim() || null;
  }
  if (body.researcherMemberId !== undefined) {
    data.researcherMemberId = body.researcherMemberId ? String(body.researcherMemberId).trim() || null : null;
  }
  if (body.metadata !== undefined) data.metadata = body.metadata;
  return normalizeContentData(data);
}

router.get("/", async (req, res) => {
  if (req.query.type && !contentTypes.has(req.query.type)) {
    return res.status(400).json({ error: "Tipo de conteudo invalido." });
  }
  const where = req.query.type ? { type: req.query.type, published: true } : { published: true };
  const contents = await prisma.content.findMany({
    where,
    include: {
      createdBy: { select: { id: true, name: true, role: true } },
      researcherMember: { select: { id: true, name: true, role: true } },
    },
    orderBy: { title: "asc" },
  });
  res.json({ contents });
});

router.get("/navigation", async (_req, res) => {
  const contents = await prisma.content.findMany({
    where: { published: true, type: { in: ["EVENT", "CINEMA_SHOW"] } },
    select: { id: true, title: true, type: true, metadata: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ contents });
});

router.get("/highlights", async (_req, res) => {
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
    orderBy: [{ createdAt: "desc" }],
    take: 12,
  });
  res.json({ contents });
});

router.get("/cinema-shows/:showSlug", async (req, res) => {
  const requestedSlug = normalizeSlug(req.params.showSlug);
  const contents = await prisma.content.findMany({
    where: { published: true, type: "CINEMA_SHOW" },
    include: {
      createdBy: { select: { id: true, name: true, role: true } },
      researcherMember: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  const content = contents.find((item) => {
    const metadata = item.metadata || {};
    const slug = normalizeSlug(metadata.showSlug || "");
    const pathSlug = normalizeSlug(String(metadata.cinemaPath || "").split("/").filter(Boolean).pop() || "");
    return slug === requestedSlug || pathSlug === requestedSlug;
  });
  if (!content) return res.status(404).json({ error: "Mostra nao encontrada." });
  res.json({ content });
});

router.get("/events/year/:year", async (req, res) => {
  const requestedYear = String(req.params.year || "").trim();
  const contents = await prisma.content.findMany({
    where: { published: true, type: { in: ["EVENT", "CINEMA_SHOW"] } },
    include: {
      createdBy: { select: { id: true, name: true, role: true } },
      researcherMember: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({
    contents: contents.filter((item) => {
      const metadata = item.metadata || {};
      const year = String(metadata.eventYear || metadata.year || metadata.showYear || "").trim();
      return year === requestedYear;
    }),
  });
});

router.get("/manage", requireAuth, async (req, res) => {
  try {
    const contents = await listManageContents(req.query.summary === "1");
    res.json({ contents, adminFallback: false });
  } catch (error) {
    console.error("Erro ao listar painel administrativo. Usando acervo publicado:", error);
    const contents = await prisma.content.findMany({
      where: { published: true },
      include: {
        createdBy: { select: { id: true, name: true, role: true } },
        researcherMember: { select: { id: true, name: true, role: true } },
      },
      orderBy: { title: "asc" },
    });
    res.json({ contents, adminFallback: true });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  const content = await prisma.content.findUnique({
    where: { id: req.params.id },
    include: {
      createdBy: { select: { id: true, name: true, role: true } },
      researcherMember: { select: { id: true, name: true, role: true } },
    },
  });
  if (!content) return res.status(404).json({ error: "Conteudo nao encontrado." });
  res.json({ content: { ...content, summaryOnly: false } });
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const data = parseContent(req.body);
    const content = await prisma.content.create({ data: { ...data, createdById: req.user.id } });
    if (req.user.role !== "COORDINATOR") {
      notifyCoordinatorContentChange({ content, user: req.user }).catch((error) => console.error(error));
    }
    res.status(201).json({ content });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const existing = await prisma.content.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Conteudo nao encontrado." });
    const isCoordinator = req.user.role === "COORDINATOR";

    const data = parseContent(req.body, true);
    if (req.body.published !== undefined) {
      if (!isCoordinator) return res.status(403).json({ error: "Apenas a coordenacao pode publicar conteudos." });
      data.published = Boolean(req.body.published);
    } else if (!isCoordinator) {
      data.published = false;
    }

    const content = await prisma.content.update({ where: { id: req.params.id }, data });
    if (!isCoordinator) {
      notifyCoordinatorContentChange({ content, user: req.user, action: "updated" }).catch((error) => console.error(error));
    }
    res.json({ content });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", requireAuth, requireCoordinator, async (req, res) => {
  await prisma.content.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

module.exports = router;
