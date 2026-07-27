const maxLinks = 12;

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function validPublicUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function parseLinks(value) {
  if (!Array.isArray(value)) throw new Error("Os links da equipe devem ser enviados como uma lista.");
  if (value.length > maxLinks) throw new Error(`Adicione no máximo ${maxLinks} links por integrante.`);

  const links = value
    .map((link) => ({
      name: cleanText(link?.name, 60),
      url: cleanText(link?.url, 2048),
    }))
    .filter((link) => link.name || link.url);

  for (const link of links) {
    if (!link.name || !link.url) throw new Error("Preencha o nome e a URL de cada link.");
    if (!validPublicUrl(link.url)) throw new Error(`Informe uma URL válida para o link “${link.name}”.`);
  }

  return [...new Map(links.map((link) => [link.url, link])).values()];
}

function parseTeamMember(body = {}) {
  const name = cleanText(body.name, 160);
  const role = cleanText(body.role || "Equipe LACE", 120);
  const bio = cleanText(body.bio, 20000);
  const links = parseLinks(body.links || []);

  if (!name) throw new Error("Informe o nome do integrante.");
  if (!role) throw new Error("Informe a função do integrante.");
  if (!bio) throw new Error("Informe a minibio do integrante.");

  return {
    name,
    role,
    bio,
    links,
    profileUrl: links[0]?.url || null,
    group: "TEAM",
    active: true,
  };
}

module.exports = { parseTeamMember };
