require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  { title: "Repare Bem", youtubeId: "3N0_M8ODrO4", director: "Maria de Medeiros", genre: "Documentário", country: "Brasil", year: "2012", duration: "105 min", description: "Neste filme, a diretora realiza o documentário sobre ditadura, por meio da história de três gerações de mulheres. A partir dos testemunhos de uma mãe e sua filha, que vivenciaram a perseguição política da ditadura, o documentário trata de exílio e memória, levando o espectador a um mergulho profundo na história do Brasil a partir dos anos 1970." },
  { title: "Retratos de Identificação", youtubeId: "7tmN6VMaP8o", director: "Anita Leandro", description: "Dois combatentes da luta contra a ditadura militar no Brasil se deparam, pela primeira vez, com fotografias de suas respectivas prisões, tiradas pela polícia. O passado retorna, com uma história de crimes que ainda não foram julgados." },
  { title: "Robson Silveira da Luz: A Morte que Fez Nascer o Movimento Negro Unificado no Brasil", youtubeId: "WpTyc3TrYrE", description: null },
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
  console.log(`${films.length} filmes da letra R importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
