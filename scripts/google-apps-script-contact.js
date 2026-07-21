const CONTACT_EMAIL = "lab.lace.uff@gmail.com";
const COORDINATOR_EMAIL = "joanadferraz@gmail.com";
const ALLOWED_RECIPIENTS = [CONTACT_EMAIL, COORDINATOR_EMAIL];

function doGet() {
  return jsonResponse({
    ok: true,
    service: "LACE contact and dashboard notifications",
    contactEmail: CONTACT_EMAIL,
    coordinatorEmail: COORDINATOR_EMAIL,
  });
}

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || "{}");
    const recipient = resolveRecipient(data);
    const isDashboardNotification = recipient === COORDINATOR_EMAIL || data.content;

    if (isDashboardNotification) {
      return sendDashboardNotification(data, recipient);
    }

    return sendContactMessage(data, recipient);
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function sendContactMessage(data, recipient) {
    const name = sanitize(data.name);
    const email = sanitize(data.email);
    const message = sanitize(data.message);
    const source = sanitize(data.source || "lablace.com.br");
    const subject = sanitize(data.subject) || `Contato pelo portal LACE - ${name}`;

    if (!name || !email || !message) {
      return jsonResponse({ ok: false, error: "Nome, e-mail e mensagem sao obrigatorios." });
    }

    MailApp.sendEmail({
      to: recipient,
      replyTo: email,
      subject,
      body: [
        `Nome: ${name}`,
        `E-mail: ${email}`,
        `Origem: ${source}`,
        "",
        "Mensagem:",
        message,
      ].join("\n"),
    });

  return jsonResponse({ ok: true, type: "contact", recipient });
}

function sendDashboardNotification(data, recipient) {
  const userName = sanitize(data.name || "Dashboard LACE");
  const userEmail = sanitize(data.email || CONTACT_EMAIL);
  const message = sanitize(data.message);
  const source = sanitize(data.source || "dashboard.lablace.com.br");
  const subject = sanitize(data.subject) || "LACE: novo conteudo para aprovacao";

  if (!message) {
    return jsonResponse({ ok: false, error: "Mensagem da notificacao e obrigatoria." });
  }

  MailApp.sendEmail({
    to: recipient,
    replyTo: userEmail,
    subject,
    body: [
      `Origem: ${source}`,
      `Responsavel: ${userName}`,
      `E-mail: ${userEmail}`,
      "",
      message,
    ].join("\n"),
  });

  return jsonResponse({ ok: true, type: "dashboard-notification", recipient });
}

function resolveRecipient(data) {
  const requestedRecipient = sanitize(data.to || data.recipient || data.emailTo);
  return ALLOWED_RECIPIENTS.includes(requestedRecipient)
    ? requestedRecipient
    : CONTACT_EMAIL;
}

function sanitize(value) {
  return String(value || "").trim();
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
