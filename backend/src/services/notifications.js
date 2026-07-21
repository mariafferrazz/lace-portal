const COORDINATOR_EMAIL = process.env.COORDINATOR_NOTIFY_EMAIL || process.env.COORDINATOR_1_EMAIL || "joanadferraz@gmail.com";
const NOTIFY_ENDPOINT = process.env.COORDINATOR_NOTIFY_WEBHOOK_URL || process.env.CONTACT_ENDPOINT || process.env.VITE_CONTACT_ENDPOINT;

function buildContentMessage(content, user, action) {
  const actionLabel = action === "updated" ? "atualizou um conteudo" : "enviou um novo conteudo";
  return [
    `O usuario ${user.name} (${user.email}) ${actionLabel} para revisao no painel LACE.`,
    "",
    `Titulo: ${content.title}`,
    `Pesquisador(a): ${content.researcherName}`,
    `Tipo: ${content.type}`,
    "",
    "Acesse o dashboard da coordenacao para revisar, editar e publicar ou manter em revisao.",
  ].join("\n");
}

async function notifyCoordinatorContentChange({ content, user, action = "created" }) {
  if (!NOTIFY_ENDPOINT) {
    console.info("Notificacao de coordenacao nao enviada: COORDINATOR_NOTIFY_WEBHOOK_URL nao configurado.");
    return;
  }

  const payload = {
    to: COORDINATOR_EMAIL,
    email: COORDINATOR_EMAIL,
    subject: action === "updated" ? "LACE: conteudo atualizado para revisao" : "LACE: novo conteudo para aprovacao",
    name: "Dashboard LACE",
    message: buildContentMessage(content, user, action),
    content: {
      id: content.id,
      title: content.title,
      type: content.type,
      researcherName: content.researcherName,
    },
  };

  try {
    const response = await fetch(NOTIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Falha ao notificar coordenacao:", response.status, await response.text());
    }
  } catch (error) {
    console.error("Falha ao notificar coordenacao:", error);
  }
}

module.exports = { notifyCoordinatorContentChange };
