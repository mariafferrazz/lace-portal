require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [{
  title: "Frei Tito",
  youtubeId: "IFB630-4B7Q",
  description: "O filme reconstitui a vida do dominicano, que ficou preso em São Paulo nas dependências do DOI-CODI, acusado de subversão e de participação no movimento liderado por Carlos Marighella. Exilado na França, comete suicídio em Lyon, em 10 de agosto de 1974, aos 29 anos. É considerado um mártir da Igreja Católica.",
  director: "A. Andrea Ippolito",
  genre: "Documentário",
  country: "Brasil",
  year: "1983",
  duration: "16 min",
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
  console.log(`${films.length} filme da letra F importado.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
