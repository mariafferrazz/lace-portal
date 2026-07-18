const RECIPIENT = "lab.lace.uff@gmail.com";

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || "{}");
    const name = sanitize(data.name);
    const email = sanitize(data.email);
    const message = sanitize(data.message);
    const source = sanitize(data.source || "lablace.com.br");

    if (!name || !email || !message) {
      return jsonResponse({ ok: false, error: "Nome, e-mail e mensagem são obrigatórios." });
    }

    MailApp.sendEmail({
      to: RECIPIENT,
      replyTo: email,
      subject: `Contato pelo portal LACE - ${name}`,
      body: [
        `Nome: ${name}`,
        `E-mail: ${email}`,
        `Origem: ${source}`,
        "",
        "Mensagem:",
        message,
      ].join("\n"),
    });

    return jsonResponse({ ok: true });
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
