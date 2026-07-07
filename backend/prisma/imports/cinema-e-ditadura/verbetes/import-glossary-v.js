require("dotenv").config();
const prisma = require("../../../../src/db");

const entry = {
  title: "Valas Clandestinas e a Busca dos Desaparecidos pelo DNA",
  researcherName: "Caio Mattos Santos",
  authorBio: "Graduando em Antropologia pela Universidade Federal Fluminense, integrante da linha de pesquisa Cinema e Ditadura em Plataforma Virtual, vinculada ao grupo Subjetividade, Memória e Violência do Estado.",
  relatedTitles: ["Memória para Uso Diário"],
  inlineImages: [
    { afterText: "conseguiu a identificação.", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000148-2425324257/450/vala%201.webp?ph=3554c7d1fd", alt: "Vala clandestina de Perus em 1990", caption: "A vala clandestina de Perus, 1990. Foto: Marcelo Vigneron." },
    { afterText: "enterrados na década de 1970.", src: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000149-b32c6b32c9/700/vala%202.webp?ph=3554c7d1fd", alt: "Cecília Coimbra e Romildo Maranhão no Cemitério de Ricardo de Albuquerque", caption: "Cecília Coimbra e Romildo Maranhão no Cemitério de Ricardo de Albuquerque. Cena de Memória para Uso Diário, de Beth Formaggini (2007)." }
  ],
  references: `BRASIL, Vera Vital; COIMBRA, Cecília Maria Bouças. Exumando, identificando os mortos e desaparecidos políticos: uma contribuição do GTNM-RJ para o resgate da memória. In: MOURÃO, Janne Calhau (org.). Clínica e Política 2. Rio de Janeiro: Abaquar; Grupo Tortura Nunca Mais/RJ, 2009.
GUIMARÃES, Maria. Uma luta contra o desaparecimento. Revista Pesquisa Fapesp, ed. 250. São Paulo, 2016.
MORAIS, Karina. Ditadura Nunca Mais: aberta a última caixa da Vala Clandestina de Perus! Jornalistas Livres, 14 dez. 2019. https://jornalistaslivres.org/ditadura-nunca-mais-aberta-a-ultima-caixa-da-vala-clandestina-de-perus/
TELES, Maria Amélia de Almeida; LISBOA, Suzana Keniger. A vala de Perus: um marco histórico na busca da verdade e da justiça. In: COMISSÃO DE ANISTIA. Vala Clandestina de Perus. São Paulo: Instituto Macuco, 2012.
COIMBRA, Cecília. https://app.uff.br/slab/uploads/texto65.pdf
Grupo Tortura Nunca Mais/RJ. Memorial do Cemitério de Ricardo de Albuquerque. https://www.torturanuncamais-rj.org.br/wordpress/wp-content/uploads/2019/04/Material-GTNM-inaugura%C3%A7%C3%A3o-Memorial-do-Cemit%C3%A9rio-de-Ricardo-de-.pdf
Aventuras na História. Trabalhos realizados na Vala de Perus. https://aventurasnahistoria.uol.com.br/noticias/historia-hoje/conheca-os-trabalhos-realizados-na-vala-de-perus-e-que-estao-em-risco-apos-decreto-assinado-por-bolsonaro.phtml`,
  description: `“Eles, os desaparecidos, não nos permitem esquecer.” — Brasil e Coimbra

Define-se como desaparecido político aquela pessoa que foi aprisionada, seviciada, torturada e morta pelo Estado sem que este assuma responsabilidade sobre seu corpo. O Estado não reconhece sua participação naquele desaparecimento.

Segundo Cecília Coimbra, com base em pesquisas do Grupo Tortura Nunca Mais/RJ e de outras entidades de direitos humanos, desapareceram no Brasil cerca de 250 militantes políticos. De 1964 a 1972 foram 47 desaparecidos; somente em 1973 e 1974 desapareceram 87 opositores. Na Guerrilha do Araguaia, cuja repressão foi extremamente violenta, há 69 desaparecidos. Esses levantamentos ainda são incompletos, pois muitas informações não chegaram às entidades de direitos humanos.

A descoberta da vala de Perus, em São Paulo, e da vala clandestina do Cemitério de Ricardo de Albuquerque, no Rio de Janeiro, são marcos na procura e identificação das ossadas enterradas nesses e em outros locais do país.

Vala de Perus/SP

O Cemitério Dom Bosco, no bairro de Perus, Zona Norte de São Paulo, foi construído durante a ditadura, em 1971, pelo então prefeito Paulo Maluf. Hoje renomeado Colina dos Mártires, é um local de extrema importância na busca pelos desaparecidos políticos. Em 1990, após diversas denúncias, uma vala clandestina foi encontrada no local. Estima-se que sua criação tenha origem em uma série de exumações realizadas em 1975, circunstância considerada suspeita pela arqueóloga Márcia Hattori, pois o cemitério ainda possuía uma parte substancial vazia.

O reconhecimento das ossadas envolve análises de antropólogos forenses. Em 1990, o Departamento de Medicina Legal da Faculdade de Ciências Médicas da Unicamp foi encarregado do trabalho. A identificação inclui a elaboração do perfil biológico dos esqueletos e a comparação do material genético com amostras de familiares. Os depoimentos de familiares e companheiros dos desaparecidos também são cruciais.

A primeira identificação de um desaparecido político foi a de Luís Tejera Lisboa, marco na luta por memória e justiça. Enterrado em cova comum no Cemitério Dom Bosco sob seu nome clandestino, foi reconhecido graças às informações de sua esposa e aos indícios de um relatório de 1972 da Polícia Militar de São Paulo, que registrava seu suposto “suicídio”. Com esses dados, conseguiu a identificação.

Desde 2014, o Centro de Antropologia e Arqueologia Forense da Unifesp é responsável pela identificação das ossadas de Perus. Equipes internacionais, como a Equipe Argentina de Antropologia Forense, a Equipe Peruana de Antropologia Forense e pesquisadores da Bósnia, colaboraram com os trabalhos. Em 13 de dezembro de 2019, foi aberta a última caixa com ossadas da vala do Cemitério Dom Bosco. Até então, 41 pessoas assassinadas pelo regime haviam sido identificadas.

Em 1991, o Grupo Tortura Nunca Mais/RJ, junto ao então vice-governador Nilo Batista, confirmou a existência de uma vala clandestina no Cemitério de Ricardo de Albuquerque, na Zona Oeste do Rio. Pesquisas no Instituto Médico Legal, no Instituto de Criminalística Carlos Éboli e na Santa Casa de Misericórdia indicaram que pelo menos 14 militantes e dois desaparecidos estavam enterrados ali. As ossadas permaneceram guardadas no Hospital de Bonsucesso por vários anos. Em 2011, o GTNM/RJ e a Prefeitura do Rio inauguraram um memorial no cemitério, onde estão guardadas cerca de duas mil ossadas de indigentes enterrados na década de 1970.

A identificação dessas ossadas, assim como a da Vala de Perus, foi interrompida. Em 2019, o Decreto nº 9.759 extinguiu e limitou conselhos, grupos e comissões da administração pública federal. A decisão atingiu o Grupo de Trabalho Perus, associado à Comissão Especial sobre Mortos e Desaparecidos Políticos, suspendendo as equipes de identificação e condicionando a continuidade ao restabelecimento administrativo da investigação.

O Estado brasileiro ignora o sofrimento das famílias que tiveram seus entes retirados pelo regime empresarial-militar e dá continuidade à contenção da identificação dos desaparecidos. A repressão ainda afeta principalmente a juventude pobre e negra, criando diariamente novos desaparecidos. Continuaremos resistindo porque eles, os desaparecidos, não nos permitem esquecer.`
};

const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
(async () => {
  const user = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!user) throw new Error("Usuário de importação não encontrado");
  const films = await prisma.content.findMany({ where: { type: "FILM" }, select: { id: true, title: true } });
  const relatedFilms = entry.relatedTitles.map(title => films.find(film => normalize(film.title) === normalize(title))).filter(Boolean);
  const existing = await prisma.content.findFirst({ where: { type: "GLOSSARY", title: entry.title } });
  const data = { title: entry.title, description: entry.description, type: "GLOSSARY", researcherName: entry.researcherName, metadata: { authorBio: entry.authorBio, references: entry.references, inlineImages: entry.inlineImages, relatedFilms }, published: true, createdById: user.id };
  if (existing) await prisma.content.update({ where: { id: existing.id }, data }); else await prisma.content.create({ data });
  console.log("Verbete Valas Clandestinas importado com sucesso.");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
