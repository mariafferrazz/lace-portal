require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [{
  title: "Hoje",
  youtubeId: "hJWB20ToHQ4",
  description: "Vera recebe compensação do governo brasileiro pelo desaparecimento do seu marido durante a ditadura. Com o dinheiro, decide comprar um lindo apartamento. Porém, uma visita muda completamente a vida de Vera.",
  director: "Tata Amaral",
  genre: "Drama/Romance",
  country: "Brasil",
  year: "2011",
  duration: "90 min",
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
  console.log(`${films.length} filme da letra H importado.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
