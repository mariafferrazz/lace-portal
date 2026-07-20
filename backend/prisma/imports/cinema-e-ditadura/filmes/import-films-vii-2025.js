require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  {
    title: "O Dia em que Dorival Encarou a Guarda",
    youtubeId: "I418PGZIONQ",
    director: "Jorge Furtado e José Pedro Goulart",
    country: "Brasil",
    description: "Filme exibido na VII Mostra Cinema e Ditadura.",
  },
  {
    title: "Zé",
    youtubeId: "8L5g64U-sc8",
    director: "Rafael Conde",
    country: "Brasil",
    description: "Filme exibido na VII Mostra Cinema e Ditadura. Sessão com debate de Dulce Pandolfi e Ricardo Máximo.",
  },
  {
    title: "Acervo Dops - Os papéis da repressão",
    youtubeId: "5BXLPRnrQJE",
    director: "Núcleo de audiovisual da UFF e Arquivo Público do Estado do Rio de Janeiro",
    country: "Brasil",
    description: "Filme exibido na VII Mostra Cinema e Ditadura. Sessão com debate de Felipe Nin, Fernanda Pradal e Daniel Elian.",
  },
  {
    title: "Caio Martins e o apagamento da memória",
    youtubeId: "c-oxcKCqVws",
    director: "Lucas Cavalcante",
    country: "Brasil",
    description: "Filme exibido na VII Mostra Cinema e Ditadura. Sessão com debate de Kenia Maia e Gabriel Souza.",
  },
  {
    title: "Qual é a memória da ditadura militar?",
    youtubeId: "0pXwARWKHlk",
    director: null,
    country: "Brasil",
    description: "Filme exibido na VII Mostra Cinema e Ditadura. Sessão com debate de Helen Ortiz, Guilherme Oliveira, Gabriel Rivas, Stella Moreira e Maria Antônia.",
  },
  {
    title: "Atuação da FEDEFAM como espaço de resistência e de memória na ditadura Argentina",
    youtubeId: "O2jwZVeaPkM",
    director: null,
    country: "Argentina",
    description: "Filme exibido na VII Mostra Cinema e Ditadura. Sessão com debate de María Adela Antokoletz, Madre de la Plaza de Mayo.",
  },
  {
    title: "Arquivos da ditadura: luta e resistência em Perus",
    youtubeId: "_VmVV19X6EM",
    director: "Memorial da Resistência de SP",
    country: "Brasil",
    description: "Filme exibido na VII Mostra Cinema e Ditadura. Debate com Liza Santos, Gabriel Rivas, Rayane Miranda, Carlos Santos e Rafaela Reis.",
  },
];

async function main() {
  const importer = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!importer) throw new Error("Usuário de importação do acervo não encontrado.");

  for (const film of films) {
    const externalUrl = `https://www.youtube.com/watch?v=${film.youtubeId}`;
    const metadata = {
      youtubeId: film.youtubeId,
      vimeoId: null,
      videoProvider: "youtube",
      imageUrl: `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`,
      director: film.director,
      genre: null,
      country: film.country,
      year: null,
      duration: null,
      website: null,
    };
    const existing = await prisma.content.findFirst({ where: { type: "FILM", title: film.title } });
    const data = {
      title: film.title,
      description: film.description,
      type: "FILM",
      researcherName: "Equipe LACE",
      externalUrl,
      metadata,
      published: true,
      createdById: importer.id,
    };

    if (existing) await prisma.content.update({ where: { id: existing.id }, data });
    else await prisma.content.create({ data });
  }

  console.log(`${films.length} filmes da VII Mostra 2025 importados.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
