require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  {
    title: "Barra 68 - Sem Perder a Ternura",
    youtubeId: "nzq9l3Eu7i4",
    description: "O documentário de Vladimir Carvalho relata a luta de Darcy Ribeiro no início dos anos 1960 para criar e implantar a Universidade Brasília e as repetidas agressões sofridas pela UnB, desde o golpe militar de 1964 até os acontecimentos de 1968, quando foram detidos cerca de 500 estudantes. Em 1977, a mesma instituição sofreria mais uma onda de manifestações que foram duramente reprimidas pelo exército. Durante a agressão de 1968, a universidade foi ocupada por tropas militares e quase perdeu todo o seu corpo docente que se demitiu em protesto.",
    director: "Vladimir Carvalho",
    genre: "Documentário",
  },
  {
    title: "Batismo de Sangue",
    youtubeId: "Q-cPVZy9HgI",
    description: "Baseado no livro de Frei Betto, o filme conta a história de cinco frades dominicanos que se engajaram na guerrilha contra a ditadura militar nos anos 60 no Brasil. Por apoiarem a luta armada, são considerados comunistas, são presos e torturados.",
    director: "Helvécio Ratton",
    genre: "Drama",
    country: "Brasil",
    year: "2006",
    duration: "120 min",
  },
  {
    title: "Brasil: O Relato sobre uma Tortura",
    youtubeId: "m2HA38FGIcY",
    description: "Filmado no Chile, logo após a chegada dos 70 presos políticos brasileiros trocados pelo embaixador suíço, é um documentário com cenas fortes (há reconstituições de vários tipos de tortura).",
    director: "Haskell Wexler e Saul Landau",
    genre: "Documentário",
    country: "Chile",
    year: "1971",
    duration: "60 min",
  },
];

async function main() {
  const importer = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!importer) throw new Error("Usuário de importação do acervo não encontrado.");

  for (const film of films) {
    const externalUrl = `https://www.youtube.com/watch?v=${film.youtubeId}`;
    const metadata = {
      youtubeId: film.youtubeId,
      imageUrl: `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`,
      director: film.director,
      genre: film.genre,
      country: film.country,
      year: film.year,
      duration: film.duration,
    };
    const existing = await prisma.content.findFirst({ where: { type: "FILM", title: film.title } });
    const data = { title: film.title, description: film.description, type: "FILM", researcherName: "Equipe LACE", externalUrl, metadata, published: true, createdById: importer.id };
    if (existing) await prisma.content.update({ where: { id: existing.id }, data });
    else await prisma.content.create({ data });
  }

  console.log(`${films.length} filmes da letra B importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
