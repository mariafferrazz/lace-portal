const express = require("express");
const prisma = require("../db");
const { requireAuth, requireCoordinator } = require("../middleware/auth");

const router = express.Router();
const contentTypes = new Set(["FILM", "GLOSSARY", "CINEMA_SHOW", "ARTICLE", "RESEARCH", "TRANSLATION", "VIRAL_ESCAPE_LINES", "INTERVIEW", "PODCAST", "EVENT", "OTHER"]);

function parseContent(body, partial = false) {
  const data = {};
  const required = (field, label) => {
    if (!partial && !String(body[field] || "").trim()) throw new Error(`${label} é obrigatório.`);
    if (body[field] !== undefined) data[field] = String(body[field]).trim();
  };

  required("title", "Título");
  required("researcherName", "Nome do pesquisador");
  if (!partial && !contentTypes.has(body.type)) throw new Error("Tipo de conteúdo inválido.");
  if (body.type !== undefined) {
    if (!contentTypes.has(body.type)) throw new Error("Tipo de conteúdo inválido.");
    data.type = body.type;
  }
  for (const field of ["description", "fileUrl", "externalUrl"]) {
    if (body[field] !== undefined) data[field] = String(body[field]).trim() || null;
  }
  if (body.metadata !== undefined) data.metadata = body.metadata;
  return data;
}

router.get("/", async (req, res) => {
  if (req.query.type && !contentTypes.has(req.query.type)) {
    return res.status(400).json({ error: "Tipo de conteúdo inválido." });
  }
  const where = req.query.type ? { type: req.query.type, published: true } : { published: true };
  const contents = await prisma.content.findMany({
    where,
    include: { createdBy: { select: { name: true, role: true } } },
    orderBy: { title: "asc" },
  });
  res.json({ contents });
});

router.get("/manage", requireAuth, async (_req, res) => {
  const contents = await prisma.content.findMany({
    include: { createdBy: { select: { name: true, email: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ contents });
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const data = parseContent(req.body);
    const content = await prisma.content.create({ data: { ...data, createdById: req.user.id } });
    res.status(201).json({ content });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const existing = await prisma.content.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Conteúdo não encontrado." });
    if (req.user.role !== "COORDINATOR" && existing.createdById !== req.user.id) {
      return res.status(403).json({ error: "Você não pode alterar este conteúdo." });
    }
    const data = parseContent(req.body, true);
    if (req.body.published !== undefined) {
      if (req.user.role !== "COORDINATOR") return res.status(403).json({ error: "Apenas a coordenação pode publicar." });
      data.published = Boolean(req.body.published);
    }
    const content = await prisma.content.update({ where: { id: req.params.id }, data });
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
