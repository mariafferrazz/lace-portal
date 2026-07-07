require("dotenv").config();
const prisma = require("../../../../src/db");

const entry = {
  title: "Operários",
  researcherName: "Gabriel Mamede",
  authorBio: "Graduando em Sociologia pela Universidade Federal Fluminense, integrante da linha de pesquisa Cinema e Ditadura em Plataforma Virtual, vinculada ao grupo Subjetividade, Memória e Violência do Estado. Bolsista de Iniciação Científica/UFF.",
  references: `SANTANA, Marco. Ditadura Militar e resistência operária: o movimento sindical brasileiro do golpe à transição democrática. Brasil, n. 13, p. 279-309, 16 jun. 2008. https://periodicos.ufsc.br/index.php/politica/article/viewFile/9321/8605
MEMÓRIAS DA DITADURA. Operários. São Paulo, [20-?].`,
  relatedTitles: ["Peões", "Perdão, Mister Fiel"],
  description: `A luta operária ocorrida nos anos da ditadura empresarial-militar brasileira demonstra a força e a insatisfação da classe operária em face da repressão e do sucateamento de seus espaços e serviços. A classe operária constituiu um dos principais alvos da repressão militar, com inúmeras perseguições, prisões, torturas e mortes. Tanto operários não sindicalizados quanto movimentos organizados foram atravessados pelo poder estatal militar e estiveram sob a égide do interesse capitalista estrangeiro, pois não somente constituíam uma ameaça aos planos da ditadura militar, mas eram componentes essenciais de uma modernização dada pelo modelo neoliberal, baseada na desigualdade social e no arrocho salarial.

Entender o enredo da classe trabalhadora na ditadura requer um conhecimento prévio de sua história e formação. Seu momento inicial de desenvolvimento é situado, em grande parte da historiografia clássica brasileira, a partir de 1930. É nesse contexto que se inicia a massificação e proletarização do trabalhador urbano. Os sistemas de produção fordista e taylorista constituem o âmago da organização e identificação institucional trabalhista. A Era Vargas representa a importação desses modos de produção e entra para a história ora como a primeira gestão estatal a reconhecer e legitimar direitos trabalhistas e sociais — em 1943 foi elaborada a Consolidação das Leis do Trabalho —, ora como corporativista, desmobilizando a organização popular dos trabalhadores em seus centros sindicais. Da experiência histórica de Vargas, podemos analisar a permanência, tanto em 1937 como em 1964, da desmobilização política da classe trabalhadora e de seu afastamento dos centros políticos reivindicatórios, com movimentos populares reprimidos e falsos representantes colocados em seus lugares. Permanece evidente o medo que governos ditatoriais tinham da força mobilizadora e contestatória dos trabalhadores.

No dia 1º de abril de 1964 foi dado o golpe e, em pouquíssimo tempo, o Comando Geral dos Trabalhadores, criado em 1962 durante o governo de Jango, foi fechado e 17 de seus dirigentes foram presos e condenados a anos de prisão. A perseguição se ampliou e mais de 400 organizações sindicais foram perseguidas e censuradas, permanecendo apenas sob tutela estatal militar ou sendo substituídas por entidades financiadas pelo capital internacional, como a CIOSL, Confederação Internacional de Organizações Sindicais Livres. Esta ocupou espaço representativo porque era autorizada e financiada pelo governo e expunha abertamente, em seus comícios, seu viés anticomunista. Iniciada a ditadura, sindicatos e operários foram os primeiros a sofrer perseguição e censura. Imediatamente foi criada a Lei nº 4.330/1964, que restringia e penalizava as ações grevistas. Políticas como essas demonstravam o objetivo de despolitizar o movimento operário e afastá-lo dos centros políticos institucionais.

A resistência operária não acabou e se intensificou em 16 de março de 1968, com a primeira greve de Contagem, em Minas Gerais, onde 1.200 metalúrgicos se organizaram e reivindicaram melhorias salariais. No mesmo ano, em 1º de maio, trabalhadores apedrejaram o palanque em que discursava o então governador paulista Abreu Sodré, marcando novamente a insatisfação operária diante do regime militar. Com o AI-5, em 1968, o silenciamento, as perseguições e a censura tomaram o rumo de uma repressão ainda mais aguda.

Somente a partir de 1978, dez anos depois, reiniciaram-se grandes movimentos operários com alcance nacional. Em 12 de maio de 1978, operários da Saab-Scania, em São Bernardo do Campo, entraram na fábrica e permaneceram de braços cruzados, reivindicando melhorias salariais diante do arrocho sofrido pela classe. Dessa vez, a ação não permaneceu isolada nem pôde ser abafada: ao longo das semanas, meses e anos, uma avalanche de greves e reivindicações tomou fábricas e cidades de São Paulo, Rio de Janeiro, Minas Gerais e Rio Grande do Sul, demonstrando novamente a força política dos trabalhadores urbanos.

A luta operária é um marco da resistência popular frente à imposição da ditadura empresarial-militar. Entender sua história é compreender os mecanismos de dominação e poder do regime militar brasileiro e elucidar um plano que priorizava o desenvolvimento do capital baseado na desigualdade social, uma modernização seletiva e cruel. Por meio de filmes que retratam as relações entre operários e ditadura, podemos imergir em um contexto que para muitos permanece obscuro e inarrável. Entender a luta e a vida dos trabalhadores é entender a construção da sociedade, da história brasileira e de sua redemocratização.`
};

const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

(async () => {
  const user = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!user) throw new Error("Usuário de importação não encontrado");
  const films = await prisma.content.findMany({ where: { type: "FILM" }, select: { id: true, title: true } });
  const relatedFilms = entry.relatedTitles.map(title => films.find(film => normalize(film.title) === normalize(title))).filter(Boolean);
  const existing = await prisma.content.findFirst({ where: { type: "GLOSSARY", title: entry.title } });
  const data = { title: entry.title, description: entry.description, type: "GLOSSARY", researcherName: entry.researcherName, metadata: { authorBio: entry.authorBio, references: entry.references, inlineImages: [], relatedFilms }, published: true, createdById: user.id };
  if (existing) await prisma.content.update({ where: { id: existing.id }, data });
  else await prisma.content.create({ data });
  console.log("Verbete Operários importado com sucesso.");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
