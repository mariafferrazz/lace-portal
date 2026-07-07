require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  { title: "Vlado – 30 Anos Depois", youtubeId: "pB8XCSwyOeU", director: "João Batista de Andrade", genre: "Documentário", country: "Brasil", year: "2005", duration: "90 min", description: "Um documentário sobre a história do jornalista Vladimir Herzog, o Vlado, que foi torturado e assassinado na prisão, em 1975 durante o golpe empresarial-militar brasileiro. Os depoimentos e memória das pessoas que conviveram com ele." },
  { title: "Vou Contar para os Meus Filhos", youtubeId: "-BhA-G6-2uo", director: "Tuca Siqueira", genre: "Documentário", country: "Brasil", year: "2012", duration: "24 min", description: "Entre 1969 e 1979, 24 mulheres estiveram presas na Colônia Penal Feminina do Bom Pastor, em Recife (PE), porque lutavam por igualdade social e pela democracia em uma época em que o Brasil enfrentava uma ditadura militar. Passados 40 anos, o reencontro delas, que hoje moram em diferentes estados do país, traz de volta não apenas os laços de solidariedade que surgiram no presídio, mas também a lembrança de um Brasil que tentou calar vozes e violentar sonhos. Este é um filme-memória indispensável para quem acredita na força de um ideal e da consciência política de um povo. Para quem não duvida que o tempo e a distância são capazes de abalar amizades verdadeiras. Uma história para jovens e adultos que se mantem viva por gerações." },
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
  console.log(`${films.length} filmes da letra V importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
