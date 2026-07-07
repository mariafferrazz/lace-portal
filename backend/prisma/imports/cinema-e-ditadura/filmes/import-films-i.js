require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  { title: "Incontáveis. Episódio 4: População LGBTQIA+ na Ditadura", youtubeId: "6aTDB3yQ8SM", description: null },
  { title: "Incontáveis. Episódio 5: Populações Negras e Favelas na Ditadura", youtubeId: "qCPCvaFvDJM", description: null },
  {
    title: "Infância Clandestina", youtubeId: "YPpQYZIYDhk", director: "Benjamim Ávila", genre: "Drama", country: "Argentina", year: "2012", duration: "110 min",
    description: "Da mesma forma que seu pai, sua mãe e seu querido tio Beto, Juan leva uma vida clandestina. Fora do berço familiar ele é conhecido por um outro nome, Ernesto, e precisa manter as aparências pelo bem da família, que luta contra a ditadura militar que governa o país. Tudo corre bem, até ele se apaixonar por Maria, uma colega de escola. Sonhando com voos mais altos ao seu lado, ele passa por cima das rígidas regras familiares para poder ficar mais tempo com ela.",
  },
  {
    title: "IPES: Catálogo de Filmes", youtubeId: "rOfEge-dDJU", genre: "Documentário",
    description: `Documentário produzido pelo IPES (Instituto de Pesquisas e Estudos Sociais) no início dos anos 1960 no contexto da campanha de desestabilização do governo de João Goulart. Os filmes são referentes a problemas do Nordeste brasileiro, portos brasileiros, vida universitária, democracia, empresas de transportes, empresas e história do IPES.

1 - O Brasil precisa de você (00:00)
Convocação contra a demagogia e a agitação social, que desestabilizam o país, com ênfase na necessidade de defesa da democracia, da superação do sub-desenvolvimento e da justa distribuição de riquezas.

2 - Nordeste problema nº 1 (09:10)
A falta de perspectivas do homem nordestino, submetido à seca e à falta de planejamento governamental para a região; a necessidade de se investir na construção de hidrelétricas, na industrialização e no aproveitamento dos vales úmidos; a importância da implementação da dedução do imposto de renda das empresas nacionais para investimento no Nordeste, e no financiamento à empreendedores locais.

3 - História de um maquinista (19:10)
A precariedade do transporte ferroviário no país, com locomotivas ultrapassadas, comunicações deficientes e dormentes enferrujados, consequência da falta de uma política para o setor; a necessidade de modernização dos equipamentos, do saneamento administrativo e da construção de novas linhas férreas, com técnicas modernas e integradas aos terminais marítimos e rodoviários.

4 - A vida marítima (28:04)
O Instituto de Aposentadoria e Pensões dos Marítimos na manutenção da estabilidade financeira da categoria; o trabalho dos estivadores e a atuação do Sindicato dos Estivadores do Porto de Santos na defesa dos salários dos trabalhadores.

5 - Depende de mim (36:53)
As atividades dos trabalhadores de diversas categorias como, pedreiros, tintureiros, sapateiros, carpinteiros, aeronautas, agricultores, e outros, demonstrando que do voto de todos depende a manutenção da democracia, da liberdade e a defesa das tradições cristãs.

6 - A boa empresa (45:28)
A atuação da igreja como moderadora nas relações conflitantes entre patrões e empregados contribuindo para a melhoria das condições de vida dos trabalhadores e para o aumento da produtividade das empresas.

7 - Uma economia estrangulada (55:37)
A necessidade de renovação da marinha mercante brasileira formada por navios velhos e estaleiros obsoletos; a importância da modernização e racionalização do transporte marítimo, visando diminuir os seus custos.

8 - O IPES é o seguinte (01:03:42)
As propostas do IPES e seus objetivos: defesa do poder aquisitivo da população, redistribuição da renda nacional, combate a polarização esquerda-direita, defesa da educação, do saneamento, da modernização das indústrias, da desburocratização do estado, da saúde e do desenvolvimento agrícola, como necessários para o rápido crescimento do país.

9 - Portos paralíticos (01:12:53)
A precariedade da situação dos portos brasileiros, representados no norte pelo porto de Manaus e no sul pelo porto de Santos; os serviços deficientes e a necessidade de reorganização dos sindicatos e administrações portuárias e investimentos do governo federal.

10 - O que é o IPES (01:21:11)
Convocação à organização pela defesa das instituições democráticas e cristãs contra o totalitarismo; o repúdio à inflação, excesso de partidos políticos e o sub-desenvolvimento; as propostas do recém criado Instituto de Pesquisas e Estudos Sociais: estabilidade da moeda, moralização da estrutura governamental e redistribuição da renda; a necessidade de ação, através da mídia, entre os estudantes e trabalhadores do campo e da cidade.

11 - Criando homens livres (01:29:43)
A importância da educação na formação da cidadania e o exercício do voto contribuindo na escolha de bons governantes.

12 - Deixem o estudante estudar (01:40:26)
A necessidade de investimentos na criação de bibliotecas, reaparelhamento das universidades, salários dos professores, barateamento do livro didático, visando melhor rendimento dos estudantes universitários e protegendo-os contra a agitação política.

13 - Que é a democracia? (01:49:15)
O Brasil como um país de tradição democrática, em contraposição aos países do leste europeu, dominados pelo regime comunista; a importância de se votar nos candidatos que defendam a democracia.

14 - Conceito de empresa (01:59:28)
Convocação aos empresários para a união e divulgação do valor social de suas empresas e da importância do empresariado na manutenção da saúde, da educação e da economia do país, propondo a comunicação direta dos empresários com os trabalhadores, evitando a manipulação destes por agitadores políticos e defensores da estatização das empresas.`,
  },
];

async function main() {
  const importer = await prisma.user.findUnique({ where: { email: "importacao-acervo@lace.local" } });
  if (!importer) throw new Error("Usuário de importação do acervo não encontrado.");
  for (const film of films) {
    const externalUrl = `https://www.youtube.com/watch?v=${film.youtubeId}`;
    const metadata = { youtubeId: film.youtubeId, videoProvider: "youtube", imageUrl: `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`, director: film.director, genre: film.genre, country: film.country, year: film.year, duration: film.duration };
    const existing = await prisma.content.findFirst({ where: { type: "FILM", title: film.title } });
    const data = { title: film.title, description: film.description, type: "FILM", researcherName: "Equipe LACE", externalUrl, metadata, published: true, createdById: importer.id };
    if (existing) await prisma.content.update({ where: { id: existing.id }, data });
    else await prisma.content.create({ data });
  }
  console.log(`${films.length} filmes da letra I importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
