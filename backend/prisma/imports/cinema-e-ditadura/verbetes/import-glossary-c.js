require("dotenv").config();
const prisma = require("../../../../src/db");

const entries = [
  {
    title: "Censura", researcherName: "Ruth Jacob Pimenta",
    relatedTitles: ["Ainda Existem Perseguidos Políticos", "A Memória que me Contam", "A Mesa Vermelha", "Damas da Liberdade", "Em Nome da Segurança Nacional", "Infância Clandestina", "Machuca", "Memórias da Repressão", "O Desafio", "O Fim do Esquecimento", "Peões", "Tatuagem"],
    description: `A censura no regime empresarial-militar brasileiro (1964-1985) marcou severamente a população, deixando vestígios até os dias de hoje. O governo militar buscava transparecer uma imagem de estabilidade política e a prosperidade da nação. Após a eclosão do golpe, foi criado o Serviço Nacional de Informações (SNI), em 1964 — que exercia a função de catalogar e rastrear aqueles considerados inimigos do Estado — e que substituiu o Departamento Nacional de Propaganda (DNP), de 1938. A repressão era tão intensa que pessoas contrárias ao regime eram consideradas inimigas do Estado, conforme a Lei de Segurança Nacional (Decreto-Lei nº 314, de 13 de março de 1967).

Neste período, muitas instituições e empresas foram reprimidas e fechadas, pessoas presas ou vigiadas. Expressar opinião, pensar diferente do governo, falar abertamente, ouvir uma música, ler um livro, assistir a um filme ou show que não expressassem a propaganda governamental poderia ser justificativa para punição, retalhamento, tortura e até mesmo a morte. A população era massificada com a propaganda governamental nas instituições e nos meios de comunicação, como canais de televisão, rádio e jornais.

Em todas as casas de teatro, de shows, salas de cinema, redações de jornais e rádios havia um censor. Fora proibida pelo Estado a divulgação de qualquer notícia contra o governo pelas mídias sociais — música, programas televisivos, programas de rádio, cinema, livros e jornais — com a elaboração de um Conselho Superior de Censura (1968), com base no modelo norte-americano de 1939, com o objetivo de vigiar e punir órgãos de comunicação que burlassem as regras.`,
    references: "Ruth Jacob Pimenta, graduanda em Sociologia pela Universidade Federal Fluminense (UFF), integrante da linha de pesquisa “Cinema e ditadura em plataforma virtual”, vinculada ao grupo de pesquisa certificado no CNPq “Subjetividade, Memória e Violência do Estado”. Bolsista de Iniciação Tecnológica da FAPERJ.",
  },
  {
    title: "Censura e Cinema", researcherName: "Maria Clara Arbex",
    relatedTitles: ["O Desafio", "Terra em Transe", "Manhã Cinzenta", "O Bom Burguês", "Eles Não Usam Black-Tie", "Pra Frente, Brasil", "Frei Tito", "Jango"],
    description: `Para entender o impacto da censura imposta pela ditadura empresarial-militar de 1964 no cinema brasileiro, é preciso relembrar os anos que antecederam o golpe. Em 1955, Nelson Pereira dos Santos reúne um grupo de amigos e produz Rio, 40 Graus, marco cinematográfico e obra de inspiração para o Cinema Novo. Em Salvador, em 1961, Glauber Rocha ainda estudante filma seu primeiro longa-metragem, Barravento. Um ano depois, o CPC (Centro Popular de Cultura da UNE) roda Cinco Vezes Favela. Em 1963, Glauber prepara Deus e o Diabo na Terra do Sol; Nelson Pereira dos Santos filma Vidas Secas e Ruy Guerra finaliza Os Fuzis. O novo cinema brasileiro, inspirado pelo neorrealismo italiano e a Nouvelle Vague francesa, preza pelo filme de autor, feito fora dos grandes estúdios e que reflita os reais problemas do povo.

Toda essa efervescência foi interrompida em 1964. Até o golpe, a censura classificava os filmes apenas pela faixa etária; os cortes de cenas, a remoção de falas e a proibição total da circulação da obra até então não existiam. Com o novo regime, a censura é reorganizada para servir aos interesses dos militares que assumiram o poder. Segundo Leonor Souza Pinto, essa reestruturação pode ser identificada em quatro fases:

1ª fase (1964-1966), a fase moralista: o foco principal era a preservação da “moral conservadora vigente”, defendida pelos setores da sociedade que apoiaram o golpe. A maior parte da censura era feita através de cortes de cenas e falas consideradas impróprias. Os cineastas criaram em 1965 a DiFilm; como resposta, os militares criaram em 1966 o Instituto Nacional de Cinema (INC).

2ª fase (1967-1968), a militarização dos órgãos de censura: ocorre uma gradual militarização dos comandos nacional e estadual. Foi criado o Conselho Superior de Censura, composto por representantes do governo e de entidades civis. Essa fase revela crescente preocupação com o conteúdo político das obras.

3ª fase (1969-1974), a censura político-ideológica: no período iniciado com a edição do AI-5, a censura evidencia o caráter político-ideológico como ratificação do regime. O governo investe na profissionalização dos censores e, em 1969, cria a Embrafilme. O cinema reinventa sua linguagem, adotando cada vez mais a metáfora e a alegoria; surge o Cinema Marginal.

4ª fase (1975-1988), a distensão: em 1975, o cinema abandona a metáfora e se reaproxima do grande público. Durante o gradual processo de abertura democrática, a atenção da censura passa do cinema para a televisão. Nas salas de cinema, o controle se torna mais moderado, ao passo de um investimento pesado nas proibições para a televisão.

Ao mesmo tempo em que as obras sofriam cortes e controle no âmbito nacional, eram exportadas sem interdições para o estrangeiro. Isso fazia parte da política de difusão de uma imagem “democrática” do país para o exterior e evidencia que a censura foi um mecanismo essencial para a sustentação do regime. A censura é extinta com a Constituição de 1988 e a Embrafilme é fechada em 1990. Após duas décadas de perseguição, o cinema brasileiro se encontra fragilizado. Uma sorte que podemos reconhecer é que a censura era feita diretamente nas cópias montadas para exibição; nem roteiros nem negativos eram afetados. Isso nos permite apreciar ainda hoje, em sua totalidade, grandes obras de resistência feitas em um período tão sombrio.`,
    references: `PINTO, Leonor E. Souza. O cinema brasileiro face à censura imposta pelo regime militar no Brasil — 1964/1988. Disponível em: https://www.memoriacinebr.com.br/

https://memoriasdaditadura.org.br/

Maria Clara Arbex, estudante de Cinema e Audiovisual na Universidade Federal do Recôncavo da Bahia, integrante da Linha de Pesquisa “Cinema e Ditadura em Plataforma Virtual”.`,
  },
  {
    title: "Comissão Nacional da Verdade", researcherName: "Ana Cláudia Bessa", relatedTitles: ["Zuzu Angel"],
    inlineImages: [
      { afterText: "Comissão da Verdade como mecanismo para elucidação da verdade sobre os fatos.", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000132-74bff74c01/dilminha.webp?ph=3554c7d1fd", alt: "Instalação da Comissão Nacional da Verdade", caption: "Foto de Fabrício Faria · Site da Comissão Nacional da Verdade" },
      { afterText: "não constam as consequências objetivas diante dos fatos relatados no relatório.", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000133-48afc48aff/700/grafico.webp?ph=3554c7d1fd", alt: "Gráfico sobre o relatório da Comissão Nacional da Verdade", caption: "Fonte: Portal G1" },
    ],
    description: `A história da instauração da Comissão da Verdade no Brasil começa com a luta dos desaparecidos da Guerrilha do Araguaia. Foi por intermédio de um relatório expedido em 2009, em nome deste movimento, que o Brasil foi condenado através de uma sentença da Corte Interamericana de Direitos Humanos a cumprir várias recomendações para implementação de ações para investigar, processar e punir as violações de direitos humanos ocorridas no país, além da possibilidade de uma revisão da Lei da Anistia e da instauração de uma Comissão da Verdade como mecanismo para elucidação da verdade sobre os fatos.

A Comissão Nacional da Verdade foi criada pela Lei 12.528/2011 e instituída em 16 de maio de 2012, com a finalidade de apurar graves violações de Direitos Humanos ocorridas entre 18 de setembro de 1946 e 5 de outubro de 1988. Sua instalação foi considerada uma grande vitória e uma esperança aos que aguardavam por mais de 40 anos a revelação da verdade sobre as violências e atrocidades cometidas durante a Ditadura Civil-empresarial-militar e a busca por justiça para as vítimas, mortos, desaparecidos e suas famílias.

O que se esperava da comissão era localizar as vítimas, saber como foram vitimadas, identificar os autores dos crimes cometidos pelo Estado Brasileiro e julgá-los nos trâmites da lei. Contudo, como levanta uma nota do Grupo Tortura Nunca Mais, a Comissão não teve plenos poderes, teve restrito o período de investigação, poucos integrantes, não teve orçamento e o sigilo foi garantido, o que impedia atuação e divulgação ampla e irrestrita sobre os arquivos militares.

Em 10 de dezembro de 2014, o relatório final, composto por três volumes, foi entregue à presidenta Dilma Rousseff como resultado de dois anos e sete meses de trabalho. A Comissão colheu 1.121 depoimentos, realizou 80 audiências e sessões públicas, determinou diligências investigativas e perícias, identificou um desaparecido, revelou as circunstâncias de morte de 434 vítimas e visitou sete unidades militares onde foram praticadas torturas e violações de direitos humanos. Contudo, no site da Comissão Nacional da Verdade, não constam as consequências objetivas diante dos fatos relatados no relatório.

A CNV brasileira não julgou os crimes cometidos durante a ditadura, estimulada pela Lei da Anistia de 1979. Ao contrário, países como Alemanha, Peru e Argentina tiveram seus processos julgados e as pessoas punidas. O Brasil foi um dos últimos países a instaurar uma Comissão da Verdade. Mais de 30 países, inclusive países da América Latina, já agiram em função de reparar as violências cometidas pelo Estado e promover justiça. A Comissão da Verdade entra para a história como mais um episódio de frustração em busca de reparação histórica e justiça para um dos períodos mais hediondos vividos em nosso país.`,
    references: `Sentença da Corte Interamericana de Direitos Humanos sobre o Caso Gomes Lund e outros (Guerrilha do Araguaia).
Comissão Nacional da Verdade. Site oficial.
BECKER, Alberto Henrique et al. Carta Aberta à Comissão Nacional da Verdade. 2012.
Diretoria do GTNM/RJ. Nota do GTNM/RJ na formação da Comissão Nacional da Verdade. 2013.
PONCHIROLLI, Rafaela. O que é a Comissão Nacional da Verdade? Politize!

Ana Cláudia Bessa, graduanda em Sociologia pela Universidade Federal Fluminense e integrante da linha de pesquisa “Cinema e ditadura em plataforma virtual”.`,
  },
  {
    title: "Comunismo", researcherName: "Marcia Barbosa", relatedTitles: [],
    description: `O comunismo é um sistema político que defende o fim do Estado, a propriedade coletiva dos meios de produção, a abolição da propriedade privada e o fim das classes sociais. No Brasil, teve seu marco com a fundação do Partido Comunista do Brasil (PCB), em 1922, e foi de grande influência para o surgimento de outras organizações de esquerda. O comunismo foi usado como justificativa para a implantação do golpe empresarial-militar de 1964. A fim de acabar com o “perigo comunista” e implantar a “revolução democrática”, por meio do IPES e dos meios de comunicação hegemônicos, os ideais anticomunistas foram propagados para trazer maior apoio popular às ações do governo golpista.

As ditaduras militares de diversos países da América Latina tiveram grande financiamento dos Estados Unidos e das grandes corporações internacionais, e no Brasil não foi diferente. O governo estadunidense financiou e apoiou os regimes ditatoriais com a desculpa de conter o avanço comunista em prol do desenvolvimento capitalista e da reorganização econômica dos países latino-americanos de acordo com os ideais imperialistas.`,
    references: "Marcia Barbosa, graduanda em Ciências Sociais pela Universidade Federal Fluminense e integrante da Linha de Pesquisa “Cinema e Ditadura em Plataforma Virtual”. Bolsista de Desenvolvimento Acadêmico da UFF.",
  },
  {
    title: "Crianças na Ditadura", researcherName: "Ana Cláudia Bessa", relatedTitles: ["15 Filhos", "O Ano que Meus Pais Saíram de Férias"],
    inlineImages: [{ afterText: "As crianças também foram atingidas pela ditadura no Brasil.", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000109-035560355a/crian%C3%A7as.webp?ph=3554c7d1fd", alt: "Crianças detidas durante a ditadura militar no Brasil", caption: "Crianças detidas na ditadura militar no Brasil · Domínio Público" }],
    description: `As crianças também foram atingidas pela ditadura no Brasil. A ditadura empresarial-militar brasileira perseguiu e matou aqueles que se opunham ao regime. Um argumento comumente usado para defender a Ditadura Militar se baseia no pensamento de que os presos políticos eram presos ou perseguidos porque deviam estar fazendo algo “errado”. Esse argumento cai definitivamente por terra quando se descobre que o Estado não cometeu violência apenas contra adultos ou jovens estudantes. Muitas crianças, filhos e filhas de homens e mulheres perseguidos e presos políticos, também foram violentadas e torturadas física e psicologicamente pelos agentes do regime. A maioria era filha de mulheres militantes e foi sequestrada por vingança ou para coagir seus pais e mães em troca de informações. Existem crianças desaparecidas até hoje.

Os sequestros e torturas tinham um propósito: coagir e pressionar os presos políticos e os chamados “terroristas” a confessarem ou entregarem seus companheiros. Entre os relatos está o de Maria Amélia de Almeida Teles, a Amelinha. Seus filhos de quatro e cinco anos foram presos e levados para a sala de tortura onde ela se encontrava nua, urinada e vomitada, o que considerou a maior de todas as torturas que sofreu. Quem comandou esta ação foi o Coronel Ustra, e o depoimento de Amelinha foi decisivo para que o militar fosse oficialmente reconhecido como torturador pela Justiça brasileira.

No livro “Infância Roubada — Crianças atingidas pela Ditadura Militar no Brasil”, Samuel Moreira descreve crianças sequestradas e escondidas em centros clandestinos de repressão, afastadas dos pais, enquadradas como elementos subversivos, banidas do país, obrigadas a viver com nomes falsos e privadas do cuidado paterno e materno no momento mais decisivo da vida.

As violências trazem sequelas que não ficam marcadas apenas como histórias do passado. A separação da família, por um tempo que pode chegar a várias décadas, gera casos em que o resgate do convívio familiar nunca foi possível. Carlos Alexandre Azevedo foi um dos casos mais conhecidos. Levado de sua casa por policiais do DOPS-SP em 1974, quando tinha um ano e oito meses, foi golpeado, recebeu choques e ficou detido por 15 horas. Carlos nunca se recuperou e se suicidou em 2013.

Algumas crianças nem nasceram porque suas mães foram assassinadas ainda grávidas. Outras foram torturadas no ventre ou nasceram no cárcere. Existem casos de crianças geradas por estupros cometidos contra mulheres militantes. Muitas ficaram encarceradas por anos como subversivas, perigosas e inimigas do Estado. Há relatos de recém-nascidos que sequer conheceram mães e pais, crianças que testemunharam seus familiares serem torturados ou mortos.

Os casos são tantos que é impossível enumerá-los. O resgate dessas histórias e da verdade, diante de violações extremas de direitos humanos, precisa vir a público para que a memória dos atingidos não seja perdida ou esquecida, para que a justiça um dia seja feita e para impedir a ação daqueles que desejam apagar os fatos históricos, mantendo criminosos impunes.`,
    references: `BRANDÃO, Marcelo. Presa política lembra como “conheceu” o Coronel Ustra. Agência Brasil/Rede Brasil Atual, 2016.
CÂMARA DOS DEPUTADOS. Bebês e crianças sequestrados durante a ditadura: uma história para não esquecer.
REDAÇÃO RBA. Ustra condenado: “Além da verdade, queremos justiça”, dizem familiares. 2012.
ROCHA, Davi. 11 histórias de crianças atingidas pela Ditadura Militar brasileira. 2018.
SÃO PAULO. Comissão da Verdade “Rubens Paiva”. Infância Roubada: Crianças atingidas pela Ditadura Militar no Brasil. ALESP, 2014.

Ana Cláudia Bessa, graduanda em Sociologia pela Universidade Federal Fluminense, pesquisadora e integrante da linha de pesquisa “Cinema e ditadura em plataforma virtual”.`,
  },
];

async function main() {
  const importer = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  const films = await prisma.content.findMany({ where: { type: "FILM", published: true }, select: { id: true, title: true } });
  for (const entry of entries) {
    const relatedFilms = entry.relatedTitles.map((title) => films.find((film) => film.title === title)).filter(Boolean);
    const metadata = { references: entry.references, relatedFilms, inlineImages: entry.inlineImages };
    const existing = await prisma.content.findFirst({ where: { type: "GLOSSARY", title: entry.title } });
    const data = { title: entry.title, description: entry.description, type: "GLOSSARY", researcherName: entry.researcherName, metadata, published: true, createdById: importer.id };
    if (existing) await prisma.content.update({ where: { id: existing.id }, data }); else await prisma.content.create({ data });
  }
  console.log(`${entries.length} verbetes da letra C importados.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
