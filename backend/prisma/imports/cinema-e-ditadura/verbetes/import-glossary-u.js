require("dotenv").config();
const prisma = require("../../../../src/db");

const entry = {
  title: "Uruguai",
  researcherName: "Jade Maria Aragão",
  authorBio: "Graduanda em Ciências Sociais pela Universidade Federal Fluminense, integrante da linha de pesquisa Cinema e Ditadura em Plataforma Virtual, vinculada ao grupo Subjetividade, Memória e Violência do Estado. Bolsista de Desenvolvimento Acadêmico Proaes-UFF.",
  references: "PADRÓS, Enrique Serra. A ditadura civil-militar uruguaia, doutrina e segurança nacional. Varia Historia, Belo Horizonte, v. 28, n. 48, p. 495-517, jul./dez. 2012.",
  relatedTitles: ["Uma Noite de 12 Anos"],
  description: `A ditadura civil-militar no Uruguai, assim como em outros países da América Latina, implantou o neoliberalismo com o apoio das Forças Armadas. Antes de sua consolidação e do golpe de Estado, o início da década de 1970 foi marcado pelos conflitos entre os partidos Blanco e Colorado e o Movimento de Libertação Nacional, coordenado pelos Tupamaros. Os Estados Unidos atuaram de modo que suas ações desencadeassem a morte de um líder tupamaro e buscassem a libertação de Dan Mitrione, responsável pelo ensino de práticas de tortura.

Com Jorge Pacheco Areco no poder e, posteriormente, Juan María Bordaberry, o Uruguai vivenciou um cenário de grande tensão social e política. Em 27 de junho de 1973, Bordaberry anunciou publicamente a proibição dos partidos políticos e a substituição do Parlamento por um Conselho de Estado. Tinha início a primeira e única ditadura militar da história do Uruguai e a instauração de um regime empresarial-militar.

Sequestros, violações, prisões, torturas, desaparecimentos e assassinatos fizeram parte do sistema ditatorial uruguaio. Estima-se que o país tenha tido cerca de cinco mil presos políticos. Também foram adotadas medidas como censura, suspensão dos meios de imprensa independentes, proibição do sindicalismo, suspensão dos recreios nas escolas secundárias e demissão de professores universitários.

Na década de 1980, após um plebiscito em que foi derrotado o projeto de uma nova constituição militar, fortes mobilizações tomaram o país. Mais de 400 mil pessoas ocuparam a principal avenida de Montevidéu no ato conhecido como “El Obeliscazo” ou “Un Río de Libertad”, pelo fim da ditadura. O regime encerrou-se em 1984, depois de 12 anos.`
};

const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
(async () => {
  const user = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!user) throw new Error("Usuário de importação não encontrado");
  const films = await prisma.content.findMany({ where: { type: "FILM" }, select: { id: true, title: true } });
  const relatedFilms = entry.relatedTitles.map(title => films.find(film => normalize(film.title) === normalize(title))).filter(Boolean);
  const existing = await prisma.content.findFirst({ where: { type: "GLOSSARY", title: entry.title } });
  const data = { title: entry.title, description: entry.description, type: "GLOSSARY", researcherName: entry.researcherName, metadata: { authorBio: entry.authorBio, references: entry.references, inlineImages: [], relatedFilms }, published: true, createdById: user.id };
  if (existing) await prisma.content.update({ where: { id: existing.id }, data }); else await prisma.content.create({ data });
  console.log("Verbete Uruguai importado com sucesso.");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
