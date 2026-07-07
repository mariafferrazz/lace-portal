require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  {
    title: "Garage Olimpo", youtubeId: "olVrM2wN7hI", director: "Marcos Bechis", genre: "Drama", country: "Argentina, Itália e França", year: "1999", duration: "98 min",
    description: "Durante a ditatura militar na Argentina, Maria, uma jovem professora e militante de esquerda, é sequestrada por um esquadrão e mantida sob tortura em uma velha garagem. Félix, um agente secreto da polícia, leva uma vida dupla: é torturador de prisioneiros e um dedicado cidadão. Duas pessoas ligadas pela violência e tortura de uma época.",
  },
  {
    title: "Glauber o Filme, Labirinto do Brasil", youtubeId: "O1m0YQFrt5g", director: "Silvio Tendler", genre: "Documentário", country: "Brasil", year: "2004", duration: "97 min",
    description: "A vida e a morte de Glauber Rocha, o polêmico cineasta baiano que revolucionou o cinema, promovendo uma radical revisão na cultura brasileira. Imagens do enterro, depoimentos recentes de quem acompanhou sua trajetória, seus pensamentos e idéias explodem na tela num filme-tributo à memória de um artista que idealizava um cinema independente e libertário.",
  },
];

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
  console.log(`${films.length} filmes da letra G importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
