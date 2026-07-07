const jwt = require("jsonwebtoken");
const prisma = require("../db");

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.lace_session;
    if (!token) return res.status(401).json({ error: "Autenticação necessária." });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true, active: true },
    });

    if (!user?.active) return res.status(401).json({ error: "Acesso inválido ou desativado." });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Sessão inválida ou expirada." });
  }
}

function requireCoordinator(req, res, next) {
  if (req.user.role !== "COORDINATOR") {
    return res.status(403).json({ error: "Apenas a coordenação pode realizar esta ação." });
  }
  next();
}

module.exports = { requireAuth, requireCoordinator };
