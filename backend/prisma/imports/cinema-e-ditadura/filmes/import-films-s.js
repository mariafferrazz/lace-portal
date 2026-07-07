require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  { title: "Senhoras do Dendê", youtubeId: "0voAYZ71SNA", description: null },
  { title: "Se um de Nós se Cala", youtubeId: "Uu-VzWN6m_I", director: "Célia Maria Alves e Vera Côrtes", genre: "Documentário", country: "Brasil", year: "2013", duration: "1h8min", description: "Se um de nós se cala insere Goiás no contexto do golpe militar de 1964. A partir de relatos de anistiados que à época eram jovens estudantes e militantes políticos, o documentário resgata e revela os motivos pelos quais Goiás foi o único estado brasileiro que sofreu intervenção militar e como a ditadura foi cruel com os brasileiros e goianos que ousaram não se calar." },
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
  console.log(`${films.length} filmes da letra S importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
