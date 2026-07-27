const express = require("express");
const prisma = require("../db");

const router = express.Router();

function linkName(url = "") {
  if (url.includes("lattes.cnpq.br")) return "Lattes";
  if (url.includes("linkedin.com")) return "LinkedIn";
  return "Site";
}

function memberLinks(member) {
  const rawLinks = Array.isArray(member.links) ? member.links : [];
  const links = rawLinks
    .map((link) => ({ name: String(link?.name || "").trim(), url: String(link?.url || "").trim() }))
    .filter((link) => link.name && /^https?:\/\//i.test(link.url));

  if (member.profileUrl && !links.some((link) => link.url === member.profileUrl)) {
    links.push({ name: linkName(member.profileUrl), url: member.profileUrl });
  }
  return links;
}

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
    links: memberLinks(member),
    group: member.group,
  }));

  res.set("Cache-Control", "no-cache, max-age=0");
  res.json({ members: responseMembers });
});

module.exports = router;
