require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [{
  title: "Um Golpe, 50 Olhares", youtubeId: "XLg_3HUH2ys",
  description: "Um Golpe, 50 Olhares é um filme realizado de forma colaborativa que traz através de produções de um minuto, olhares diversos acerca da Ditadura Civil-Militar que o país vivenciou entre 1964 e 1985. Uma iniciativa que nos permite lançar luz sobre esse período da história do Brasil que deixou fortes marcas em nossa sociedade. A forma colaborativa desta produção apresenta também importante aspecto de possibilitar que os cidadãos de hoje se expressem livremente de uma época em que se tentavam impor silêncio em nosso país.",
  director: "Projeto Marcas da Memória · Organização: ONG Criar Brasil", genre: "Documentário", country: "Brasil", year: "2015", duration: "54 min",
}, {
  title: "Uma História de Amor e Fúria", youtubeId: "r2N_dQ6iYUo",
  description: "Uma História de Amor e Fúria é um filme de animação brasileiro, do gênero ficção científica, escrito e dirigido por Luiz Bolognesi. O filme é produzido pela Gullane e Buriti Filmes, com a coprodução da Lightstar Studios. O filme provoca uma (des)educação do olhar sobre a História do Brasil, ao contemplar uma perspectiva ficcional a partir de uma ótica indígena, mais precisamente do povo Tupinambá, travando uma guerra semiótica com a história oficial. Uma História de Amor e Fúria nos faz viajar no tempo, proporcionando diferentes formas de ver, diferentes maneiras de pensar.",
  director: "Luiz Bolognesi", genre: "Animação, ficção científica", country: "Brasil",
}, {
  title: "Uma Longa Viagem", youtubeId: "FYturHzPAeQ",
  description: "Uma longa viagem é a história de três irmãos. A linha dramática é dada pela história do caçula, que vai para Londres em 1969, mandado pela família para que ele não entrasse na luta armada contra a ditadura no Brasil, seguindo os passos da irmã. Durante os 9 anos em que viaja pelo mundo, ele escreve cartas. Em contraponto à entrevista e às cartas, os comentários em off da irmã, presa política que virou uma artista reconhecida e viaja pelo mundo, quase num processo inverso ao vivido pelo irmão, que de viajante livre foi obrigado a enfrentar algumas internações em hospitais psiquiátricos. No fundo, é um documentário que trabalha sobre a memória. Não somente pela forma como é feita a investigação, mas também sobre o que motivou o filme: a morte do terceiro irmão.",
  director: "Lúcia Murat", genre: "Documentário", country: "Brasil", year: "2011", duration: "94 min",
}, {
  title: "Uma Noite de 12 Anos", youtubeId: "9tMcnZrIvqs",
  description: "1973, Uruguai. José Mujica (Antonio de la Torre), Mauricio Rosencof (Chino Darín) e Eleuterio Fernández Huidobro (Alfonso Tort) são militantes dos Tupamaros, grupo que luta contra a ditadura militar local. Eles são presos em ações distintas e encarcerados junto a outros nove companheiros, de forma que não possam sequer falar um com o outro. Ao longo dos anos, o trio busca meios de sobreviver não só à tortura, mas também ao encarceramento que fez com que ficassem completamente alheios à sociedade, sem a menor ideia se um dia seriam soltos.",
  director: "Alvaro Brechner", genre: "Drama", country: "Uruguai, Espanha e Argentina", year: "2018", duration: "2h02min",
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
  console.log(`${films.length} filme da letra U importado.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
