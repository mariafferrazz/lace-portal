require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  {
    title: "Cabra-Cega", youtubeId: "VDWbNnLVu3s", director: "Toni Venturi", genre: "Drama", country: "Brasil", year: "2005", duration: "107 min",
    description: "Os anos de chumbo da ditadura norteiam a vida de dois estudantes que vivem o sonho da revolução. Comandante de um grupo de ação, Tiago é ferido em uma emboscada da polícia e precisa se esconder em um apartamento. A militante de base Rosa torna-se, então, sua enfermeira e único contato com o mundo.",
  },
  {
    title: "Camponeses do Araguaia: A Guerrilha Vista por Dentro", youtubeId: "UhpO4I2O0zs", director: "Vandré Fernandes", genre: "Documentário", duration: "73 min",
    description: `Ocorrida entre 1972 a 1974, a Guerrilha do Araguaia é um episódio importante da história do Brasil. Na época da ditadura militar, a região em que a guerrilha ocorreu foi palco da maior resistência armada contra o regime ditatorial. O local recebeu um contingente militar comparável ao da Força Expedicionária Brasileira (FEB), que lutou na Europa durante a Segunda Guerra Mundial.

O movimento guerrilheiro, organizado pelo Partido Comunista do Brasil (PCdoB), resistiu porque conquistou o apoio dos camponeses que ali viviam. Para aniquilar a resistência, houve uma repressão brutal. Além dos guerrilheiros, os moradores foram alvo de torturas e assassinatos.

O documentário Camponeses do Araguaia - A Guerrilha Vista Por Dentro traz o depoimento de pessoas que foram vítimas da truculência da ditadura e hoje lutam para que o Estado reconheça os crimes cometidos e anistie os atingidos pela repressão.`,
  },
  {
    title: "Cara ou Coroa", youtubeId: "5oRhpk3I3tA", director: "Ugo Giorgetti", genre: "Drama", country: "Brasil", year: "2012", duration: "90 min",
    description: "São Paulo, inverno de 1971, o país está sob a ditadura militar. O diretor de teatro João Pedro (Emilio de Mello) divide seu tempo entre ensaios da peça O Interrogatório, de Peter Weiss, discussões com a ex-mulher, apostas em corridas de cavalo e dúvidas sobre a atividade política clandestina. Entre um ensaio e outro, João Pedro recebe visitas de um integrante do Partido Comunista, que não compreende suas opções estéticas e políticas, e se mostra descontente com o encaminhamento que o diretor dá aos ensaios da peça, financiada parcialmente pelo partido. Paralelamente, seu irmão Getúlio (Geraldo Rodrigues) e a namorada, Lilian (Julia Ianina) - dois jovens idealistas - são levados a colaborar com a resistência política quando solicitados a refugiar dois homens perseguidos pelo regime militar. A única opção viável é escondê-los na casa do avô de Lilian (Walmor Chagas), um respeitável militar da reserva. A decisão levará cada um deles a refletir sobre a questão do engajamento político e suas implicações na vida comum.",
  },
  {
    title: "Cassandra Rios: A Safo de Perdizes", youtubeId: "njo0xngUl28", director: "Hanna Korich", genre: "Documentário", country: "Brasil", year: "2013", duration: "62 min",
    description: "Cassandra Rios foi uma escritora que causou polêmica nos anos 70. Em plena Ditadura Militar, ela abordava a homossexualidade em suas obras, sendo perseguida sob alegação de pornografia. Com depoimentos de amigos, familiares, leitores e colegas, homenagem à uma artista pioneira que mostrou a mulher como um ser sexual e ainda abriu espaço para a discussão de um tema considerado tabu.",
  },
  {
    title: "Cidadão Boilesen – Um dos Empresários que Financiou a Tortura no Brasil", youtubeId: "yGxIA90xXeY", director: "Chaim Litewski", genre: "Documentário", country: "Brasil", year: "2009", duration: "1h30min",
    description: "Através de diversos depoimentos, o documentário revela as ligações de Henning Albert Boilesen (1916-1971), presidente do famoso grupo Ultra, da Ultragaz, com a ditadura militar. Seu apoio, assim como de muitos outros empresários, financeiro ao movimento de repressão violenta e também a sua participação na criação da temível Oban - Operação Bandeirante, espécie de pedra fundamental do Doi-Codi.",
  },
  {
    title: "Corpo em Delito", youtubeId: "XD7JpE3J078", director: "Nuno César Abreu", genre: "Drama", country: "Brasil", year: "1989", duration: "90 min",
    description: "Durante a Ditadura Militar, o frio médico legista Dr. Athos Moreira Brasil trabalhou para o governo autoritário, falsificando laudos para esconder as vitimas da repressão do regime. Ele se apaixona por Tana Divino, uma sensual e ambiciosa mulher que trabalha dublando cantoras em uma casa noturna. Após se aposentar, ele se muda para uma de praia, mas acaba sendo atormentado pelos fantasmas de seu passado. Dentre eles, o da própria filha, uma militante clandestina procurada pelos militares.",
  },
  {
    title: "Cúmplices? A Volkswagen e a Ditadura Militar no Brasil", youtubeId: "1iWmAmvNMNg",
    description: null,
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
  console.log(`${films.length} filmes da letra C importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
