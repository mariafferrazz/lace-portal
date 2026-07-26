const COORDINATOR_EMAIL = process.env.COORDINATOR_NOTIFY_EMAIL || process.env.COORDINATOR_1_EMAIL || "joanadferraz@gmail.com";
const NOTIFY_ENDPOINT = process.env.COORDINATOR_NOTIFY_WEBHOOK_URL || process.env.CONTACT_ENDPOINT || process.env.VITE_CONTACT_ENDPOINT;

function buildContentMessage(content, user, action) {
  const actionLabel = action === "updated" ? "atualizou um conteúdo" : "enviou um novo conteúdo";
  return [
    `O usuário ${user.name} (${user.email}) ${actionLabel} para revisão no painel LACE.`,
    "",
    `Título: ${content.title}`,
    `Pesquisador(a): ${content.researcherName}`,
    `Tipo: ${content.type}`,
    "",
    "Acesse o painel da coordenação para revisar, editar, publicar ou manter o conteúdo em revisão.",
  ].join("\n");
}

async function notifyCoordinatorContentChange({ content, user, action = "created" }) {
  if (!NOTIFY_ENDPOINT) {
    console.info("Notificação da coordenação não enviada: COORDINATOR_NOTIFY_WEBHOOK_URL não configurado.");
    return;
  }

  const payload = {
    to: COORDINATOR_EMAIL,
    email: user.email,
    subject: action === "updated" ? "LACE: conteúdo atualizado para revisão" : "LACE: novo conteúdo para aprovação",
    name: "Dashboard LACE",
    source: "dashboard.lablace.com.br",
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
      console.error("Falha ao notificar a coordenação:", response.status, await response.text());
    }
  } catch (error) {
    console.error("Falha ao notificar a coordenação:", error);
  }
}

module.exports = { notifyCoordinatorContentChange };
