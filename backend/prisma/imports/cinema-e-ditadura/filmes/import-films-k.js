require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  {
    title: "Kamchatka", youtubeId: "efs26fn7bPU", director: "Marcelo Pineyro", genre: "Drama", country: "Argentina", year: "2003", duration: "104 min",
    description: "Harry (Matías Del Pozo) é um menino de 10 anos que tem uma vida normal para qualquer criança de sua idade na década de 70. Porém, sua vida muda completamente quando seus pais começam a ser perseguidos pela ditadura argentina. Para escapar dos militares, Harry e sua família são obrigados a largar todos os seus bens e fugir para uma fazenda no interior.",
  },
  {
    title: "Kóblic", youtubeId: "s0WJjktMhgM", director: "Sebastián Borensztein", genre: "Policial, história e suspense", country: "Argentina e Espanha", year: "2016", duration: "92 min",
    description: "Argentina, período da ditadura militar da década de 70. Kóblic (Ricardo Darín), um ex-capitão das Forças Armadas, é responsável por coordenar as operações aéreas conhecidas como os \"voos da morte\", onde elementos considerados subversivos eram arremessados de dentro dos aviões diretamente ao encontro do mar.",
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
  console.log(`${films.length} filmes da letra K importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
