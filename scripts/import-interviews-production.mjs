const API_BASE = process.env.API_BASE || "https://api.lablace.com.br/api";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Configure ADMIN_EMAIL e ADMIN_PASSWORD para importar as entrevistas.");
}

const interviews = [
  {
    title: "Cecília Coimbra e Joana D'Arc (Grupo Tortura Nunca Mais RJ) - Núcleo de Educação e Cultura",
    externalUrl: "https://www.youtube.com/watch?v=KwEtO_vb3yg",
    youtubeId: "KwEtO_vb3yg",
  },
  {
    title: "Conversa sobre Gabriel Tarde com a Professora Joana D'Arc e Diego Monteiro",
    externalUrl: "https://www.youtube.com/watch?v=Jw-Gob3ziug",
    youtubeId: "Jw-Gob3ziug",
  },
  {
    title: "9º Bate papo sobre a pandemia: edição especial dia internacional de luta contra a tortura",
    externalUrl: "https://www.youtube.com/watch?v=7v2FhOGzZYg",
    youtubeId: "7v2FhOGzZYg",
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

for (const interview of interviews) {
  const body = {
    title: interview.title,
    description: "Entrevista disponível no canal do LACE no YouTube.",
    type: "INTERVIEW",
    researcherName: "Equipe LACE",
    externalUrl: interview.externalUrl,
    metadata: {
      platform: "YouTube",
      youtubeId: interview.youtubeId,
      thumbnail: `https://i.ytimg.com/vi/${interview.youtubeId}/hqdefault.jpg`,
    },
  };

  const existing = managed.contents.find((content) => (
    content.type === "INTERVIEW" &&
    (content.externalUrl === interview.externalUrl || content.metadata?.youtubeId === interview.youtubeId)
  ));

  if (existing) {
    await request(`/contents/${existing.id}`, { method: "PATCH", body: JSON.stringify(body) });
    await request(`/contents/${existing.id}`, { method: "PATCH", body: JSON.stringify({ published: true }) });
  } else {
    const created = await request("/contents", { method: "POST", body: JSON.stringify(body) });
    await request(`/contents/${created.content.id}`, { method: "PATCH", body: JSON.stringify({ published: true }) });
  }
}

const publicContents = await request("/contents?type=INTERVIEW");
console.log(`${publicContents.contents.length} entrevistas publicadas.`);
