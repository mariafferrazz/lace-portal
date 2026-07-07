require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  {
    title: "Labirinto de Papel", youtubeId: "gjgk8YAmZ20", director: "André Araújo e Roberto Giovannetti", genre: "Documentário", country: "Brasil", year: "2014", duration: "29 min",
    description: "Um grupo de pesquisadores do Tocantins busca elucidar eventos envolvendo militantes e o exército durante o período da ditadura civil-militar brasileira na região do então norte de Goiás.",
  },
  {
    title: "Lamarca", youtubeId: "Wy1g8kRMD5Q", director: "Sérgio Rezende", genre: "Drama", country: "Brasil", year: "1994", duration: "130 min",
    description: "Crônica dos últimos anos na vida do capitão do exército Carlos Lamarca (Paulo Betti) que, nos anos da ditadura, desertou das forças armadas, e passou a fazer oposição, tornando-se um guerrilheiro na luta contra a ditadura.",
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
  console.log(`${films.length} filmes da letra L importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
