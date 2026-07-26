import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink, FileText, X } from "lucide-react";
import Container from "../../components/ui/Container";
import SocialShare from "../../components/ui/SocialShare";
import api from "../../services/api";
import { contentFileUrls, contentImage } from "../../utils/contentMetadata";

const authors = [
  {
    name: "Joana D'Arc Fernandes Ferraz",
    articles: [
      {
        title: "O Dia Que Durou 21 Anos: a simbiose entre passado e o presente pelas lentes do cinema",
        url: "https://www.e-publicacoes.uerj.br/index.php/transversos/article/view/26535",
        summary:
          "O objetivo geral deste artigo é refletir, com Nietzsche e Foucault, sobre o uso que fazemos da História do golpe militar-empresarial brasileiro, por meio do documentário O DIA QUE DUROU 21 ANOS (Brasil, 2013) e de autores que, ainda na ditadura, nas décadas de 1970 e de 1980 do século passado, interpretaram este evento a partir do contexto político e econômico de dependência ao capital internacional. A démarche a estes autores brasileiros tem como foco analisar questões que, pelas mais variadas percepções, acabaram se empoeirando e se distanciando de nossos olhares.",
      },
      {
        title: "A Pandorga e a Lei: passado-presente-futuro",
        url: "https://www.e-publicacoes.uerj.br/index.php/maracanan/article/view/31248",
        summary:
          "Percorrendo os diferentes tempos provocados pela peça A Pandorga e a Lei (1983-1984), de João das Neves, este artigo pretende pensar as relações entre memória e crise no Brasil contemporâneo, a partir do conceito de duração e dos seus desdobramentos, inaugurado por Henri Bergson. Foi feita a leitura pública desta peça, pela primeira vez, no I Seminário do Grupo Tortura Nunca Mais - RJ, ocorrido nos dias 28, 29, 30, 31 outubro e 1º de novembro de 1985, na Universidade Cândido Mendes. Este Seminário formalizou a fundação do GTNM-RJ. Nossas reflexões têm como ponto de partida a ditadura empresarial-militar brasileira. Mais do que um tempo linear, cronológico e quantitativo, o tempo da duração é múltiplo e qualitativo. Nele, passado, presente e futuro interagem incessantemente, suscitam problemas, reativam feridas, cicatrizes e abrem brechas. Atravessar as fronteiras do tempo, olhar para os horrores do passado, perceber o que tem deste passado no presente e atentar para o que ele pode nos acenar para o futuro impõe-se como desafio à compreensão do panorama contemporâneo brasileiro.",
      },
      {
        title: "Grupo Tortura Nunca Mais do Rio De Janeiro: três décadas de resistência",
        url: "https://www.e-publicacoes.uerj.br/index.php/transversos/issue/view/1782/showToc",
        note: "Dossiê: Marilene Rosa Nogueira, Cecília Maria Bouças Coimbra, Joana D'Arc Fernandes Ferraz",
      },
      {
        title: "Lugares de memória da ditadura: disputas entre o poder público e os movimentos sociais",
        url: "https://revistas.ulusofona.pt/index.php/cadernosociomuseologia/article/view/6367",
        note: "Joana D'Arc Fernandes Ferraz e Lucas Pacheco Campos",
        summary:
          "Os lugares de memória, na perspectiva de Pierre Nora (1990), são espaços de eternização de uma memória de um grupo que já não consegue mais ser evocada espontaneamente pela memória coletiva. Há uma grande disputa entre o Estado e os movimentos sociais em relação à preservação do patrimônio histórico que faz alusão ao golpe militar-empresarial brasileiro (1964-1985), no Rio de Janeiro. Pretendemos pensar o lugar político destes lugares memórias, a partir das querelas em torno da patrimonização de alguns espaços e prédios, que fazem apologia ao golpe e à ditadura, na cidade do Rio de Janeiro. A política que tem sido efetuada até agora pelo Estado pode ser definida como conciliatória. Não obstante, os movimentos sociais reclamam a inserção de suas vozes nestes lugares, considerando-as, silenciadas ou esquecidas. Interessa-nos analisar estas disputas e as seus reflexos na sociedade.",
      },
    ],
  },
  {
    name: "Cecilia Maria Bouças Coimbra",
    articles: [
      {
        title: "Eu não quero que o ódio seja o melhor de mim: lutar contra os microfascismos e afirmar a diferença que está no mundo",
        url: "https://www.e-publicacoes.uerj.br/index.php/mnemosine/article/view/45995",
        summary: "Entrevista com Cecília Maria Bouças Coimbra.",
      },
      {
        title: "Problematizando A Experiência Clínicopolítica Da Equipe Clínico-Grupal Tortura Nunca Mais",
        url: "https://www.e-publicacoes.uerj.br/index.php/transversos/article/view/33653",
        note: "Cecilia Maria Bouças Coimbra, Ana Monteiro de Abreu",
        summary:
          "Este texto é um efeito de encontros experimentados ao longo de 23 anos de existência da Equipe Clínico-Grupal Tortura Nunca Mais. Destacamos aqui algumas linhas ético-estético-políticas que atravessaram a experiência compartilhada pelas autoras. Elegemos duas questões-analisadoras que, a nosso ver, expressam o percurso da construção do trabalho de assistência médica-psicológica-fisioterápica a pessoas atingidas, direta ou indiretamente, pela violência do Estado: a inseparabilidade entre clínica e política e o risco de naturalização da figura da vítima. Nestas problematizações escolhemos um caminho, buscando intercessores, para pensarmos os dispositivos clínicopolíticos em funcionamento ao longo do percurso. Dentre muitos, destacamos Michel Foucault, Gilles Deleuze e Felix Guattari como autores que, em muito, nos ajudam a pensar o tempo presente. Nossa aposta segue na afirmação dos movimentos desejantes que ousam inventar continuamente a Vida e um Viver Singular e Autônomo.",
      },
      {
        title: "1968 na França - 2013 no Brasil: Acontecimentos-Resistências",
        url: "https://www.scielo.br/j/rdp/a/MyVNVwbK3BDrsFPMBL9HNqH/?lang=pt&format=pdf",
        note: "Cecilia Maria Bouças Coimbra, Ana Monteiro de Abreu",
        summary:
          "Movidas pela afirmação de Gilles Deleuze que qualifica o Maio de 68 francês como um Acontecimento, passamos a nos perguntar: qual o significado desta afirmação? O que este conceito filosófico expressa? Poderíamos considerar Junho de 2013 no Brasil um Acontecimento? Este texto surge no percurso desafiador destas interrogações. Além das contribuições de Gilles Deleuze, contamos com interlocuções de outros pensadores, tais como Félix Guattari, Fiedrich Nietzsche e Michel Foucault.",
      },
      {
        title: "Cinquenta anos depois...",
        url: "https://revistas.pucsp.br/index.php/verve/article/view/30684",
        summary:
          "Análise-depoimento acerca dos 50 anos do Golpe Civil-Militar de 1964. Afastado do saudosismo conservador, o artigo retoma eventos do dia do golpe e a tomada do CACO pelos militares. Questiona a continuidade da censura e da tortura mesmo na democracia. Alerta para a retomada necessária dessa memória, desviando-se dos acordos e concessões da Comissão Nacional da Verdade e suas correlatas estaduais. Afirma a continuidade do vigor político dos que enfrentaram o golpe para construção de outros mundos sem cair da chantagem do possível.",
      },
      {
        title: "Grupo Tortura Nunca Mais do Rio De Janeiro: três décadas de resistência",
        url: "https://www.e-publicacoes.uerj.br/index.php/transversos/issue/view/1782/showToc",
        note: "Dossiê: Marilene Rosa Nogueira, Cecília Maria Bouças Coimbra, Joana D'Arc Fernandes Ferraz",
      },
    ],
  },
  {
    name: "Ana Cláudia Camuri",
    articles: [
      {
        title: "Como não podemos olhar do mesmo modo para certas coisas",
        url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000076-c7149c714b/Artigo.pdf?ph=3554c7d1fd",
        summary:
          "O presente artigo consiste em uma crítica à historiografia tradicional sobre a tortura a partir da perspectiva genealógica de Michel Foucault. Baseados neste autor, consideramos que para traçar a história das práticas de tortura é preciso traçar a história política das transformações dos métodos punitivos em correlação com uma tecnologia política do corpo. Por esse caminho, entendemos que a emergência da tortura está sempre vinculada às relações de poder/modos de governo (de si e dos outros), que se apresentam de diferentes formas ao longo da história. Para alcançar essas diferenças efetuamos um mapeamento das descontinuidades em torno da prática da tortura no período que vai do século XII ao XXI. O campo de problematização engendrado por esse olhar genealógico facultou pensar a tortura de três modos principais e nem sempre mutuamente exclusivos: a tortura legitimada pelo poder real; a tortura supostamente abolida e efetivamente redistribuída nas sociedades disciplinares; a tortura utilizada como tecnologia biopolítica de governo das condutas - dos regimes ditatoriais aos democráticos -, em que fazer viver e deixar morrer são duas faces de uma mesma moeda.",
      },
    ],
  },
  {
    name: "Aline Ribeiro Nascimento",
    articles: [
      {
        title: "O que é a psicologia para Nietzsche?",
        url: "https://app.uff.br/slab/uploads/2006_d_Aline_Nascimento.pdf",
        note: "Dissertação - Pós Graduação em Psicologia",
        summary:
          "Este trabalho tem como objetivo buscar uma compreensão do que é a psicologia para Nietzsche tendo em vista que, em diversos momentos da sua obra, a palavra psicologia aparece e aponta caminhos que se entrecruzam com uma crítica à filosofia, à moral, à religião e à ciência. Para tanto, o filósofo utiliza, como critério de avaliação, os conceitos de força e fraqueza, saúde e doença e busca, como psicólogo, investigar e diagnosticar a saúde de uma cultura a partir dessa base, pautado na arte de interpretação dos sintomas manifestos na vida. Neste sentido, após caracterizarmos a força do povo helênico através da tragédia grega e seu declínio, com a introdução da metafísica socrática como opositora à vida, buscamos compreender os efeitos desta oposição no modo de ser do homem ocidental. Posteriormente discutimos os desdobramentos da metafísica no plano da moralidade, onde a psicologia surge como reprodutora deste ideal, isto é, presa a temores e preconceitos morais. Seguimos, então, a proposta de uma nova psicologia, pautada em outros valores, mais próximos da vida, em sua forma plena, ou seja, entendida como vontade de potência. Para tanto, o método que nos guia neste percurso é a genealogia, que, ao indagar as condições e circunstâncias nas quais os valores surgem, aponta para a vida como avaliadora, tendo o homem como instrumento de avaliação da mesma. Ao psicólogo cabe avaliar e interpretar a vida estampada na visão do homem, e, portanto, na cultura surgida através dele. Neste novo percurso, busca afirmar o trágico como condição de uma existência saudável, não mais pautada no bem e no mal, mas para além do bem e do mal.",
      },
      {
        title: "Quando a transparência nos assombra",
        url: "https://www.e-publicacoes.uerj.br/mnemosine/article/view/41694/pdf_305",
        summary:
          "O presente artigo tem por objetivo contribuir com discussões contemporâneas sobre os assombros cotidianos ligados, sobretudo, às práticas golpistas em curso no cenário brasileiro, culminando, até o momento, fevereiro de 2018, na criação de um Decreto federal que trata da intervenção militar na segurança pública no RJ e que comporta muitos perigos. Para tanto, servindo-se de conceitos nietzschianos como niilismo, genealogia, meio dia, dentre outros, buscará aproximar esses conceitos do modo de subjetivação em curso e da herança, em nós e na sociedade, de práticas silenciadoras da potência de diferir, bem como percorrerá os movimentos que apontam para a possibilidade de sua reversão.",
      },
      {
        title: "Ferramenta e ferrugem: apontamentos sobre o conceito de representação social",
        url: "https://www.e-publicacoes.uerj.br/index.php/mnemosine/article/view/41530/28799",
        summary:
          "Tomando como ponto de partida formulações de Moscovici acerca da representação social, o presente artigo se propõe a analisar: as condições de emergência desse conceito; sua mobilidade em relação ao conceito de representação coletiva de Durkheim; os instrumentos metodológicos fornecidos pelo autor para a pesquisa em psicologia social; a repercussão no Brasil dos anos 1970 e1980, bem como as implicações ético-políticas do conceito de representação social no campo da psicologia social na atualidade. O convite que se faz ao leitor é o de percorrer a genealogia de nossas práticas para problematizar a função social desse método de pesquisa.",
      },
      {
        title: "Filosofia e experimentação: exercícios espirituais em Nietzsche e Foucault",
        url: "http://www.fermentario.fhuce.edu.uy/index.php/fermentario/article/view/166/217",
      },
      {
        title: "Da invenção da memória às memórias inventadas",
        url: "https://www.e-publicacoes.uerj.br/index.php/mnemosine/article/view/41577/28846",
        summary:
          "O presente ensaio pretende ser um convite para pensarmos em novas possibilidades de construção de narrativas acerca da memória. Os protagonistas desse convite serão Fernando Pessoa e Friedrich Nietzsche. Eles nos conduzirão num passeio no universo das sensações e da potência de variação que podem ser extraídas delas, em suas obras e fora delas, pois têm a capacidade ímpar de nos atingir e desviar nosso olhar do modo tradicional de pensarmos a relação entre história e memória. A flecha que sai de seus escritos se chama diferença. Veremos que esses autores podem trazer valiosas contribuições para pesquisas relacionadas aos modos de construção e de escrita da História, estando, talvez, mais próximos de alguns trabalhos desenvolvidos na história oral.",
      },
      {
        title: "Exame criminológico: uma questão ética para a psicologia e para os psicólogos",
        url: "https://www.e-publicacoes.uerj.br/index.php/mnemosine/article/view/41486/28755",
        note: "BANDEIRA, BADARÓ, Maria Márcia; CAMURI, CLAUDIA; NASCIMENTO, Aline Ribeiro",
        summary:
          "Este artigo foi concebido pelas autoras a partir da suspensão dos efeitos da Resolução n° 09/2010, do Conselho Federal de Psicologia (CFP), que Regulamenta a atuação do psicólogo no sistema prisional. Esta suspensão é um acontecimento que denuncia o jogo de forças presente no campo da execução penal, especialmente, no que tange à prática do psicólogo e à realização ou não do exame criminológico. Portanto, nosso objetivo é discutir as condições e circunstâncias em que o exame criminológico emerge e se estabelece em nosso país e também contar um pouco da história das lutas que os psicólogos vêm travando nesse campo desde a promulgação da Lei de Execução Penal (LEP) n°7.210/1984 que institui o exame criminológico.",
      },
      {
        title: "Os desafios da memória em direção às forças de criação",
        url: "https://www.e-publicacoes.uerj.br/index.php/mnemosine/article/view/41478/28747",
        summary: "Apresentação oral na defesa da tese de doutorado Os desafios da memória em direção as forças de criação, UNIRIO/PPGMS, 2011.",
      },
      {
        title: "De Auschwitz a Tropa de Elite: modulações do estado de exceção?",
        url: "https://www.e-publicacoes.uerj.br/index.php/mnemosine/article/view/41450/28719",
        summary:
          "Este trabalho pretende aproximar o filme La tregua, baseado na obra de Primo Levi, e os efeitos do filme Tropa de Elite no cenário brasileiro, visando problematizar uma curiosa semelhança: a permissão para a violência. Para tanto, buscaremos dialogar com autores como Zygmunt Bauman, Hannah Arendt, Cecília Coimbra e Giorgio Agamben, dentre outros, sendo que, a partir deste último, nos serviremos do conceito de Estado de Exceção e apontaremos suas modulações. Uma delas se materializa na naturalização de assassinatos que não têm penalidade jurídica, fomentada, por sua vez, pela produção da imagem de estado de guerra que lhe serve de base. Se a estrutura da exceção é entendida como um mecanismo jurídico que se organiza na suspensão dos direitos em nome da necessidade da ordem e esta possibilitou o nascimento dos campos de concentração, observamos que ela ressurge, de maneira sutil, na relação entre pobreza = criminalidade = repressão da violência = naturalização de assassinatos.",
      },
      {
        title: "Da cultura platônico-judaico-cristã à cultura capitalística: modulações do niilismo na construção da memória",
        url: "http://www.seer.unirio.br/morpheus/article/view/4814/4304",
        note: "NASCIMENTO, Aline Ribeiro; Peixoto, Maria Ignês",
        summary:
          "Neste artigo será discutida a relação entre niilismo e memória, tendo em vista que, na concepção nietzschiana, o niilismo é um acontecimento que se encontra na base de nossa cultura e a memória, como produção social, se modula junto a ele. Portanto, o niilismo não é um acontecimento recente, mas uma doença que percorre a história do nosso pensamento de tal maneira que se alastra em diversos campos: político, econômico, social, artístico etc. e com isso, atravessa e compõe modos de existência. A aposta que faremos é problematizar as forças que estão em jogo tanto na base de nossa cultura quanto nos seus desdobramentos até atingirmos o chamado apogeu do niilismo e assim, costurarmos uma discussão com o modelo de sociedade atual, chamada por Deleuze e Guatarri, de capitalística. E, ao fazermos este percurso, pretendemos pensar as condições e circunstâncias nas quais a memória social emerge e se modula junto a essas forças.",
      },
    ],
  },
  {
    name: "Flávia Mendes Ferreira",
    articles: [
      {
        title: "Não era depressão, era capitalismo",
        url: "https://dialogosdofimdomundo.blogspot.com/2021/07/nao-era-depressao-era-capitalismo.html",
      },
      {
        title: 'Torto Arado e "a luta que pode ser a vida todos os dias"',
        url: "https://dialogosdofimdomundo.blogspot.com/2021/04/torto-arado-e-luta-que-pode-ser-vida.html",
      },
      {
        title: "Liberal na economia e conservador nos costumes: o casamento entre Paulo Guedes e Damares Alves que são mais parecidos do que imaginamos",
        url: "https://dialogosdofimdomundo.blogspot.com/2020/09/liberal-na-economia-e-conservador-nos.html",
      },
      {
        title: "NEOCONSERVADORISMO, GÊNERO E SOCIOLOGIA NA BASE NACIONAL COMUM CURRICULAR",
        url: "https://editorarealize.com.br/artigo/visualizar/75748",
        summary:
          'NOS ÚLTIMOS ANOS, NÃO APENAS NO BRASIL HOUVE UM CRESCIMENTO SIGNIFICATIVO DO QUE TEM SIDO CHAMADO DE NEOCONSERVADORISMO. UMA AGENDA CONSERVADORA, REACIONÁRIA E AUTORITÁRIA TEM SIDO APRESENTADA E EM DIVERSOS PAÍSES POLÍTICOS COM ESSES DISCURSOS FORAM ELEITOS. UM DOS TEMAS MAIS ATACADOS PELO NEOCONSERVADORISMO DIZ RESPEITO ÀS QUESTÕES DE GÊNERO E SEXUALIDADE, UM EXEMPLO É O FATO DO BRASIL TER RETIRADO OS TERMOS "GÊNERO" E "ORIENTAÇÃO SEXUAL" DO PLANO NACIONAL DE EDUCAÇÃO EM 2014. VALE CONSIDERAR QUE A BASE NACIONAL COMUM CURRICULAR - BNCC- FOI APROVADA EM 2017 E, ESTE TRABALHO É PARTE DE UMA PESQUISA SOBRE GÊNERO NA ESCOLA QUE AQUI ANALISA ALGUMAS MUDANÇAS APROVADAS NA BNCC, SOBRETUDO AQUELAS QUE AFETARAM DIRETAMENTE A DISCIPLINA DE SOCIOLOGIA E A POSSIBILIDADE DE DESENVOLVER COM OS ALUNOS OS CONTEÚDOS DE GÊNERO E SEXUALIDADE. A PESQUISA É DESENVOLVIDA A PARTIR DE UMA BASE TEÓRICO-METODOLÓGICA DAS CIÊNCIAS SOCIAIS E DA ÁREA DE EDUCAÇÃO QUE COMPREENDE QUE ABORDAR QUESTÕES DE GÊNERO E SEXUALIDADE NA ESCOLA É PARTE DA CONSOLIDAÇÃO DE UMA ESCOLA MAIS PLURAL, INCLUSIVA E DEMOCRÁTICA.',
      },
      {
        title: "Controle, disciplinamento e técnicas jurídico-penais em escolas públicas militarizadas",
        url: "https://www.sbs2021.sbsociologia.com.br/atividade/view?q=YToyOntzOjY6InBhcmFtcyI7czozNToiYToxOntzOjEyOiJJRF9BVElWSURBREUiO3M6MjoiMzMiO30iO3M6MToiaCI7czozMjoiYjVlN2E2NWNjMzk4N2ZlNDJmOWVkMDQ0MGFjMmEzYTYiO30%3D&ID_ATIVIDADE=33_",
      },
    ],
  },
  {
    name: "Carlos Contente",
    website: "https://www.carloscontente.com.br/arquivoscontente",
    articles: [
      {
        title: "Sobre a Estética da Comicidade",
        url: "https://www.e-publicacoes.uerj.br/index.php/concinnitas/article/view/39896/27961",
      },
      {
        title: "A artista na tensão entre a terra e o asfalto",
        url: "https://www.pressenza.com/pt-pt/2020/08/a-artista-na-tensao-entre-a-terra-e-o-asfalto-conversa-com-regina-de-paula/",
        note: "Conversa com Regina de Paula",
      },
      {
        title: "Um livro de inatividades contra os jogos políticos autoritários",
        url: "https://www.pressenza.com/pt-pt/2020/05/um-livro-de-inatividades-contra-os-jogos-politicos-autoritarios/",
      },
      {
        title: "A revolta como enigma",
        url: "https://www.pressenza.com/pt-pt/2020/06/a-revolta-como-enigma-conversa-com-camila-jourdan/",
        note: "Conversa com Camila Jourdan",
      },
      {
        title: '"A arte nunca foi tão necessária"',
        url: "https://www.pressenza.com/pt-pt/2020/05/a-arte-nunca-foi-tao-necessaria/",
        note: "Conversa com Thiago Fernandes, historiador da arte e designer gráfico",
      },
      {
        title: "Mastro ereto e um olhar de fome: retratos quase pornográficos de Paulo Jorge Gonçalves",
        url: "https://www.pressenza.com/pt-pt/2020/09/mastro-ereto-e-um-olhar-de-fome-retratos-quase-pornograficos-de-paulo-jorge-goncalves/",
      },
      {
        title: "Agrade Camiz, (a)grade entre o corpo e a cidade",
        url: "https://www.pressenza.com/pt-pt/2020/11/agrade-camiz-agrade-entre-o-corpo-e-a-cidade/",
        note: "Entrevista com a artista visual Camila Cristina",
      },
      {
        title: "Uma conversa com aquele pessoal dos direitos humanos: Glaucia Marinho",
        url: "https://www.pressenza.com/pt-pt/2020/07/uma-conversa-com-aquele-pessoal-dos-direitos-humanos-glaucia-marinho/",
      },
      {
        title: 'Dica de leitura: "Militarização e censura - a luta por liberdade de expressão na favela da Maré"',
        url: "https://www.pressenza.com/pt-pt/2021/01/dica-de-leitura-militarizacao-e-censura-a-luta-por-liberdade-de-expressao-na-favela-da-mare/",
      },
      {
        title: "Educação para a autonomia na Mangueira",
        url: "https://www.pressenza.com/pt-pt/2020/06/educacao-para-a-autonomia-na-mangueira-conversa-com-kassio-motta/",
        note: "Conversa com Kassio Motta",
      },
    ],
  },
];

function authorSlug(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function articleFromContent(content) {
  const legacyAuthors = Array.isArray(content.metadata?.authors)
    ? content.metadata.authors.filter(Boolean).join(", ")
    : content.metadata?.authors;
  return {
    title: content.title,
    url: contentFileUrls(content)[0] || content.externalUrl || content.fileUrl || "#",
    note: content.metadata?.note || legacyAuthors || content.createdBy?.name,
    summary: content.description,
  };
}

function mergeDynamicAuthors(dynamicContents) {
  const grouped = new Map(authors.map((author) => [author.name, { ...author, articles: [...author.articles] }]));

  dynamicContents.forEach((content) => {
    const article = articleFromContent(content);
    const relatedAuthors = Array.isArray(content.metadata?.articleAuthors)
      ? content.metadata.articleAuthors
      : [];
    const legacyNames = Array.isArray(content.metadata?.authors)
      ? content.metadata.authors.filter(Boolean)
      : [content.metadata?.authorName || content.metadata?.authors || content.researcherName || "Equipe LACE"];
    const articleAuthors = relatedAuthors.length > 0
      ? relatedAuthors.map((authorContent) => ({
        name: authorContent.title,
        bio: authorContent.description,
        image: contentImage(authorContent),
        website: authorContent.externalUrl || authorContent.metadata?.website,
      }))
      : legacyNames.map((name) => ({ name }));

    articleAuthors.forEach((authorData) => {
      const current = grouped.get(authorData.name) || { name: authorData.name, articles: [] };
      const author = {
        ...current,
        bio: authorData.bio || current.bio,
        image: authorData.image || current.image,
        website: authorData.website || current.website,
        articles: [...current.articles],
      };
      if (!author.articles.some((item) => item.title === article.title)) author.articles.push(article);
      grouped.set(author.name, author);
    });
  });

  return [...grouped.values()];
}

export default function Artigos() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dynamicContents, setDynamicContents] = useState([]);
  const allAuthors = useMemo(() => mergeDynamicAuthors(dynamicContents), [dynamicContents]);
  const activeAuthor = useMemo(() => {
    const hash = location.hash.replace("#", "");
    return hash ? allAuthors.find((item) => authorSlug(item.name) === hash) || null : null;
  }, [allAuthors, location.hash]);

  useEffect(() => {
    let active = true;
    api
      .get("/contents", { params: { type: "ARTICLE" } })
      .then(({ data }) => {
        if (active) setDynamicContents(data.contents || []);
      })
      .catch(() => {
        if (active) setDynamicContents([]);
      });
    return () => {
      active = false;
    };
  }, []);

  function setAuthorAndHash(author) {
    navigate(`${location.pathname}${location.search}#${authorSlug(author.name)}`, { replace: true });
  }

  useEffect(() => {
    if (!activeAuthor) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        navigate(`${location.pathname}${location.search}`, { replace: true });
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeAuthor, location.pathname, location.search, navigate]);

  function openAuthor(author) {
    setAuthorAndHash(author);
  }

  function closeAuthor() {
    navigate(`${location.pathname}${location.search}`, { replace: true });
  }

  function navigateAuthor(direction) {
    if (!activeAuthor) return;

    const currentIndex = allAuthors.findIndex((author) => author.name === activeAuthor.name);
    const nextIndex =
      direction === "previous"
        ? (currentIndex - 1 + allAuthors.length) % allAuthors.length
        : (currentIndex + 1) % allAuthors.length;

    setAuthorAndHash(allAuthors[nextIndex]);
  }

  return (
    <main className="bg-background py-20 lg:py-28">
      <Container>
        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Produção acadêmica</p>
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">Artigos</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Nessa aba você pode conferir as publicações e artigos do nosso núcleo de pesquisa:
          </p>
        </header>

        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Autoras e autores">
          {allAuthors.map((author) => (
            <button
              key={author.name}
              className="group inline-flex min-h-20 w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 text-left font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              type="button"
              onClick={() => openAuthor(author)}
            >
              <span>{author.name}</span>
              <FileText size={20} className="shrink-0 text-primary transition group-hover:text-on-primary" aria-hidden="true" />
            </button>
          ))}
        </section>
      </Container>

      {activeAuthor && (
        <AuthorModal
          author={activeAuthor}
          authorPosition={allAuthors.findIndex((item) => item.name === activeAuthor.name) + 1}
          authorCount={allAuthors.length}
          onClose={closeAuthor}
          onNavigate={navigateAuthor}
        />
      )}
    </main>
  );
}

function AuthorModal({ author, authorPosition, authorCount, onClose, onNavigate }) {
  useEffect(() => {
    const navigateByKeyboard = (event) => {
      const tagName = event.target?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") return;

      if (event.key === "ArrowLeft") {
        onNavigate("previous");
      }

      if (event.key === "ArrowRight") {
        onNavigate("next");
      }
    };

    window.addEventListener("keydown", navigateByKeyboard);

    return () => window.removeEventListener("keydown", navigateByKeyboard);
  }, [onNavigate]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="author-articles-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/20 bg-background p-6 shadow-2xl md:p-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          aria-label="Fechar artigos"
        >
          <X size={24} aria-hidden="true" />
        </button>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Artigos</p>
        <h2 id="author-articles-title" className="mt-3 pr-12 font-title text-4xl md:text-5xl">
          {author.name}
        </h2>
        {author.image && <img className="mt-6 max-h-80 w-full rounded-2xl border border-border object-cover" src={author.image} alt={author.name} loading="lazy" />}
        {author.bio && <p className="mt-5 max-w-3xl whitespace-pre-line leading-8 text-muted">{author.bio}</p>}
        {author.website && (
          <a
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
            href={author.website}
            target="_blank"
            rel="noreferrer"
          >
            Site do autor <ExternalLink size={16} aria-hidden="true" />
          </a>
        )}

        {author.articles.length > 0 ? (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onNavigate("previous")}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Autora ou autor anterior"
              >
                <ChevronLeft size={18} aria-hidden="true" />
                Anterior
              </button>
              <span className="text-sm font-semibold text-muted">
                {authorPosition} de {authorCount}
              </span>
              <button
                type="button"
                onClick={() => onNavigate("next")}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Próxima autora ou próximo autor"
              >
                Próximo
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-5">
              {author.articles.map((article) => (
                <article key={article.title} className="rounded-2xl border border-border bg-card p-5 md:p-6">
                  <h3 className="font-title text-3xl text-text">{article.title}</h3>
                  {article.note && <p className="mt-3 text-sm font-semibold text-primary">{article.note}</p>}
                  {article.summary && <p className="mt-4 leading-7 text-muted">{article.summary}</p>}
                  <a
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Link para PDF <ExternalLink size={16} aria-hidden="true" />
                  </a>
                  <SocialShare title={article.title} url={article.url} className="mt-6" />
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/60 p-6">
            <p className="leading-7 text-muted">Os artigos desta autoria serão adicionados em breve.</p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
