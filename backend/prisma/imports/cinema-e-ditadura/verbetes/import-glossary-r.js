require("dotenv").config();
const prisma = require("../../../../src/db");

const entries = [
  {
    title: "Redemocratização",
    researcherName: "Pedro Wigand",
    authorBio: "Graduando em Antropologia pela Universidade Federal Fluminense e integrante da linha de pesquisa Cinema e Ditadura em Plataforma Virtual, vinculada ao grupo Subjetividade, Memória e Violência do Estado.",
    references: null,
    relatedTitles: ["Depois da Chuva"],
    description: `O termo “redemocratização” é associado à restauração do Estado democrático de direito após um período de autoritarismo ou ditadura, possibilitando a abertura política para um governo civil em que os direitos humanos e as garantias fundamentais sejam assegurados por proteção jurídica. Na história brasileira, para alguns analistas, esse período ocorreu entre os governos dos generais Ernesto Geisel (1974-1979), João Batista Figueiredo (1979-1985) e a eleição indireta de Tancredo Neves, primeiro presidente civil após 21 anos de ditadura militar.

O processo de “redemocratização” ou “abertura política” no Brasil ainda não se efetivou plenamente. Alguns avanços foram importantes, começando em 1974, sob o governo Geisel, e com a Lei da Anistia, em 1979. Em 1978, ainda sob Geisel, o AI-5 foi revogado. A conjuntura ao fim de seu governo, difundida pela imprensa hegemônica, levava a sociedade a acreditar que o regime estava em vias de acabar. Em termos formais, os militares deixaram o poder. Com inflação incontrolável e inúmeras denúncias de corrupção, perdiam cada vez mais a confiança da população.

Em 1979 foi efetivada a Lei Orgânica dos Partidos, que restabelecia o pluripartidarismo. Vale ressaltar que tanto a Lei da Anistia quanto a Lei Orgânica dos Partidos favoreciam os militares de alguma forma: a primeira, ao perdoar agentes responsáveis por violações de direitos humanos e torturas; a segunda, ao fragmentar a esquerda em diversos partidos.

Os partidos de oposição se fortaleciam à medida que a crise econômica, a inflação e a recessão se agravavam. Em 1984, nos últimos momentos do regime, o movimento das Diretas Já explodiu no país. O movimento reivindicava eleições presidenciais diretas em 1985 e foi formalizado no Congresso pela Emenda Dante de Oliveira, rejeitada em 26 de abril de 1984. Tancredo Neves foi então eleito indiretamente pelo Colégio Eleitoral.

A Constituição Federal de 1988, sob a presidência de José Sarney — vice de Tancredo que assumiu após sua morte em 1985 —, representou outro avanço no longo caminho ainda necessário para uma efetiva participação popular na vida política.`
  },
  {
    title: "Resistência",
    researcherName: "Juliana Queires Hollweg",
    authorBio: "Graduanda em Sociologia pela Universidade Federal Fluminense, integrante da linha de pesquisa Cinema e Ditadura em Plataforma Virtual, vinculada ao grupo Subjetividade, Memória e Violência do Estado.",
    references: `FOUCAULT, Michel. Em Defesa da Sociedade: curso no Collège de France (1975-1976). Tradução de Maria Ermantina Galvão. São Paulo: Martins Fontes, 1999.
FOUCAULT, Michel. Microfísica do Poder. Tradução de Roberto Machado. São Paulo: Graal, 2013.`,
    relatedTitles: ["Memória para Uso Diário", "A Memória que Me Contam", "Damas da Liberdade"],
    description: `O filósofo Michel Foucault traz importantes contribuições ao debate ético-político, destacando em seus trabalhos o papel do poder. Sua abordagem se contrapõe à concepção tradicional, por meio de uma análise histórico-social inovadora nos planos filosófico e metodológico.

Ao longo de sua obra, a questão da resistência está presente de forma inquietante e diretamente ligada às diferentes manifestações de poder, pois ela é parte fundamental de sua filosofia. Para entendê-la, é necessário compreender os dispositivos de poder e investigar os acontecimentos a partir dos movimentos de oposição que se voltam contra o silêncio imposto e contra as múltiplas formas pelas quais o poder tenta absorver a resistência.

Para o autor, o poder é uma prática exercida e que atravessa toda a sociedade. Não é um objeto natural e hegemônico explicado por uma única teoria geral capaz de abarcar todas as nuances e formas em que se aplica: é uma prática social.

Foucault investiga como diferentes formas de resistência funcionam e atingem o poder. Elas não necessariamente destroem de imediato o sistema capitalista em sua totalidade, ao contrário de teorias que desconsideram esses movimentos e reconhecem apenas a destruição completa dos mecanismos de poder.

A análise das relações de poder não foi somente uma escolha, mas uma imposição dos tempos vividos. A “era dos extremos” e da superprodução de poder no século XX trouxe à tona a intolerância, a miséria, o nazismo, o fascismo, o stalinismo, as ditaduras latino-americanas e as grandes crises do capitalismo. Não é simples produzir um pensamento filosófico resistente quando ele tem o papel de desempenhar um contrapoder.

Estamos sempre inseridos no contexto do poder, pois ele se manifesta de forma vasta e múltipla nas relações. A resistência também possui essa multiplicidade. É por meio das formas de resistência e luta contra o aparato do Estado que se torna possível inventar novas subjetividades, novos vínculos e estilos de vida para além das formas individualistas e empobrecidas produzidas pelas relações de poder.`
  }
];

const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
(async () => {
  const user = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!user) throw new Error("Usuário de importação não encontrado");
  const films = await prisma.content.findMany({ where: { type: "FILM" }, select: { id: true, title: true } });
  for (const entry of entries) {
    const relatedFilms = entry.relatedTitles.map(title => films.find(film => normalize(film.title) === normalize(title))).filter(Boolean);
    const existing = await prisma.content.findFirst({ where: { type: "GLOSSARY", title: entry.title } });
    const data = { title: entry.title, description: entry.description, type: "GLOSSARY", researcherName: entry.researcherName, metadata: { authorBio: entry.authorBio, references: entry.references, inlineImages: [], relatedFilms }, published: true, createdById: user.id };
    if (existing) await prisma.content.update({ where: { id: existing.id }, data }); else await prisma.content.create({ data });
  }
  console.log("2 verbetes da letra R importados com sucesso.");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
