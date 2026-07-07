require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  { title: "15 Filhos", youtubeId: "Iy5yRNYsUzI", director: "Maria Oliveira e Marta Nehring", genre: "Documentário", country: "Brasil", year: "1996", duration: "18 min", description: "Uma visão das conseqüências humanas da ditadura militar no país a partir do depoimento dos filhos de desaparecidos ou mortos pelo regime. Além dos relatos, gravados em preto-e-branco, o filme traz imagens em cor da queda do presidente chileno Salvador Allende e das dependências de uma delegacia de polícia em São Paulo onde eram mantidas famílias de presos políticos." },
  { title: "1962: O Ano do Saque", youtubeId: "gDzD6JY2IrM", director: "Rodrigo Dutra e Victor Ferreira", genre: "Documentário", country: "Brasil", year: "2014", duration: "45 min", description: "Em 1962 as forças conservadoras contra o presidente Jango criavam um clima instabilidade no país. Além da crise política faltava aos brasileiros produtos elementares como o arroz, açúcar e feijão. Em meio a este cenário aconteceu, principalmente em Duque de Caxias, um dos maiores saques populares que se tem notícia na história do Brasil no século XX." },
  { title: "500 – Os Bebês Roubados pela Ditadura Argentina", youtubeId: "51OgIATvuPA", director: "Alexandre Valenti", genre: "Documentário", country: "Brasil, Argentina e França", year: "2015", duration: "1h40min", description: "Durante sete anos, entre 1976 e 1983, a Argentina viveu sob uma ditadura militar. Dentre os aterrorizantes atos feitos durante esta época, está o sequestro de bebês e crianças, filhos de presos e desaparecidos políticos ou nascidos em prisões clandestinas ou centros de tortura e extermínio. O grupo \"Avós da Praça de Maio\" criou o \"Banco dos 500\", uma luta para localizar as 500 crianças a partir de amostras de seus próprios sangues. Hoje adultos, 114 das 500 foram encontradas e agora confrontam os dignitários da mais sangrenta ditadura Argentina, acusados de genocídio e crimes contra a Humanidade. Uma marca que nunca será apagada da história. Uma luta que só termina quando o último dos \"500\" for encontrado." },
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
  console.log(`${films.length} filmes numéricos importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
