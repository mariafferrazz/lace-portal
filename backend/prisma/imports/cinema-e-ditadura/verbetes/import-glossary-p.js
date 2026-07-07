require("dotenv").config();
const prisma = require("../../../../src/db");

const entries = [
  {
    title: "Presidentes durante a Ditadura",
    researcherName: "Marcia Barbosa; Ícaro José Iegelski Rodrigues",
    authorBio: "Marcia Barbosa é graduanda em Ciências Sociais pela UFF e bolsista de Desenvolvimento Acadêmico. Ícaro José Iegelski Rodrigues é graduando em Sociologia pela UFF e bolsista de Iniciação Científica. Ambos integram a linha Cinema e Ditadura em Plataforma Virtual e o grupo Subjetividade, Memória e Violência do Estado.",
    references: null,
    relatedTitles: ["Jango"],
    inlineImages: [
      { afterText: "Humberto de Alencar Castelo Branco (1964-1967)", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000120-bfa9dbfaa1/450/p1.webp?ph=3554c7d1fd", alt: "Humberto de Alencar Castelo Branco", caption: "Humberto de Alencar Castelo Branco (1964-1967)." },
      { afterText: "Arthur da Costa e Silva (1967-1969)", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000121-03ade03ae1/p2.webp?ph=3554c7d1fd", alt: "Arthur da Costa e Silva", caption: "Arthur da Costa e Silva (1967-1969)." },
      { afterText: "Emílio Garrastazu Médici (1969-1974)", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000122-52bd052bd3/450/p3.webp?ph=3554c7d1fd", alt: "Emílio Garrastazu Médici", caption: "Emílio Garrastazu Médici (1969-1974)." },
      { afterText: "Ernesto Geisel (1974-1979)", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000123-932b0932b3/450/p4.webp?ph=3554c7d1fd", alt: "Ernesto Geisel", caption: "Ernesto Geisel (1974-1979)." },
      { afterText: "João Baptista de Oliveira Figueiredo (1979-1985)", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000124-00bb600bb9/450/p5.webp?ph=3554c7d1fd", alt: "João Baptista de Oliveira Figueiredo", caption: "João Baptista de Oliveira Figueiredo (1979-1985)." }
    ],
    description: `A ditadura militar teve início no dia 1º de abril de 1964, com o golpe que depôs o presidente eleito João Goulart. Apoiado por empresários e pela mídia burguesa, o regime permaneceu no poder por 21 anos. Agiu violentamente contra seus opositores, censurou artistas e jornais e colocou partidos e instituições estudantis na clandestinidade. Não é possível calcular o número total de mortos, desaparecidos e torturados, uma vez que arquivos das Forças Armadas permanecem fechados. Por meio de eleições indiretas, generais assumiram o poder para manter o regime.

Humberto de Alencar Castelo Branco (1964-1967)

Após o golpe, Castelo Branco assumiu a presidência por eleições indiretas, prometendo um posto temporário até as próximas eleições diretas. Governou de forma autoritária e violenta, utilizando os Atos Institucionais para reprimir opositores, fechar associações civis, proibir greves, intervir em sindicatos e cassar mandatos.

Com o AI-2, as eleições presidenciais passaram a ser indiretas. O Ato Complementar nº 4 instituiu o bipartidarismo: a Aliança Renovadora Nacional, base do governo e maioria no Congresso, e o Movimento Democrático Brasileiro, oposição minoritária composta por aqueles que não haviam sido cassados. O AI-3 estendeu eleições indiretas a governadores e prefeitos. Com o AI-4, o Congresso foi convocado como Constituinte. Seu governo criou o Banco Central e o Banco Nacional de Habitação, e a Emenda Constitucional nº 9 estendeu seu mandato até 15 de março de 1967.

Arthur da Costa e Silva (1967-1969)

O general Arthur da Costa e Silva assumiu em 15 de março de 1967, dando início aos anos de chumbo. Manifestações contra o regime cresceram, articuladas por militantes e estudantes em escolas, clubes e sindicatos. O Estado endureceu a repressão e promulgou o AI-5, que concedeu poderes especiais ao presidente para suspender direitos políticos, fechar o Congresso, suspender o habeas corpus, impor censura prévia e aposentar compulsoriamente funcionários públicos opositores. O governo proibiu manifestações e colocou as Forças Armadas na segurança interna. No período também foram criados Funai, Mobral, Embraer e CPRM.

Emílio Garrastazu Médici (1969-1974)

Médici assumiu por eleições indiretas em 30 de outubro de 1969. Foi responsável pelo período de maior repressão política e incorporou as medidas do AI-5. A propaganda exaltava o “Milagre Econômico”, mas os empréstimos estrangeiros produziram enorme dívida externa. A concentração de renda cresceu e a fome atingiu cerca de 13 milhões de pessoas, enquanto se intensificavam torturas, prisões, desaparecimentos e mortes. Vale do Rio Doce, Petrobras e Telebras expandiram, mas o endividamento e a crise do petróleo de 1973 expuseram os limites desse crescimento.

Ernesto Geisel (1974-1979)

Geisel assumiu em 15 de março de 1974, em meio à recessão e ao fim do chamado Milagre Econômico. Propôs uma abertura política “lenta, gradual e segura”, sem restabelecer plenamente a política anterior ao golpe. Não houve eleições diretas e as instituições continuaram limitadas. O AI-5 foi revogado em 1978. Retornaram movimentos reivindicatórios, como o Movimento pela Anistia, greves operárias, o movimento contra a carestia e denúncias de torturas e desaparecimentos. Durante o período foram realizadas ou concluídas grandes obras públicas, como a Ponte Rio-Niterói, Itaipu e a Transamazônica.

João Baptista de Oliveira Figueiredo (1979-1985)

Figueiredo assumiu em março de 1979 e deu continuidade à abertura política limitada. A Lei da Anistia permitiu o retorno de exilados e a libertação de alguns presos políticos, mas sua interpretação sobre crimes conexos anistiou também crimes cometidos pelo Estado. Militantes da luta armada não foram plenamente contemplados, enquanto agentes envolvidos em mortes, torturas e desaparecimentos foram anistiados. Com o enfraquecimento do governo, o alto endividamento e a pressão popular das Diretas Já, o regime tornou-se inviável. A primeira eleição presidencial direta, contudo, ocorreu apenas em 1989.`
  },
  {
    title: "Presos",
    researcherName: "Jade Aragão",
    authorBio: "Graduanda em Ciências Sociais pela Universidade Federal Fluminense, integrante da linha Cinema e Ditadura em Plataforma Virtual e do grupo Subjetividade, Memória e Violência do Estado. Bolsista de Desenvolvimento Acadêmico Proaes-UFF.",
    references: `FARIA, Cátia. A luta pelo reconhecimento dos presos políticos no Brasil (1969-1979). São Paulo, 2008. https://www.historica.arquivoestado.sp.gov.br/materias/anteriores/edicao33/materia05/texto05.pdf`,
    relatedTitles: ["Zuzu Angel", "Batismo de Sangue"],
    description: `Todo preso é um preso político. Com essa afirmativa, resgatamos uma questão que perpetua exclusões e desigualdades sociais em nossa história. Elas se desdobram no encarceramento massivo de pessoas majoritariamente negras, jovens, periféricas e com baixo grau de escolaridade. A justiça e os aparatos de um Estado autoritário, cuja marca não é a neutralidade, historicamente legitimam a seleção e segregação das populações mais vulneráveis, estigmatizadas por um processo de criminalização que considera a repressão e a privação de liberdade respostas imediatas para problemas estruturais.

A ditadura militar brasileira aprisionou, torturou e foi responsável pela morte e pelo desaparecimento de milhares de presos. Esses números ainda não podem ser plenamente expressos devido aos traumas, ao silenciamento e ao sigilo que impede o acesso a documentos e arquivos dos anos de repressão.

A Doutrina de Segurança Nacional, sob influência da Guerra Fria, trabalhou para garantir o estado de exceção. Além dos atos institucionais, contou com a Lei de Segurança Nacional, baseada na definição de crimes contra a ordem social e política. O Decreto-Lei nº 898, de 1969, resultou na prisão de inúmeros “inimigos nacionais”: todos aqueles que apresentavam críticas ou oposição ao governo. O Decreto nº 69.534, de 1971, foi outra medida utilizada para ampliar poderes e legitimar prisões sem mandados ou acusações cabíveis.

Na maioria das vezes, as prisões eram arbitrárias, coletivas, programadas e sem registro formal. Líderes políticos, estudantes, sindicalistas, jornalistas, professores, camponeses, artistas e intelectuais foram levados a prisões e lugares de tortura, onde seus direitos foram violados física e psicologicamente. A tortura teve função fundamental para o Estado, e técnicas eram ensinadas em centros como a Escola das Américas. Choque elétrico, sufocamento, palmatória, afogamento, cadeira do dragão, corredor polonês, injeção de éter, crucificação, enforcamento, geladeira, tortura psicológica, violência sexual, pau de arara e violência contra grávidas e crianças estiveram entre os métodos usados para obter informações.`
  },
  {
    title: "Presídio Tiradentes",
    researcherName: "Ruth Jacob Pimenta",
    authorBio: "Graduanda em Sociologia pela Universidade Federal Fluminense, integrante da linha Cinema e Ditadura em Plataforma Virtual e do grupo Subjetividade, Memória e Violência do Estado. Bolsista de Iniciação Tecnológica da FAPERJ.",
    relatedTitles: ["Torre das Donzelas"],
    inlineImages: [
      { afterText: "uma casa de correção.", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000118-994d2994d7/450/presidio.webp?ph=3554c7d1fd", alt: "Presídio Tiradentes", caption: "Fonte: Revista IstoÉ." },
      { afterText: "para se referir às detentas.", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000119-394ea394ec/450/ipat.webp?ph=3554c7d1fd", alt: "Portal de pedra do antigo Presídio Tiradentes", caption: "Fonte: Ipatrimônio." }
    ],
    references: `ISTOÉ. A Torre das Donzelas. https://istoe.com.br/83253_A+TORRE+DAS+DONZELAS/
Programa Lugares da Memória. Presídio Tiradentes. Memorial da Resistência de São Paulo, 2014.
TELES, Janaina de Almeida. Memórias dos cárceres da ditadura: os testemunhos e as lutas dos presos políticos no Brasil. Tese de doutorado, USP, 2011.
IPATRIMÔNIO. São Paulo — Portal de Pedra do Antigo Presídio Tiradentes. https://www.ipatrimonio.org/sao-paulo-portal-de-pedra-do-antigo-presidio-tiradentes/`,
    description: `Conhecida como Cadeia da Luz, a Casa de Correção foi inaugurada na cidade de São Paulo em 6 de maio de 1852. Em suas primeiras décadas, foi utilizada como cadeia pública para “arruaceiros e escravos fugitivos”. A estrutura foi pensada para abrigar depósitos de escravos, calabouços e uma casa de correção.

Popularizado anos depois como Presídio Tiradentes, durante o Estado Novo foi palco do encarceramento de pessoas que lutavam contra o regime, como o político José Maria Crispim e o escritor Monteiro Lobato.

Durante a Ditadura Empresarial-Militar, o presídio também foi utilizado para encarcerar opositores, conhecidos como presos políticos, além dos presos comuns chamados de “corrós”. Existiam dois pavilhões: o Pavilhão I, reservado aos presos políticos, e o II, utilizado para presos comuns. No auge da ditadura, chegou a abrigar 250 presos políticos, tornando necessária sua transferência também para o segundo pavilhão.

Havia ainda uma ala feminina para presas políticas, denominada “Torre das Donzelas”. Tratava-se de uma antiga torre circular, vigiada por guaritas e ligada ao Pavilhão II. O termo “donzelas” era usado de forma pejorativa para se referir às detentas.

Grande parte dos presos políticos chegava após interrogatórios que incluíam tortura, abuso sexual, ferimentos e extrema debilidade. O local representa uma violação aos direitos humanos pela forma como os encarcerados eram tratados, sem acesso a cuidados básicos e assistência médica.

Em 1973, o presídio foi desativado e posteriormente demolido. Apenas o Arco de Pedra permaneceu como resquício do passado. Em 1985, o Condephaat tombou o arco em defesa da memória desse período de repressão.`
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
    const data = { title: entry.title, description: entry.description, type: "GLOSSARY", researcherName: entry.researcherName, metadata: { authorBio: entry.authorBio, references: entry.references, inlineImages: entry.inlineImages || [], relatedFilms }, published: true, createdById: user.id };
    if (existing) await prisma.content.update({ where: { id: existing.id }, data }); else await prisma.content.create({ data });
  }
  console.log("3 verbetes da letra P importados com sucesso.");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
