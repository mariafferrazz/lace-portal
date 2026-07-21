const DEFAULT_RECIPIENT = "lab.lace.uff@gmail.com";
const ALLOWED_RECIPIENTS = [
  DEFAULT_RECIPIENT,
  "joanadferraz@gmail.com",
];

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || "{}");
    const name = sanitize(data.name);
    const email = sanitize(data.email);
    const message = sanitize(data.message);
    const source = sanitize(data.source || "lablace.com.br");
    const requestedRecipient = sanitize(data.to || data.recipient || data.emailTo);
    const recipient = ALLOWED_RECIPIENTS.includes(requestedRecipient)
      ? requestedRecipient
      : DEFAULT_RECIPIENT;
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

    return jsonResponse({ ok: true, recipient });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function sanitize(value) {
  return String(value || "").trim();
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
