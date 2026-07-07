require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  { title: "Quase Dois Irmãos", youtubeId: "Y04L5EcZ0Oo", director: "Lúcia Murat", genre: "Drama", country: "Brasil, Chile e França", year: "2004", duration: "102 min", description: "Miguel é um Senador da República que visita seu amigo de infância Jorge, que se tornou um poderoso traficante de drogas do Rio de Janeiro, para lhe propôr um projeto social nas favelas. Apesar de suas origens diferentes eles se tornaram amigos nos anos 50, pois o pai de Miguel tinha paixão pela cultura negra e o pai de Jorge era compositor de sambas. Nos anos 70 eles se encontram novamente, na prisão de Ilha Grande. Ali as diferenças raciais eram mais evidentes: enquanto a maior parte dos prisioneiros brancos estava lá por motivos políticos, a maioria dos prisioneiros negros era de criminosos comuns." },
  { title: "Que Bom Te Ver Viva", youtubeId: "zqpybT37k9A", director: "Lúcia Murat", genre: "Documentário", country: "Brasil", year: "1989", duration: "100 min", description: "O filme aborda a tortura durante o período de ditadura no Brasil, mostrando como suas vítimas sobreviveram e como encaram aqueles anos de violência duas décadas depois. O documentário mistura os delírios e fantasias de uma personagem anônima, interpretada pela atriz Irene Ravache, alinhavado os depoimentos de oito ex-presas políticas brasileiras que viveram situações de tortura. Mais do que descrever e enumerar sevícias, o filme mostra o preço que essas mulheres pagaram, e ainda pagam, por terem sobrevivido lúcidas à experiência de tortura." },
  { title: "Questão Racial: Da Ditadura à Democracia", youtubeId: "UHCQpM2IK14", description: null },
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
  console.log(`${films.length} filmes da letra Q importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
