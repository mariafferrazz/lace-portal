require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [{
  title: "Jango", youtubeId: "SaU6pIBv9f4",
  description: "O documentário refaz a trajetória política do 24° presidente brasileiro, deposto pelo golpe empresarial-militar nas primeiras horas de 1º de abril de 1964. O filme captura a efervescência da política brasileira durante a década de 1960 e narra os detalhes do golpe.",
  director: "Silvio Tendler", genre: "Documentário", country: "Brasil", year: "1984", duration: "117 min",
}];

async function main() {
  const importer = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!importer) throw new Error("Usuário de importação do acervo não encontrado.");
  for (const film of films) {
    const externalUrl = `https://www.youtube.com/watch?v=${film.youtubeId}`;
    const metadata = { youtubeId: film.youtubeId, videoProvider: "youtube", imageUrl: `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`, director: film.director, genre: film.genre, country: film.country, year: film.year, duration: film.duration };
    const existing = await prisma.content.findFirst({ where: { type: "FILM", title: film.title } });
    const data = { title: film.title, description: film.description, type: "FILM", researcherName: "Equipe LACE", externalUrl, metadata, published: true, createdById: importer.id };
    if (existing) await prisma.content.update({ where: { id: existing.id }, data });
    else await prisma.content.create({ data });
  }
  console.log(`${films.length} filme da letra J importado.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
