require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  { title: "Paula, a História de uma Subversiva", youtubeId: "Tv3LiqB0wt8", director: "Francisco Ramalho Jr.", duration: "1h35min", description: "Durante a ditadura, a amante de Marco Antônio, uma líder estudantil, foi torturada e morta pelo policial Oliveira. Anos mais tarde, a filha de Marco é sequestrada após uma festa, e é a este policial que ele precisa recorrer." },
  { title: "Peões", youtubeId: "EguzPxDQYXI", director: "Eduardo Coutinho", genre: "Documentário", country: "Brasil", year: "2004", duration: "85 min", description: "A história pessoal de trabalhadores da indústria metalúrgica do ABC paulista que tomaram parte no movimento grevista de 1979 e 1980, mas permaneceram em relativo anonimato. Eles falam de suas origens, de sua participação no movimento e dos caminhos que suas vidas trilharam desde então. Exibem suvenires das greves, recordam os sofrimentos e recompensas do trabalho nas fábricas, comentam o efeito da militância política no âmbito familiar, dão sua visão pessoal de Lula e dos rumos do país." },
  { title: "Perdão, Mister Fiel", youtubeId: "xv0SFgf4iDE", director: "Jorge Oliveira", genre: "Documentário", country: "Brasil", year: "2009", duration: "95 min", description: "A realidade da perseguição política realizada pela ditadura militar brasileira a partir do assassinato do operário comunista Manoel Fiel Filho, em 1976, nos porões do DOI-CODI, em São Paulo. A partir de sua morte teve início o processo de abertura política, que resultou na posterior redemocratização do Brasil." },
  { title: "Pra Frente, Brasil", youtubeId: "d3M-ybJiBZQ", director: "Roberto Farias", genre: "Drama, ficção histórica", country: "Brasil", year: "1982", duration: "1h50min", description: "Em 1970, em plena euforia do milagre econômico e da vitória da seleção brasileira na Copa de 70, um pacato cidadão da classe média, Jofre Godoi da Fonseca, é confundido com um ativista político, sendo então preso e torturado por um grupo que combate \"subversivos\", patrocinado por empresários. A mulher e o irmão de Jofre investigam seu desaparecimento, pois não conseguem o apoio da polícia." },
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
  console.log(`${films.length} filmes da letra P importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
