const express = require("express");
const { requireAuth, requireCoordinator } = require("../middleware/auth");
const teamController = require("./team/controllers/team.controller");

const router = express.Router();

router.get("/", teamController.listPublic);
router.get("/manage", requireAuth, teamController.listManage);
router.get("/changes", requireAuth, teamController.listChanges);
router.post("/changes", requireAuth, teamController.proposeUpdate);
router.patch("/changes/:id/approve", requireAuth, requireCoordinator, teamController.approveChange);
router.patch("/changes/:id/reject", requireAuth, requireCoordinator, teamController.rejectChange);
router.post("/", requireAuth, requireCoordinator, teamController.create);
router.patch("/:id", requireAuth, requireCoordinator, teamController.update);
router.delete("/:id", requireAuth, requireCoordinator, teamController.remove);

module.exports = router;
