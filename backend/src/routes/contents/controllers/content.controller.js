const { contentTypes } = require("../constants");
const {
  createContent,
  deleteContent,
  findContentById,
  findManageContent,
  listCinemaShowSourceContents,
  listEventYearSourceContents,
  listFilmsForEnrichment,
  listHighlights,
  listManageContents,
  listManageReferenceOptions,
  listNavigationContents,
  listPublishedContents,
  updateContent,
} = require("../services/content.service");
const { enrichCinemaShows } = require("../services/cinemaShow.service");
const { normalizeSlug } = require("../utils/content.utils");
const { parseContent } = require("../validators/content.validator");
const { notifyCoordinatorContentChange } = require("../../../services/notifications");

function disablePublicCache(res) {
  res.set("Cache-Control", "no-store, max-age=0");
}

async function listPublished(req, res) {
  if (req.query.type && !contentTypes.has(req.query.type)) {
    return res.status(400).json({ error: "Tipo de conteudo invalido." });
  }

  disablePublicCache(res);
  const contents = await listPublishedContents(req.query.type);
  return res.json({ contents });
}

async function listNavigation(_req, res) {
  disablePublicCache(res);
  const contents = await listNavigationContents();
  return res.json({ contents });
}

async function listHighlightContents(_req, res) {
  disablePublicCache(res);
  const contents = await listHighlights();
  return res.json({ contents });
}

async function getCinemaShow(req, res) {
  disablePublicCache(res);
  const requestedSlug = normalizeSlug(req.params.showSlug);
  const contents = await listCinemaShowSourceContents();
  const content = enrichCinemaShows(contents).find((item) => {
    if (item.type !== "CINEMA_SHOW") return false;
    const metadata = item.metadata || {};
    if (metadata.createCinemaPage === false || !metadata.cinemaPath) return false;
    const slug = normalizeSlug(metadata.showSlug || "");
    const pathSlug = normalizeSlug(
      String(metadata.cinemaPath || "").split("/").filter(Boolean).pop() || "",
    );
    return slug === requestedSlug || pathSlug === requestedSlug;
  });

  if (!content) return res.status(404).json({ error: "Mostra nao encontrada." });
  return res.json({ content });
}

async function listEventsByYear(req, res) {
  disablePublicCache(res);
  const requestedYear = String(req.params.year || "").trim();
  const contents = await listEventYearSourceContents();

  return res.json({
    contents: enrichCinemaShows(contents).filter((item) => {
      if (!["EVENT", "CINEMA_SHOW"].includes(item.type)) return false;
      const metadata = item.metadata || {};
      const year = String(metadata.eventYear || metadata.year || metadata.showYear || "").trim();
      return year === requestedYear;
    }),
  });
}

async function listManage(req, res) {
  try {
    const contents = await listManageContents({ summary: req.query.summary === "1" });
    return res.json({ contents });
  } catch (error) {
    console.error("Erro ao listar painel administrativo:", error);
    return res.status(500).json({ error: "Nao foi possivel carregar os conteudos administrativos." });
  }
}

async function listManageOptions(_req, res) {
  const options = await listManageReferenceOptions();
  return res.json(options);
}

async function getManageContent(req, res) {
  const content = await findManageContent(req.params.id);
  if (!content) return res.status(404).json({ error: "Conteudo nao encontrado." });

  if (content.type !== "CINEMA_SHOW") {
    return res.json({ content: { ...content, summaryOnly: false } });
  }

  const films = await listFilmsForEnrichment();
  const enrichedContent = enrichCinemaShows([...films, { ...content, summaryOnly: false }])
    .find((item) => item.id === content.id);

  return res.json({ content: enrichedContent || { ...content, summaryOnly: false } });
}

async function create(req, res) {
  try {
    const data = parseContent(req.body);
    if (req.user.role === "COORDINATOR") data.published = true;
    const content = await createContent(data, req.user.id);

    if (req.user.role !== "COORDINATOR") {
      notifyCoordinatorContentChange({ content, user: req.user })
        .catch((error) => console.error(error));
    }

    return res.status(201).json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const existing = await findContentById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Conteudo nao encontrado." });

    const isCoordinator = req.user.role === "COORDINATOR";
    const data = parseContent(req.body, true);

    if (req.body.published !== undefined) {
      if (!isCoordinator) {
        return res.status(403).json({ error: "Apenas a coordenacao pode publicar conteudos." });
      }
      data.published = Boolean(req.body.published);
    } else if (!isCoordinator) {
      data.published = false;
    }

    const content = await updateContent(req.params.id, data);

    if (!isCoordinator) {
      notifyCoordinatorContentChange({ content, user: req.user, action: "updated" })
        .catch((error) => console.error(error));
    }

    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function remove(req, res) {
  await deleteContent(req.params.id);
  return res.status(204).end();
}

module.exports = {
  listPublished,
  listNavigation,
  listHighlightContents,
  getCinemaShow,
  listEventsByYear,
  listManage,
  listManageOptions,
  getManageContent,
  create,
  update,
  remove,
};
