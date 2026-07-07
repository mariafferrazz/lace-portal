require("dotenv").config();
const prisma = require("../../../../src/db");

const entries = [
  {
    title: "Lei da Anistia",
    researcherName: "Ana Cláudia Bessa",
    authorBio: "Graduanda em Sociologia pela Universidade Federal Fluminense, pesquisadora e integrante da linha de pesquisa Cinema e Ditadura em Plataforma Virtual.",
    relatedTitles: ["Damas da Liberdade", "Ainda Existem Perseguidos Políticos", "A Mesa Vermelha", "Memórias Femininas da Luta contra a Ditadura Militar", "Se Um De Nós Se Cala"],
    inlineImages: [
      { afterText: "a Lei de Anistia, foi promulgada.", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000127-bdb70bdb73/lei%20anistia.webp?ph=3554c7d1fd", alt: "Ato pela anistia na Praça da Sé", caption: "Figura 1. Ato pela anistia na Praça da Sé — foto: Ennco Beanns/Arquivo Público do Estado de São Paulo. Fonte: Agência Senado." },
      { afterText: "a anistia não foi ampla, geral e irrestrita.", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000128-5c8575c85a/700/anistia%20ampla.webp?ph=3554c7d1fd", alt: "Cartaz pede anistia sem restrições", caption: "Figura 2. Cartaz pede anistia sem restrições. Fonte: Agência Senado." }
    ],
    references: `ZELIC, Marcelo. A auto-anistia e a farsa de um acordo nacional. São Paulo, 2010. https://www.torturanuncamais-rj.org.br/artigo/a-auto-anistia-e-a-farsa-de-um-acordo-nacional/
Lei nº 6.683, de 28 de agosto de 1979. https://www.planalto.gov.br/ccivil_03/leis/l6683.htm
COELHO, Maria José H.; ROTTA, Vera. Caravanas da anistia: o Brasil pede perdão. Brasília: Ministério da Justiça, 2012.
WESTIN, Ricardo. Há 40 anos, Lei da Anistia preparou caminho para fim da ditadura. Agência Senado, 2019.
Comissão Nacional da Verdade. https://cnv.memoriasreveladas.gov.br/
Grupo Tortura Nunca Mais/RJ. https://www.torturanuncamais-rj.org.br/quem-somos/`,
    description: `Com a ditadura implantada no Brasil após a deposição do presidente João Goulart e o fechamento do regime com a assinatura do AI-5, muitas pessoas que se opunham ao regime viraram rés, foram presas, obrigadas a sair do Brasil ou a viver na clandestinidade. Mesmo diante de tanto risco, houve resistência. Não foi sem luta e mobilização que a Lei nº 6.683, de 28 de agosto de 1979, a Lei de Anistia, foi promulgada.

A Lei da Anistia foi fruto de uma imensa luta de setores da sociedade civil. O Movimento Feminino pela Anistia, criado em 1975 e liderado por mulheres, mães, esposas e filhas de presos e desaparecidos, fomentou manifestações no Brasil e no exterior. A votação ocorreu em um Congresso sob o bipartidarismo de ARENA e MDB, com muitos opositores cassados. O texto do governo foi promulgado com poucas alterações e sem participação efetiva da sociedade civil.

Muitos perseguidos políticos não foram contemplados, enquanto militares e agentes públicos envolvidos em torturas e execuções foram perdoados. Na prática, a anistia não foi ampla, geral e irrestrita.

O artigo 1º concedeu anistia a quem, entre 2 de setembro de 1961 e 15 de agosto de 1979, cometeu crimes políticos ou conexos, crimes eleitorais, teve direitos políticos suspensos ou sofreu punições fundamentadas em atos institucionais. Sua abrangência controversa permitiu que crimes contra a humanidade permanecessem impunes, sendo por isso caracterizada por muitos como autoanistia.

Em 1985 foi fundado o Grupo Tortura Nunca Mais-RJ. Em 2001, o Ministério da Justiça criou a Comissão de Anistia, voltada à reparação moral e econômica das vítimas. As Caravanas da Anistia percorreram o país e o Memorial da Anistia foi concebido para preservar a memória histórica. A Comissão Nacional da Verdade, instaurada em 2012, apurou graves violações de direitos humanos.

O esquecimento e a impunidade mantêm o país em dívida com as vítimas e seus familiares. Por isso, movimentos sociais defendem a revisão da Lei da Anistia e a responsabilização pelos crimes cometidos pelo Estado como condições para fortalecer a democracia.`
  },
  {
    title: "Lugares de Memória e Tortura",
    researcherName: "Joana D'Arc Fernandes Ferraz; Lucas Pacheco Campos; Danusa Ester Gomes",
    authorBio: "Joana D'Arc Fernandes Ferraz é doutora em Ciências Sociais e professora da UFF. Lucas Pacheco Campos é doutorando em Políticas Públicas e Formação Humana pela UERJ e professor da UFJF. Danusa Ester Gomes é graduanda em Sociologia pela UFF e integrante da linha Cinema e Ditadura em Plataforma Virtual.",
    relatedTitles: [],
    references: `NORA, Pierre. Les Lieux de Mémoires. Paris: Gallimard, 1993.
JEUDY, Henri-Pierre. 1990.
FÉNELON, Déa. 1992.`,
    description: `No período da ditadura empresarial-militar brasileira, os ditadores inauguraram, em vários estados, inúmeros lugares de memória. Segundo Pierre Nora, são unidades significativas, materiais ou ideais, transformadas em elementos simbólicos do patrimônio da memória de uma comunidade.

O patrimônio compreende formas plurais cujos sentidos são continuamente reapropriados. A política de preservação da memória deve resultar de uma prática social e cultural de múltiplos agentes, pois a memória é política por excelência.

No Rio de Janeiro, ruas, escolas, viadutos, pontes e praças ainda homenageiam ditadores. O Viaduto 31 de Março e a Ponte Presidente Costa e Silva são exemplos. Permanecem também lugares de tortura e cárcere: prédios do DOI-CODI e do DOPS, delegacias, casas cedidas aos militares, a Casa da Morte em Petrópolis e o Estádio Caio Martins, em Niterói.

Os atores que lutaram contra a ditadura não se sentem representados pela memória nacional. Apesar das iniciativas dos movimentos sociais, ainda há uma disputa entre atingidos e governos pós-ditatoriais pela construção de espaços de resistência e reflexão sobre os horrores do período.`
  },
  {
    title: "LGBT+ na Ditadura",
    researcherName: "Ícaro José Iegelski Rodrigues",
    authorBio: "Graduando em Sociologia pela Universidade Federal Fluminense, integrante da Linha de Pesquisa Cinema e Ditadura em Plataforma Virtual e bolsista de Iniciação Científica da UFF.",
    relatedTitles: [],
    inlineImages: [{ afterText: "precursora da Parada do Orgulho LGBT.", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000126-9431094315/lgbt.webp?ph=3554c7d1fd", alt: "Manifestação do movimento LGBT", caption: "Movimento LGBT durante o período de redemocratização." }],
    references: `O Globo. Stonewall brasileiro aconteceu em São Paulo nos anos 1980 durante a reabertura política do país. https://oglobo.globo.com/sociedade/stonewall-brasileiro-aconteceu-em-sao-paulo-nos-anos-1980-durante-reabertura-politica-do-pais-1-23769930
Memórias da Ditadura. LGBT+. https://memoriasdaditadura.org.br/lgbt/`,
    description: `Durante a ditadura empresarial-militar brasileira, além do combate ao chamado “perigo vermelho”, a comunidade LGBT+ foi fortemente atacada. Seus integrantes eram tratados pejorativamente como pessoas com “desvio”, sob um moralismo controlador que associava a homossexualidade a crime e desvio psicológico.

Diplomatas foram exonerados sob acusação de “prática de homossexualismo”. Em São Paulo, abordagens policiais arbitrárias levavam à extorsão, tortura e morte. Em 1978 surgiu o jornal Lampião da Esquina, importante veículo de defesa da pluralidade sexual, perseguido até seu fechamento.

A resistência ocorreu pela organização da comunidade. Em 1979 aconteceu o primeiro encontro de militantes LGBT no Rio de Janeiro e, em 1980, São Paulo recebeu uma marcha considerada precursora da Parada do Orgulho LGBT.

Durante a redemocratização, a Constituição de 1988 tratou de forma insuficiente a discriminação, sem contemplar plenamente identidade de gênero e orientação sexual. Em 2019, o STF enquadrou a LGBTfobia como crime. A luta do movimento também conquistou direitos como união estável, adoção por casais homoafetivos e acesso a procedimentos de afirmação de gênero pelo SUS.`
  }
];

(async () => {
  const user = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!user) throw new Error("Usuário de importação não encontrado");
  const films = await prisma.content.findMany({ where: { type: "FILM" }, select: { id: true, title: true } });
  for (const entry of entries) {
    const relatedFilms = entry.relatedTitles.map(title => films.find(film => film.title.toLocaleLowerCase("pt-BR") === title.toLocaleLowerCase("pt-BR"))).filter(Boolean);
    const existing = await prisma.content.findFirst({ where: { type: "GLOSSARY", title: entry.title } });
    const data = { title: entry.title, description: entry.description, type: "GLOSSARY", researcherName: entry.researcherName, metadata: { authorBio: entry.authorBio, references: entry.references, inlineImages: entry.inlineImages || [], relatedFilms }, published: true, createdById: user.id };
    if (existing) await prisma.content.update({ where: { id: existing.id }, data });
    else await prisma.content.create({ data });
  }
  console.log("3 verbetes da letra L importados com sucesso.");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
