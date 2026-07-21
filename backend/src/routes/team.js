const express = require("express");
const prisma = require("../db");

const router = express.Router();

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

router.get("/", async (_req, res) => {
  const [members, contents] = await Promise.all([
    prisma.teamMember.findMany({
      where: { active: true },
      orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.content.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        type: true,
        researcherName: true,
        researcherMemberId: true,
        externalUrl: true,
        fileUrl: true,
      },
      orderBy: { title: "asc" },
    }),
  ]);

  const responseMembers = members.map((member) => {
    const normalizedMemberName = normalizeName(member.name);
    const contributions = contents.filter((content) => (
      content.researcherMemberId === member.id ||
      normalizeName(content.researcherName) === normalizedMemberName
    ));

    return {
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      group: member.group,
      contributions: contributions.map((content) => ({
        id: content.id,
        title: content.title,
        type: content.type,
        externalUrl: content.externalUrl,
        fileUrl: content.fileUrl,
      })),
    };
  });

  res.json({ members: responseMembers });
});

module.exports = router;
