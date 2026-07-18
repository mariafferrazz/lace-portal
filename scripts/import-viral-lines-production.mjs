const API_BASE = process.env.API_BASE || "https://api.lablace.com.br/api";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Configure ADMIN_EMAIL e ADMIN_PASSWORD para importar Linhas de Fugas Virais.");
}

const contents = [
  {
    title: "Olha a Planta",
    researcherName: "Jose Ricardo Novaes",
    imageUrl: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000110-933e5933e9/planta-8.webp?ph=3554c7d1fd",
    description: `Olho a planta

C um ideal

Na cabeça

Mal olha

Já quer fotografar

Documentar

O ideal

Pra depois

Tá vendo

Ó aqui ó

Deixando

Pra depois

Como tudo

A sabença

De ver

A planta

E nenhuma

Foto

Pintura

Pendura

Em si

Uma nesga

D'O ideal

Não o verás

Nunca

Em tempo algum

Jamais

É inferno

Estar

Sempre

Antes

Ou depois

Nada q

Se escreva

Nem o verso

Poderia

Descreverter

Quiçá

Alice

Coltrane`,
    authorBio:
      'Lançado ao abismo em 4 de julho de 1966, é carioca da Zêene. Nascido e criado no Méier - no "subúrbio dos melhores dias", onde nunca deixará de estar no coração, mas o corpo já se espalha pelo mundo. Antiautor de dois livros de versos: "Poesia, a essa altura do Championship..." e "Malditos Processos", publicados pela Amazon. Professor de teatro, filho e pai coruja...',
  },
];

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json; charset=utf-8",
      cookie: request.cookie || "",
      ...(options.headers || {}),
    },
  });

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) request.cookie = setCookie.split(";")[0];

  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} falhou: ${response.status} ${await response.text()}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

await request("/auth/login", {
  method: "POST",
  body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
});

const managed = await request("/contents/manage");

for (const content of contents) {
  const body = {
    title: content.title,
    description: content.description,
    type: "VIRAL_ESCAPE_LINES",
    researcherName: content.researcherName,
    fileUrl: content.imageUrl,
    metadata: {
      thumbnail: content.imageUrl,
      authorBio: content.authorBio,
    },
  };

  const existing = managed.contents.find((item) => item.type === "VIRAL_ESCAPE_LINES" && item.title === content.title);

  if (existing) {
    await request(`/contents/${existing.id}`, { method: "PATCH", body: JSON.stringify(body) });
    await request(`/contents/${existing.id}`, { method: "PATCH", body: JSON.stringify({ published: true }) });
  } else {
    const created = await request("/contents", { method: "POST", body: JSON.stringify(body) });
    await request(`/contents/${created.content.id}`, { method: "PATCH", body: JSON.stringify({ published: true }) });
  }
}

const publicContents = await request("/contents?type=VIRAL_ESCAPE_LINES");
console.log(`${publicContents.contents.length} conteúdos de Linhas de Fugas Virais publicados.`);
