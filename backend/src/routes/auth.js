const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const publicUser = { id: true, name: true, email: true, role: true };

router.post("/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) return res.status(400).json({ error: "E-mail e senha são obrigatórios." });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.active || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "E-mail ou senha inválidos." });
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.cookie("lace_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 8 * 60 * 60 * 1000,
    path: "/",
  });
  res.json({ user: Object.fromEntries(Object.keys(publicUser).map((key) => [key, user[key]])) });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("lace_session", { httpOnly: true, sameSite: "strict", path: "/" });
  res.status(204).end();
});

router.get("/me", requireAuth, (req, res) => res.json({ user: req.user }));

module.exports = router;
