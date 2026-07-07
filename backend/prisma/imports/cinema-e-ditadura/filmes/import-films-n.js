require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  {
    title: "Nosso Sagrado", youtubeId: "1jx3ScQXyD0", director: "Fernando Sousa", website: "https://www.quiprocofilmes.com.br/pt/filme/nosso-sagrado",
    description: "O documentário investiga a perseguição contra o Candomblé e a Umbanda, religiões criminalizadas na Primeira República e na Era Vargas. Entre 1890 e 1946, mais de 500 objetos foram apreendidos pela polícia do Estado do Rio de Janeiro. Os objetos sagrados foram expostos como “Museu Magia Negra” e permaneceram por cerca de cem anos sob a posse do Museu da Polícia Civil do Estado do Rio de Janeiro. A partir da fala de religiosos, pesquisadores e militantes, buscamos entender a importância do acervo sagrado afro-brasileiro e a luta pela sua libertação. O documentário está licenciado para o Canal Brasil e a plataforma kweli.tv.",
  },
  {
    title: "Nossos Mortos Têm Voz", youtubeId: "pGEOTZ4t-VY", director: "Fernando Sousa e Gabriel Barbosa", genre: "Documentário", country: "Brasil", year: "2018", duration: "28 min",
    description: "A narrativa do documentário é construída a partir do depoimento e do protagonismo das mães e familiares vítimas da violência de Estado da Baixada Fluminense. Tendo como ponto de partida esses casos, mas não se limitando à violência praticada, o documentário aborda as histórias atravessadas por essas perdas. Pretende-se resgatar a memória dessas vidas interrompidas trazendo uma visão crítica sobre a atuação do Estado através das polícias na Baixada Fluminense, sobretudo no que diz respeito à violência contra jovens negros.",
  },
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
  console.log(`${films.length} filmes da letra N importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
