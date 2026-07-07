require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  { title: "Tatuagem", youtubeId: "UwSX2SlHpEg", director: "Hilton Lacerda", genre: "Drama", country: "Brasil", year: "2013", duration: "110 min", description: "Ao iniciar o esgotamento político do golpe militar no Brasil (1978) acompanhamos o romance entre um soldado de dezoito anos e um agitador cultural, dono de um cabaré anarquista. Confrontos e reflexões de uma geração analisados a partir da periferia. A exceção pautando a visão da regra." },
  { title: "Tempo de Resistência", youtubeId: "7o8z0L7t6pw", director: "André Ristum", genre: "Documentário", country: "Brasil", year: "2005", duration: "1h55min", description: "A luta guerrilheira contra a ditadura militar nos anos 60 e início dos anos 70, a partir do ponto de vista de seus integrantes na época. Uma avaliação real do que foi a resistência armada no Brasil em seu período mais crítico. Com depoimentos e imagens de arquivo, o documentário aborda o processo desde o golpe militar até a anistia e o Movimento das Diretas Já." },
  { title: "Terra em Transe", youtubeId: "OqgnXHvy9L0", director: "Glauber Rocha", genre: "Drama", country: "Brasil", year: "1967", duration: "115 min", description: "O senador Porfírio Diaz detesta seu povo e pretende tornar-se imperador de Eldorado, um país localizado na América do Sul. Porém existem diversos homens que querem este poder, que resolvem enfrentá-lo. Enquanto isso, o poeta e jornalista Paulo Martins, ao perceber as reais intenções de Diaz, muda de lado, abandonando seu antigo protetor." },
  { title: "Torre das Donzelas", youtubeId: "xxUzXbiksIo", director: "Susanna Lira", genre: "Documentário", country: "Brasil", year: "2019", duration: "92 min", website: "https://www.torredasdonzelas.com.br/", description: "O documentário de longa-metragem recupera a história de um grupo de mulheres presas políticas que ocupou uma cela no presídio Tiradentes. Quebrando o silêncio, 40 anos depois, essas mulheres, ex-companheiras de cela de Dilma Rousseff, revelam como viveram juntas no cárcere sob a ditadura militar. Elas estiveram presas na década de 70 na Torre das Donzelas, como era chamada uma ala de celas femininas no alto do Presídio Tiradentes, em São Paulo. Para o local eram levados os presos políticos, depois de passarem por órgãos da repressão como o DOPS e o DOI-CODI. Este grupo de mulheres pôde se articular com certa desenvoltura dentro da prisão, onde cozinhavam, ouviam música e liam, criando um ambiente de pensamento e também de amizade. O filme vai narrar, portanto, como a história democrática do Brasil se desenhou durante os anos em que essas mulheres estiveram presas na Torre das Donzelas." },
];

async function main() {
  const importer = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!importer) throw new Error("Usuário de importação do acervo não encontrado.");
  for (const film of films) {
    const externalUrl = `https://www.youtube.com/watch?v=${film.youtubeId}`;
    const metadata = { youtubeId: film.youtubeId, videoProvider: "youtube", imageUrl: `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`, director: film.director, genre: film.genre, country: film.country, year: film.year, duration: film.duration, website: film.website };
    const existing = await prisma.content.findFirst({ where: { type: "FILM", title: film.title } });
    const data = { title: film.title, description: film.description, type: "FILM", researcherName: "Equipe LACE", externalUrl, metadata, published: true, createdById: importer.id };
    if (existing) await prisma.content.update({ where: { id: existing.id }, data });
    else await prisma.content.create({ data });
  }
  console.log(`${films.length} filmes da letra T importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
