require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [{
  title: "Zuzu Angel", youtubeId: "OeRr1ipK-N0", director: "Sérgio Resende", genre: "Drama", country: "Brasil", year: "2006", duration: "108 min",
  description: "Brasil, anos 60. A ditadura militar faz o país mergulhar em um dos momentos mais difíceis de sua história. Alheia a tudo isto, Zuzu Angel (Patrícia Pillar), uma estilista de modas, fica cada vez mais famosa no Brasil e no exterior. Paralelamente seu filho, Stuart (Daniel de Oliveira), ingressa na luta armada, que combatia as arbitrariedades dos militares. Resumindo: as diferenças ideológicas entre mãe e filho eram profundas. Numa noite Zuzu recebe uma ligação, dizendo Stuart tinha sido preso pelos militares. As forças armadas negam. Pouco tempo depois ela recebe uma carta dizendo que Stuart foi torturado até a morte na aeronáutica. Então ela inicia uma batalha aparentemente simples: localizar o corpo do filho e enterrá-lo. Mas Zuzu vai se tornando uma figura cada vez mais incômoda para a ditadura.",
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
  console.log(`${films.length} filme da letra Z importado.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
