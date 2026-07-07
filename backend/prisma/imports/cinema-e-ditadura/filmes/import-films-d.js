require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  {
    title: "Damas da Liberdade", youtubeId: "lGrZvFCj414", director: "Célia Gurgel e Joe Pimentel", genre: "Documentário", country: "Brasil", year: "2012", duration: "28 min",
    description: "Através de narrativas de mulheres do Movimento Feminino pela Anistia e do Comitê Brasileiro pela Anistia é contada a história da luta pela anistia no Brasil nos anos de 1970, reacendendo o debate sobre um período de repressão e medo que o país jamais deverá esquecer.",
  },
  {
    title: "Democracia em Preto e Branco", youtubeId: "ydj0Wb4ylLo", director: "Pedro Asbeg", genre: "Documentário", country: "Brasil", year: "2014", duration: "94 min",
    description: "Tendo como pano de fundo a lendária Democracia Corinthiana, o nascimento das bandas de rock brasileiras e a campanha das diretas já, \"Democracia em Preto e Branco\" mostra, com locução de Rita Lee e entrevistas exclusivas de Sócrates, Casagrande, os ex presidentes Lula e Fernando Henrique Cardoso e Marcelo Rubens Paiva, Marcelo Tas, Edgar Scandurra, Frejat, Serginho Groisman e Paulo Miklos, entre outros, como o esporte, a política e a música se encontraram para mudar o rumo da história do País nos anos 80.",
  },
  {
    title: "Depois da Chuva", youtubeId: "a77kGQSrvI0", director: "Cláudio Marques e Marilia Hughes Guerreiro", genre: "Drama", country: "Brasil", year: "2013", duration: "1h35min",
    description: "No ano de 1984, quando a ditadura militar se enfraquece, dois jovens baianos de 16 anos começam a perceber que estão vivendo uma fase importante do país. A descoberta do contexto político, com as eleições diretas para Presidente, mistura-se às descobertas sexuais e ao fim da adolescência. (Fonte: Adoro Cinema.)",
  },
  {
    title: "Desarquivando o Brasil", youtubeId: "X51b2BSLKUU", director: "Sávio Leite", genre: "Documentário", country: "Brasil", year: "2016", duration: "13 min",
    description: `Registro de ato em homenagem às vítimas da ditadura militar (1964 - 1985) e coleta de material genético de familiares de desaparecidos políticos mineiros. Teve como objetivo formar um banco de DNA de familiares para tentar identificar os restos mortais dos desaparecidos. O ato Desarquivando o Brasil aconteceu no dia 07 de maio de 2007, em Belo Horizonte. Foi organizado pelo Instituto Helena Greco de Direitos Humanos e Cidadania - local onde foi realizado - em parceria com o Movimento Tortura Nunca Mais/MG. Apesar da pressão dos familiares e dos movimentos por memória, verdade e justiça, foi nulo o resultado do banco de DNA: até hoje nenhum desaparecido político foi identificado com base nas amostras sanguíneas coletadas porque o governou sucateou e estagnou o projeto.

Seleção XII Festival Internacional de Cortos metrajes y escuelas de Cine - Colômbia - 2016; 6 Cine Cipó - Belo Horizonte - Brasil - 2016; 17º FECISO - Festival de Cine Social y Antisocial - Chile - 2016; Muestra Internacional Cine X DDHH - Puerto Mont - Chile - 2016; Mostra Sesc de Cinema - Belo Horizonte - MG - 2017; 4 Festival de Cinema de Caratinga - MG - 2017.`,
  },
];

async function main() {
  const importer = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!importer) throw new Error("Usuário de importação do acervo não encontrado.");

  for (const film of films) {
    const externalUrl = `https://www.youtube.com/watch?v=${film.youtubeId}`;
    const metadata = { youtubeId: film.youtubeId, imageUrl: `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`, director: film.director, genre: film.genre, country: film.country, year: film.year, duration: film.duration };
    const existing = await prisma.content.findFirst({ where: { type: "FILM", title: film.title } });
    const data = { title: film.title, description: film.description, type: "FILM", researcherName: "Equipe LACE", externalUrl, metadata, published: true, createdById: importer.id };
    if (existing) await prisma.content.update({ where: { id: existing.id }, data });
    else await prisma.content.create({ data });
  }
  console.log(`${films.length} filmes da letra D importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
