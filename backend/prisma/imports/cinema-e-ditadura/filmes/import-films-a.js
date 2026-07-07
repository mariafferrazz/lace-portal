require("dotenv").config();
const prisma = require("../../../../src/db");

const films = [
  {
    title: "A Bolsa ou a Vida",
    youtubeId: "N2ERnOk57Z4",
    director: "Silvio Tendler",
    description: `No futuro pós-pandemia do novo coronavírus, a centralidade será o cassino financeiro e a acumulação de riqueza por uma elite ou uma vida de qualidade para todos, com menos desigualdade? O Estado mínimo se mostrou capaz de atender ao coletivo? Como garantir a vida sem direitos sociais e trabalhistas? Em qual modelo de sociedade queremos viver? “A Bolsa ou a Vida” aborda o desmonte do conceito de bem-estar social e nos faz refletir sobre a incompatibilidade do neoliberalismo com um projeto humanista de sociedade.

Estamos na bifurcação. Em 2020, a pandemia da COVID-19 escancarou as mazelas de um modelo político-econômico que, desde a sua gênese, se anunciava incapaz de atender à coletividade. Afetadas por sucessivas crises financeiras globais e amparadas por poucos direitos sociais, milhões de pessoas em todo o planeta enfrentam o vírus em sistemas falidos que salvam bancos no lugar de garantir condições mínimas de bem-estar para a população.

O filme-manifesto incorpora diferentes olhares em um quebra-cabeças sobre o Estado, a financeirização, a desigualdade, a vida nas cidades, nas florestas e no campo e as portas de saída para o pandemônio em que vivemos.`,
  },
  {
    title: "A Grande Partida: Anos de Chumbo",
    youtubeId: "sKOo06sBUiU",
    director: "Peter Cordernonsi",
    genre: "Documentário", country: "Brasil", year: "2011", duration: "74 min",
    description: "Depois do livro A Grande Partida: Anos de Chumbo, Francisco Soriano toma para si a missão de reunir vários companheiros, sobreviventes da ditadura de 1964, para juntos relembrarem a saga vivida na luta clandestina, buscando a libertação da sociedade brasileira submetida ao terrorismo do Estado policial. Relatos comoventes, antes silenciados pelos traumas do regime, que nos passam informações preciosas sobre os últimos 50 anos de história do Brasil. Também uma renovação de esperança na construção de uma sociedade menos desigual e mais humana.",
  },
  {
    title: "A História Oficial",
    youtubeId: "BibM13-Jd8E",
    director: "Luiz Puenzo",
    genre: "Drama", country: "Argentina", year: "2007", duration: "112 min",
    description: "Buenos Aires, década de 1980. Alicia é uma conservadora professora de história casada com Roberto e mãe adotiva da pequena Gaby. Completamente alheia à realidade argentina, Alicia começa a se dar conta dos acontecimentos recentes quando reencontra Ana, uma velha amiga que acaba de voltar do exílio. Sedenta por respostas, ela decide buscar pistas sobre a misteriosa origem de sua filha.",
  },
  {
    title: "A Memória que me Contam",
    youtubeId: "VNUERuACMeg",
    director: "Lúcia Murat",
    genre: "Drama", country: "Brasil", year: "2013", duration: "95 min",
    description: "A ex-guerrilheira Ana, ícone do movimento de esquerda, é o último elo entre um grupo de amigos que resistiu à ditadura militar no Brasil. Com a iminente morte da amiga, eles se reencontram na sala de espera de um hospital. Entre eles está Irene, uma diretora de cinema que se sente perdida diante da iminente morte da amiga e que precisa ainda lidar com a inesperada prisão de Paolo, seu marido, acusado de ter matado duas pessoas em um atentado terrorista ocorrido décadas atrás na Itália.",
  },
  {
    title: "A Mesa Vermelha",
    youtubeId: "bLKRqfOLDMQ",
    director: "Tuca Siqueira",
    genre: "Documentário", country: "Brasil", year: "2012", duration: "78 min",
    description: `A Mesa Vermelha exibe depoimentos de 23 ex-presos políticos no período da ditadura militar no Recife entre 1969, com a promulgação do AI-5, e 1979, com o advento da Lei da Anistia. Acompanha o documentário o debate entre os participantes, ao redor de uma mesa vermelha, sobre temas relacionados ao período da ditadura, passando pelo golpe de 1964, pela Guerrilha do Araguaia, pela luta dentro das prisões em prol da anistia ampla, geral e irrestrita, até a conjuntura atual.

Os depoimentos individuais dos protagonistas contam suas experiências de militância, prisão política e torturas. A Mesa Vermelha é fruto do Projeto Marcas da Memória da Comissão de Anistia do Ministério da Justiça em parceria com o Movimento Tortura Nunca Mais de Pernambuco, idealizado e coordenado pelas ex-presas políticas Yara Falcon e Lilia Gondim.`,
  },
  {
    title: "A Noite dos Lápis",
    youtubeId: "gOhkQ7JZV0k",
    director: "Héctor Oliveira",
    genre: "Drama", country: "Argentina", year: "1986", duration: "95 min",
    description: "Baseado nos eventos reais registrados na história como a Noite dos Lápis, o filme conta a história de sete alunos que, depois de protestarem por tarifas de ônibus mais baixas na cidade de La Plata, foram sequestrados em setembro de 1976, durante a última ditadura argentina, e posteriormente desapareceram. Apenas um aluno sobreviveu para contar o que aconteceu.",
  },
  {
    title: "Abdias: Raça e Luta",
    youtubeId: "sYLzhTyqt2U",
    director: "Maria Maia",
    genre: "Documentário", country: "Brasil", year: "2012", duration: "59 min",
    description: "O documentário retrata a trajetória do professor, artista plástico, escritor, teatrólogo, político e poeta Abdias Nascimento, sendo uma homenagem a um dos pioneiros do movimento negro no Brasil, perseguido durante a ditadura empresarial-militar.",
  },
  {
    title: "Ação entre Amigos",
    youtubeId: "Qm6yxx6ycgU",
    director: "Beto Brant",
    genre: "Drama", country: "Brasil", year: "1998", duration: "76 min",
    description: "Em 1971, Miguel, Paulo, Elói e Osvaldo participaram da luta armada contra a ditadura militar e acabaram presos e torturados. Vinte e cinco anos depois, os quatro amigos ainda se veem. Miguel acredita ter encontrado Correia, o homem que os torturou por meses, oficialmente dado como morto. Os quatro armam uma emboscada e sequestram o antigo torturador, que acaba revelando algo inimaginável: entre eles existia um delator.",
  },
  {
    title: "AI-5 – O Dia que Não Existiu",
    youtubeId: "QM2eZTaR0Ng",
    director: "Paulo Markun",
    genre: "Documentário", country: "Brasil", year: "2001", duration: "57 min",
    description: "O documentário reproduz a histórica e pouco conhecida sessão da Câmara dos Deputados que negou licença para processar Márcio Moreira Alves. O então deputado é considerado o provocador do Ato Institucional que desencadeou o período mais difícil do regime ditatorial militar brasileiro. A ata dessa sessão legislativa jamais foi publicada pelo Diário Oficial e, até a virada do século, ninguém tinha conhecimento de sua existência.",
  },
  {
    title: "Ainda Existem Perseguidos Políticos",
    youtubeId: "iZPT-y0va6o",
    director: "Coletivo Catarse",
    genre: "Documentário", country: "Brasil", year: "2012", duration: "54 min",
    description: "O documentário busca fomentar o debate sobre a ausência de uma efetiva transição democrática no Brasil após a ditadura civil-militar implantada em 1964. Identifica semelhanças no agir do Estado no passado e atualmente, demonstrando que a cultura do autoritarismo permanece arraigada em algumas instituições. Apresenta também imagens do projeto desenvolvido pela Acesso — Cidadania e Direitos Humanos em parceria com a Comissão de Anistia, que levou o debate a públicos quilombolas, universitários, LGBTT, assentados do MST e comunidades periféricas.",
  },
];

async function main() {
  const importer = await prisma.user.upsert({
    where: { email: "importacao-acervo@lace.local" },
    update: { name: "Importação do acervo LACE", active: false },
    create: { name: "Importação do acervo LACE", email: "importacao-acervo@lace.local", passwordHash: "LOGIN_DESATIVADO", role: "CONTRIBUTOR", active: false },
  });

  for (const film of films) {
    const externalUrl = `https://www.youtube.com/watch?v=${film.youtubeId}`;
    const metadata = {
      youtubeId: film.youtubeId,
      imageUrl: `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`,
      director: film.director,
      genre: film.genre,
      country: film.country,
      year: film.year,
      duration: film.duration,
    };
    const existing = await prisma.content.findFirst({ where: { type: "FILM", title: film.title } });
    const data = { title: film.title, description: film.description, type: "FILM", researcherName: "Equipe LACE", externalUrl, metadata, published: true, createdById: importer.id };
    if (existing) await prisma.content.update({ where: { id: existing.id }, data });
    else await prisma.content.create({ data });
  }
  console.log(`${films.length} filmes da letra A importados.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
