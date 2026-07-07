require("dotenv").config();
const prisma = require("../../../../src/db");

const entry = {
  title: "Trabalhadores Rurais",
  researcherName: "Gabriel Mamede",
  authorBio: "Graduando em Sociologia pela Universidade Federal Fluminense, integrante da linha de pesquisa Cinema e Ditadura em Plataforma Virtual, vinculada ao grupo Subjetividade, Memória e Violência do Estado. Bolsista de Iniciação Científica/UFF.",
  references: `DEZEMONE, Marcus. A questão agrária, o governo Goulart e o golpe de 1964 meio século depois. História Rural no Brasil: ofício do historiador, pesquisa e ensino, Rio de Janeiro, n. 71, p. 131-154, 12 ago. 2015.
MEMÓRIAS DA DITADURA. Trabalhadores Rurais. São Paulo, [20-?].
JINKINGS, Ivana. Ligas Camponesas. São Paulo, 2015.`,
  relatedTitles: ["Memórias Clandestinas"],
  relatedExternalLinks: [{ title: "Cabra Marcado para Morrer — Eduardo Coutinho (Drama, Brasil, 1964)", url: "https://lab-lace.webnode.com/l/cabra-marcado-para-morrer/" }],
  description: `A luta e a resistência popular dos trabalhadores rurais perpassam momentos para além da ditadura de 1964. Entender sua existência nesse longo período requer um reconhecimento histórico e sociológico mínimo. Entretanto, no recorte da ditadura, observamos que houve um cercamento e uma perseguição ainda mais profundos das terras e populações rurais do Brasil.

Entender o papel político da classe trabalhadora rural é, simultaneamente, entender a construção da sociedade civil e política brasileira. Por ainda sermos um país agroexportador, com produção pecuária histórica e extrativismo expressivo, devemos conhecer a realidade das populações camponesas que exercem papel primordial nessa produção econômica e que, paradoxalmente, possuem representação política diminuta.

Ao longo dos anos de exploração do trabalho rural, os camponeses demonstraram mobilização e organização política de alcance crescente. Em 1961, existiam federações das Ligas Camponesas em pelo menos dez estados. Mesmo em um país estruturado pelo latifúndio e pela histórica mão de obra escravizada e servil, a classe camponesa emergiu organizada e voltada à reforma agrária. “Reforma agrária na lei ou na marra”, afirmava Francisco Julião.

A vulnerabilidade social dos trabalhadores rurais e o atraso no reconhecimento político de seus direitos trabalhistas e agrários demonstram a legitimidade de suas reivindicações. Nem mesmo na Era Vargas, símbolo estatal do reconhecimento dos direitos sociais trabalhistas, o trabalhador rural foi incluído. A presença do banditismo e do messianismo no interior agrário pode ser entendida como expressão da carência de condições dignas e justas de vida e da escassez de meios próprios de articulação.

A partir da década de 1940, as Ligas Camponesas começaram a surgir pelo país, inicialmente legitimadas pelo Partido Comunista Brasileiro, mas também apoiadas pelo PCdoB, pela Ação Popular e por organizações não partidárias. Os direitos trabalhistas e a luta pela terra eram suas principais pautas. Parte dessas demandas começou a ser atendida somente em 1963, no governo João Goulart, com a criação do Estatuto do Trabalhador Rural, que iniciou a sindicalização rural e aproximou seus direitos daqueles reconhecidos aos trabalhadores urbanos.

Em 1964, o golpe empresarial-militar impediu a realização dessas pautas e restaurou relações de trabalho verticais. Líderes rurais como Gregório Bezerra e João Pedro Teixeira foram perseguidos. Desmobilizações, cercamentos, prisões, mortes e torturas provocaram a desarticulação agrária popular. Documento da Comissão Pastoral da Terra relata que, entre 1962 e 1989, mais de 1.500 trabalhadores rurais foram assassinados.

Somente no final da década de 1970 houve uma retomada da mobilização política em torno da reorganização sindical e popular. Nesse processo ocorreu o surgimento do MST, relacionado à ocupação da Fazenda Annoni, no município de Pontão, região norte do Rio Grande do Sul. Nos anos finais da ditadura, a força camponesa marcou presença na luta e resistência contra a violação e a negação dos direitos humanos pelo regime militar.

Por meio dos filmes relacionados, pretende-se resgatar a memória de luta e sangue dos trabalhadores e militantes que deram suas vidas pelas causas agrárias, políticas e populares do Brasil. A sétima arte pode nos conduzir a um passado ainda presente nas relações atuais. A força camponesa ainda carece de maior atenção, principalmente em períodos tão marcantes quanto a ditadura de 1964.`
};

const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
(async () => {
  const user = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!user) throw new Error("Usuário de importação não encontrado");
  const films = await prisma.content.findMany({ where: { type: "FILM" }, select: { id: true, title: true } });
  const relatedFilms = entry.relatedTitles.map(title => films.find(film => normalize(film.title) === normalize(title))).filter(Boolean);
  const existing = await prisma.content.findFirst({ where: { type: "GLOSSARY", title: entry.title } });
  const data = { title: entry.title, description: entry.description, type: "GLOSSARY", researcherName: entry.researcherName, metadata: { authorBio: entry.authorBio, references: entry.references, inlineImages: [], relatedFilms, relatedExternalLinks: entry.relatedExternalLinks }, published: true, createdById: user.id };
  if (existing) await prisma.content.update({ where: { id: existing.id }, data }); else await prisma.content.create({ data });
  console.log("Verbete Trabalhadores Rurais importado com sucesso.");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
