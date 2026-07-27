const {
  createTeamMember,
  deleteTeamMember,
  listTeamMemberChanges,
  listTeamMembers,
  proposeTeamMemberChange,
  reviewTeamMemberChange,
  updateTeamMember,
} = require("../services/team.service");
const { parseTeamMember } = require("../validators/team.validator");

function responseError(res, error) {
  if (error?.code === "P2002") return res.status(409).json({ error: "Já existe um integrante com esse nome." });
  if (error?.code === "P2025") return res.status(404).json({ error: "Integrante não encontrado." });
  return res.status(400).json({ error: error.message || "Não foi possível salvar o integrante." });
}

async function listPublic(_req, res) {
  const members = await listTeamMembers();
  res.set("Cache-Control", "no-cache, max-age=0");
  return res.json({ members });
}

async function listManage(_req, res) {
  const members = await listTeamMembers({ manage: true });
  return res.json({ members });
}

async function listChanges(req, res) {
  const changes = await listTeamMemberChanges(req.user);
  return res.json({ changes });
}

async function proposeUpdate(req, res) {
  try {
    const payload = parseTeamMember(req.body);
    const change = await proposeTeamMemberChange(req.body.teamMemberId, payload, req.user.id);
    return res.status(201).json({ change });
  } catch (error) {
    return responseError(res, error);
  }
}

async function create(req, res) {
  try {
    const member = await createTeamMember(parseTeamMember(req.body));
    return res.status(201).json({ member });
  } catch (error) {
    return responseError(res, error);
  }
}

async function update(req, res) {
  try {
    const member = await updateTeamMember(req.params.id, parseTeamMember(req.body));
    return res.json({ member });
  } catch (error) {
    return responseError(res, error);
  }
}

async function remove(req, res) {
  try {
    await deleteTeamMember(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return responseError(res, error);
  }
}

async function approveChange(req, res) {
  try {
    const result = await reviewTeamMemberChange(req.params.id, req.user.id, true);
    return res.json(result);
  } catch (error) {
    return responseError(res, error);
  }
}

async function rejectChange(req, res) {
  try {
    const result = await reviewTeamMemberChange(req.params.id, req.user.id, false);
    return res.json(result);
  } catch (error) {
    return responseError(res, error);
  }
}

module.exports = {
  approveChange,
  create,
  listChanges,
  listManage,
  listPublic,
  proposeUpdate,
  rejectChange,
  remove,
  update,
};
