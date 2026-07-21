const express = require("express");
const prisma = require("../db");
const { requireAuth, requireCoordinator } = require("../middleware/auth");
const { notifyCoordinatorContentChange } = require("../services/notifications");

const router = express.Router();
const contentTypes = new Set(["FILM", "GLOSSARY", "CINEMA_SHOW", "ARTICLE", "RESEARCH", "TRANSLATION", "VIRAL_ESCAPE_LINES", "INTERVIEW", "PODCAST", "EVENT", "OTHER"]);

function parseMetadata(value) {
  if (!value || typeof value !== "string") return value || null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function listManageContents() {
  try {
    return await prisma.content.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("Erro ao listar conteudos pelo Prisma:", error);
    const rows = await prisma.$queryRaw`
      SELECT id, title, description, type, researcherName, researcherMemberId, fileUrl, externalUrl, metadata, published, createdById, createdAt, updatedAt
      FROM Content
      ORDER BY createdAt DESC
    `;
    return rows.map((row) => ({
      ...row,
      metadata: parseMetadata(row.metadata),
      published: Boolean(row.published),
    }));
  }
}

function attachContentRelations(contents, users = [], members = []) {
  const usersById = new Map(users.map((user) => [user.id, user]));
  const membersById = new Map(members.map((member) => [member.id, member]));

  return contents.map((content) => ({
    ...content,
    createdBy: usersById.get(content.createdById) || content.createdBy || null,
    researcherMember: content.researcherMemberId
      ? membersById.get(content.researcherMemberId) || content.researcherMember || null
      : content.researcherMember || null,
  }));
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

router.get("/manage", requireAuth, async (req, res) => {
  try {
    const contents = await listManageContents();
    let users = [];
    let members = [];
    try {
      users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
    } catch (error) {
      console.error("Erro ao listar usuarios para o painel:", error);
    }
    try {
      members = await prisma.teamMember.findMany({ select: { id: true, name: true, role: true } });
    } catch (error) {
      console.error("Erro ao listar equipe para o painel:", error);
    }

    res.json({ contents: attachContentRelations(contents, users, members), adminFallback: false });
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
