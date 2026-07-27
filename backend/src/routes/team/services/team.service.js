const prisma = require("../../../db");

function fallbackLinkName(url = "") {
  if (url.includes("lattes.cnpq.br")) return "Lattes";
  if (url.includes("linkedin.com")) return "LinkedIn";
  return "Site";
}

function normalizedLinks(member) {
  const rawLinks = Array.isArray(member.links) ? member.links : [];
  const links = rawLinks
    .map((link) => ({ name: String(link?.name || "").trim(), url: String(link?.url || "").trim() }))
    .filter((link) => link.name && /^https?:\/\//i.test(link.url));

  if (member.profileUrl && !links.some((link) => link.url === member.profileUrl)) {
    links.push({ name: fallbackLinkName(member.profileUrl), url: member.profileUrl });
  }
  return [...new Map(links.map((link) => [link.url, link])).values()];
}

function serializeMember(member, manage = false) {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    bio: member.bio,
    profileUrl: member.profileUrl,
    links: normalizedLinks(member),
    group: member.group,
    ...(manage ? { sortOrder: member.sortOrder, active: member.active } : {}),
  };
}

function serializeChange(change) {
  return {
    id: change.id,
    status: change.status,
    payload: change.payload,
    teamMemberId: change.teamMemberId,
    teamMember: change.teamMember ? serializeMember(change.teamMember, true) : null,
    submittedBy: change.submittedBy || null,
    reviewedBy: change.reviewedBy || null,
    reviewedAt: change.reviewedAt,
    createdAt: change.createdAt,
    updatedAt: change.updatedAt,
  };
}

async function listTeamMembers({ manage = false } = {}) {
  const members = await prisma.teamMember.findMany({
    where: manage ? undefined : { active: true },
    orderBy: [{ group: "asc" }, { name: "asc" }],
  });
  return members.map((member) => serializeMember(member, manage));
}

async function createTeamMember(data) {
  const aggregate = await prisma.teamMember.aggregate({ _max: { sortOrder: true } });
  const member = await prisma.teamMember.create({
    data: { ...data, sortOrder: (aggregate._max.sortOrder ?? -1) + 1 },
  });
  return serializeMember(member, true);
}

async function updateTeamMember(id, data) {
  const member = await prisma.teamMember.update({ where: { id }, data });
  return serializeMember(member, true);
}

async function deleteTeamMember(id) {
  return prisma.teamMember.delete({ where: { id } });
}

const changeInclude = {
  teamMember: true,
  submittedBy: { select: { id: true, name: true, role: true } },
  reviewedBy: { select: { id: true, name: true, role: true } },
};

async function listTeamMemberChanges(user) {
  const changes = await prisma.teamMemberChange.findMany({
    where: {
      status: "PENDING",
      ...(user.role === "COORDINATOR" ? {} : { submittedById: user.id }),
    },
    include: changeInclude,
    orderBy: { createdAt: "desc" },
  });
  return changes.map(serializeChange);
}

async function proposeTeamMemberChange(teamMemberId, payload, userId) {
  const teamMember = await prisma.teamMember.findUnique({ where: { id: teamMemberId } });
  if (!teamMember) {
    const error = new Error("Integrante não encontrado.");
    error.code = "P2025";
    throw error;
  }

  const pending = await prisma.teamMemberChange.findFirst({
    where: { teamMemberId, submittedById: userId, status: "PENDING" },
  });
  const change = pending
    ? await prisma.teamMemberChange.update({
      where: { id: pending.id },
      data: { payload },
      include: changeInclude,
    })
    : await prisma.teamMemberChange.create({
      data: { teamMemberId, submittedById: userId, payload },
      include: changeInclude,
    });
  return serializeChange(change);
}

async function reviewTeamMemberChange(id, reviewerId, approved) {
  const change = await prisma.teamMemberChange.findUnique({ where: { id } });
  if (!change || change.status !== "PENDING") {
    const error = new Error("Proposta pendente não encontrada.");
    error.code = "P2025";
    throw error;
  }

  const reviewedAt = new Date();
  await prisma.$transaction(async (transaction) => {
    if (approved) {
      await transaction.teamMember.update({
        where: { id: change.teamMemberId },
        data: change.payload,
      });
    }
    await transaction.teamMemberChange.update({
      where: { id },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
        reviewedById: reviewerId,
        reviewedAt,
      },
    });
  });

  return { approved, teamMemberId: change.teamMemberId };
}

module.exports = {
  createTeamMember,
  deleteTeamMember,
  listTeamMemberChanges,
  listTeamMembers,
  proposeTeamMemberChange,
  reviewTeamMemberChange,
  updateTeamMember,
};
