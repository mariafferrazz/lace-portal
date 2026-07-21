const express = require("express");
const prisma = require("../db");
const { requireAuth, requireCoordinator } = require("../middleware/auth");
const { notifyCoordinatorContentChange } = require("../services/notifications");

const router = express.Router();
const contentTypes = new Set(["FILM", "GLOSSARY", "CINEMA_SHOW", "ARTICLE", "RESEARCH", "TRANSLATION", "VIRAL_ESCAPE_LINES", "INTERVIEW", "PODCAST", "EVENT", "OTHER"]);

async function listManageContents(summaryOnly = false) {
  if (summaryOnly) {
    return prisma.content.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        researcherName: true,
        researcherMemberId: true,
        metadata: true,
        published: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, name: true, role: true } },
        researcherMember: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    }).then((contents) => contents.map((content) => ({
      ...content,
      description: null,
      fileUrl: null,
      externalUrl: null,
      summaryOnly: true,
    })));
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
  return data;
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
