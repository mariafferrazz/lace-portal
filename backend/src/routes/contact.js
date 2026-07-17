const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();
const recipientEmail = process.env.CONTACT_TO_EMAIL || "lab.lace.uff@gmail.com";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  });
}

function clean(value) {
  return String(value || "").trim();
}

router.post("/", async (req, res) => {
  const name = clean(req.body.name);
  const email = clean(req.body.email).toLowerCase();
  const message = clean(req.body.message);

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Nome, e-mail e mensagem são obrigatórios." });
  }

  const transporter = getTransporter();
  if (!transporter) {
    return res.status(503).json({ error: "Envio de e-mail ainda não configurado." });
  }

  await transporter.sendMail({
    from: `"Portal LACE" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    replyTo: `${name} <${email}>`,
    to: recipientEmail,
    subject: `Contato pelo portal LACE - ${name}`,
    text: `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`,
  });

  res.status(204).end();
});

module.exports = router;
