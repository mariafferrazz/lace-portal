const express = require("express");
const prisma = require("../db");

const router = express.Router();

router.get("/", async (_req, res) => {
  const members = await prisma.teamMember.findMany({
    where: { active: true },
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  const responseMembers = members.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    bio: member.bio,
    profileUrl: member.profileUrl,
    group: member.group,
  }));

  res.set("Cache-Control", "no-cache, max-age=0");
  res.json({ members: responseMembers });
});

module.exports = router;
