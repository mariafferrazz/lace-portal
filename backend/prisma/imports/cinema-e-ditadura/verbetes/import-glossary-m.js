require("dotenv").config();
const prisma = require("../../../../src/db");

const entries = [
  {
    title: "Militância",
    researcherName: "Autoria não informada",
    authorBio: null,
    references: null,
    relatedTitles: ["Vlado – 30 Anos Depois", "Marighella", "Marighella – Retrato Falado do Guerrilheiro", "Guerrilha do Araguaia", "Os Advogados Contra a Ditadura: Por uma Questão de Justiça"],
    description: `A militância, no contexto da ditadura de 1964, compõe-se como um elemento fundamental no desenrolar de toda a movimentação política da época. Podemos imaginá-la em suas múltiplas faces, seja dentro do espaço acadêmico, passando por diversos movimentos artísticos, até as guerrilhas que agiram tanto no campo como nos centros urbanos, como a Guerrilha do Araguaia.

O movimento do Sindicato dos Jornalistas, com as prisões e a morte de Vlado Herzog, foi um grande símbolo daquilo que a opressão do AI-5 representara. A imagem de Marighella e suas atividades dentro do PCB, sua participação no Comitê Central, a influência que trouxe da Revolução Chinesa e obras como “A Crise Brasileira” e “Manual do Guerrilheiro Urbano” são exemplos de militância.

A modernização da Igreja Católica e sua tentativa de aproximação das classes populares também tiveram importante papel político. A luta pelos direitos humanos levou à criação da Comissão de Justiça e Paz, oferecendo assistência humanitária e jurídica. Nesse campo, é importante considerar o papel dos advogados que também atuaram como militantes.

Partidos como o PCB, sob influência da Revolução Cubana, trouxeram o campesinato para as lutas armadas. Os estudantes participaram tanto da luta armada como das manifestações, levando pautas como a libertação da mulher, inovações culturais e a luta contra a censura. Jornalistas exigiam direitos trabalhistas e combatiam a censura; artistas criavam novas formas de expressão para contorná-la. Augusto Boal, Chico Buarque e Geraldo Vandré estão entre as figuras importantes desse processo.

A militância foi, portanto, um conjunto de movimentações espalhadas por diferentes setores da sociedade brasileira: estudantes, religiosos, guerrilheiros, jornalistas, artistas e advogados. Até hoje, essas comunidades e personagens lutam pela memória dos oprimidos, mortos e desaparecidos.`
  },
  {
    title: "Movimentos de Anistia",
    researcherName: "Gabrielle Medeiros",
    authorBio: "Graduanda em Ciências Sociais pela Universidade Federal Fluminense, integrante da linha de pesquisa Cinema e Ditadura em Plataforma Virtual, vinculada ao grupo Subjetividade, Memória e Violência do Estado.",
    references: null,
    relatedTitles: ["Se Um De Nós Se Cala", "Damas da Liberdade"],
    description: `Os movimentos de luta pela Anistia iniciaram-se em meados de 1970, durante a Ditadura Empresarial-Militar no Brasil. Surgiram com o objetivo de lutar pela redemocratização do país e rapidamente receberam o apoio da Ordem dos Advogados do Brasil. Foram recolhidas mais de 16 mil assinaturas em todo o território brasileiro para que a Lei da Anistia fosse criada. O processo culminou também no surgimento do Comitê Brasileiro pela Anistia, que lançou seu manifesto em 1978, no Rio de Janeiro, e depois ganhou seções em outros estados.

O Movimento Feminino pela Anistia esteve à frente dessas lutas. Foi fundado por oito mulheres e liderado pela advogada e ativista dos direitos humanos Therezinha Zerbini. Em 1975, publicaram o “Manifesto da Mulher Brasileira em favor da Anistia”. Em 1978, lançaram o jornal “Maria Quitéria”, com publicações voltadas à Anistia e aos Direitos Humanos.

Com a Anistia, em 1979, o grupo não cessou suas atividades. Continuou presente na luta contra as sequelas da ditadura e impulsionou a criação de outras frentes de resistência, como o Grupo Tortura Nunca Mais. Therezinha Zerbini faleceu em 14 de março de 2015, em São Paulo.`
  },
  {
    title: "Movimentos Negros na Ditadura",
    researcherName: "Ana Cláudia Bessa",
    authorBio: "Graduanda em Sociologia pela Universidade Federal Fluminense, pesquisadora e integrante da linha de pesquisa Cinema e Ditadura em Plataforma Virtual, vinculada ao grupo Subjetividade, Memória e Violência do Estado.",
    inlineImages: [{ afterText: "defendido pela ditadura.", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000125-7e89f7e8a4/450/mov%20negro.webp?ph=3554c7d1fd", alt: "Movimento negro durante a ditadura", caption: "Imagem da internet, sem autoria declarada." }],
    relatedTitles: ["Abdias: Raça e Luta", "Nossos Mortos Têm Voz", "Quase Dois Irmãos"],
    references: `COMISSÃO DA VERDADE DO RIO. Relatório de pesquisa Colorindo memórias e redefinindo olhares: Ditadura Militar e Racismo no Rio de Janeiro. Portal Geledés, 2015. https://www.geledes.org.br/wp-content/uploads/2015/12/Pires-T-Colorindo-memorias-e-redefinindo-olhares-Ditadura-militar-e-racismo-no-Rio-de-Janeiro-2.pdf
CONTEÚDO. Movimentos Negros. Portal Memórias da Ditadura. https://memoriasdaditadura.org.br/movimentosnegros/
MADEIRO, Carlos. Repressão aos negros: documentos mostram como a ditadura espionou movimento contra o racismo. Portal UOL, 2019. https://noticias.uol.com.br/reportagens-especiais/ditadura-militar-espionou-movimento-negro-reprimiu-e-infiltrou-agentes/
PIRES, Thula Rafaela de Oliveira. Estruturas Intocadas: Racismo e Ditadura no Rio de Janeiro. Revista Direito e Práxis, v. 9, n. 2, 2018, p. 1054-1079.
SILVA, Tairane Ribeiro da; SILVA, Gabriel Ribeiro da. Somos todos miscigenados? O mito da democracia racial imposta no período da ditadura civil-militar no Brasil. Revista Discente Ofícios de Clio, v. 1, n. 1, 2016.`,
    description: `A luta antirracista não começa na ditadura militar. Os séculos de escravidão deixaram sua marca em nossa sociedade e a luta do povo negro deve ser considerada desde muito antes. O que liga a luta antirracista à ditadura é o fato de que esse período exacerbou a criminalização e a discriminação do povo negro. Resgatar essa memória é fundamental para buscar reparação pelas violações de direitos humanos e revelar as ações violentas encobertas pelo discurso da democracia racial defendido pela ditadura.

No campo cultural, a valorização do negro começou a desenvolver espaço próprio. As teorias da mestiçagem e a ideologia da “democracia racial” foram criticadas por intelectuais, artistas e agitadores culturais. Florestan Fernandes demonstrou como os negros foram integrados à sociedade industrial e urbana com a manutenção de uma dupla exclusão, social e racial.

Movimentos sociais, partidos de esquerda e movimentos raciais foram perseguidos. Organizações como o Movimento Negro Unificado Contra a Discriminação Racial e manifestações culturais buscavam enaltecer a identidade negra, denunciar o preconceito e a violência contra jovens negros, pobres e moradores das periferias. Por questionarem o autoritarismo e lutarem por igualdade e direitos humanos, foram classificados como inimigos do regime.

Muitos integrantes do movimento negro também participavam de organizações políticas marxistas, trotskistas e comunistas, o que os colocava sob constante vigilância. Documentos do Arquivo Nacional mostram que as lutas raciais eram associadas ao terrorismo e classificadas como subversivas. Características culturais, religiosas, físicas e comportamentais — cabelos, danças, bailes, cultos africanos e gestos — eram tratadas como ameaças à ordem.

O silenciamento sustentou o mito da igualdade racial. Denúncias contra a repressão eram escondidas para preservar a imagem de harmonia, enquanto a militarização da polícia ampliava a criminalização e o encarceramento da população negra. Com a abertura democrática, os movimentos negros passaram a denunciar as violações, ainda enfrentando vigilância e resistência.

Essa dominação produziu discriminação, desemprego, marginalização e criminalização. Seus efeitos permanecem no racismo estrutural, na violência policial e no extermínio do povo negro. O autoritarismo e o racismo são heranças da ditadura que continuam acentuando desigualdades mesmo após décadas de democracia formal.`
  },
  {
    title: "Mulheres",
    researcherName: "Juliana Queires Hollweg",
    authorBio: "Mestranda em História e Património pela Faculdade de Letras da Universidade do Porto, graduada em Sociologia pela Universidade Federal Fluminense e integrante da linha de pesquisa Cinema e Ditadura em Plataforma Virtual.",
    relatedTitles: ["Damas da Liberdade", "Hoje", "Memórias Clandestinas", "Vou Contar para os Meus Filhos", "Zuzu Angel"],
    references: `FARIAS, Marcilene Nascimento de. A história das mulheres e as representações do feminino na história. Revista Estudos Feministas, v. 17, n. 3, 2009.
GIANORDOLI-NASCIMENTO, Ingrid Faria; TRINDADE, Zeidi Araújo; SANTOS, Maria de Fátima de Souza. Mulheres brasileiras e militância política durante a ditadura militar. Interamerican Journal of Psychology, v. 41, n. 3, 2007.
TELES, Maria Amélia de Almeida. Violações dos direitos humanos das mulheres na ditadura. Revista Estudos Feministas, v. 23, n. 3, 2015.`,
    description: `Ao longo da história humana, a mulher sempre esteve presente de forma ativa, principalmente nos momentos de conflito, por mais que o patriarcado diminua seu protagonismo. Isso não foi diferente durante a Ditadura Empresarial-Militar no Brasil, entre 1964 e 1985. Este verbete procura demonstrar a presença das mulheres, sua participação e seu movimento de resistência durante todo o período.

Essas mulheres se tornaram símbolos de força, resistência e organização, desafiando a concepção tradicional do feminino e a sociedade machista. Participaram da luta armada, lideraram sindicatos e organizações políticas e enfrentaram jornadas duplas e triplas de trabalho. Mães, filhas, irmãs e esposas se engajaram na luta, enfrentando os ditadores e, muitas vezes, perdendo a própria vida.

Parte das mulheres que resistiram foi atingida por diferentes formas de tortura, incluindo sevícias e estupros. Algumas assistiram seus filhos serem torturados ou sofreram abortos em decorrência da violência. Essas agressões constituem uma ferida ainda aberta, principalmente pela ausência de reconhecimento por parte do Estado.

As políticas repressoras e reacionárias afetaram as mulheres de modo incisivo. A censura estava diretamente relacionada à misoginia e à concepção judaico-cristã de mulher sustentada pelo Estado. As mulheres que povoaram campos e cidades brasileiras são, portanto, exemplos de luta, força e resistência.`
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
    if (existing) await prisma.content.update({ where: { id: existing.id }, data });
    else await prisma.content.create({ data });
  }
  console.log("4 verbetes da letra M importados com sucesso.");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
