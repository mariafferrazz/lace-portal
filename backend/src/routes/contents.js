const express = require("express");
const { requireAuth, requireCoordinator } = require("../middleware/auth");
const contentController = require("./contents/controllers/content.controller");

const router = express.Router();

router.get("/", contentController.listPublished);
router.get("/navigation", contentController.listNavigation);
router.get("/highlights", contentController.listHighlightContents);
router.get("/youtube-playlist", contentController.getYoutubePlaylist);
router.get("/instagram-image", contentController.getInstagramImage);
router.get("/cinema-shows/:showSlug", contentController.getCinemaShow);
router.get("/events/year/:year", contentController.listEventsByYear);
router.get("/manage", requireAuth, contentController.listManage);
router.get("/manage/options", requireAuth, contentController.listManageOptions);
router.get("/:id", requireAuth, contentController.getManageContent);
router.post("/", requireAuth, contentController.create);
router.patch("/:id", requireAuth, contentController.update);
router.delete("/:id", requireAuth, requireCoordinator, contentController.remove);

module.exports = router;
