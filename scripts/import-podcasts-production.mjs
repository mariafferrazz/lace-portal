const API_BASE = process.env.API_BASE || "https://api.lablace.com.br/api";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Configure ADMIN_EMAIL e ADMIN_PASSWORD para importar podcasts.");
}

const podcasts = [
  {
    title: "No Convés da Repressão e Resistência",
    description:
      "Este podcast, composto de sete episódios, narrará a luta e a resistência dos operários navais do estado do Rio de Janeiro, durante a ditadura empresarial-militar brasileira, a partir de seus depoimentos, de suas memórias e de suas ações políticas. Lembrar o passado é um modo de impedir sua repetição. Este trabalho está sendo produzido pelas e pelos pesquisadoras e pesquisadores do Laboratório de Agenciamentos Cotidianos e Experiências (LACE) da Universidade Federal Fluminense (UFF). Agradecemos o incentivo da UFF, da CAPES e do CNPq no fomento ao projeto de pesquisa: \"A participação das empresas de construção naval do Rio de Janeiro e de Niterói no golpe empresarial-militar brasileiro (1964-1985)\".",
    coverUrl:
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000100-2671326716/450/NoConv%C3%A9s-3.webp?ph=3554c7d1fd",
    externalUrl:
      "https://open.spotify.com/episode/6MV8TsiWC1Wf1LpxDEUXz1?go=1&sp_cid=40578d9a667f37b17594a6d5222085b3&nd=1&dlsi=7cbf828ef0aa48ba",
    episodes: [
      {
        number: 1,
        title: "Os operários navais: lutas e resistências no pré-golpe de 1964",
        description:
          "Neste episódio, você conhecerá um pouco da situação da indústria naval brasileira, dos sindicatos com suas lutas políticas e, também, da história e do cotidiano de alguns operários navais no período antecedente ao golpe empresarial-militar de 1964.",
        url:
          "https://open.spotify.com/episode/6MV8TsiWC1Wf1LpxDEUXz1?go=1&sp_cid=40578d9a667f37b17594a6d5222085b3&nd=1&dlsi=7cbf828ef0aa48ba",
      },
      {
        number: 2,
        title:
          "A conspiração: cumplicidades entre os militares, o governo dos EUA e os empresários ligados ao capital internacional",
        description:
          "Neste episódio falaremos sobre uma mobilização silenciosa, ocorrida por meio de um jogo muito bem arquitetado no campo político, militar, empresarial e midiático que levou ao golpe empresarial-militar de 1964. Essa articulação está diretamente vinculada ao alinhamento do país ao modelo capitalista de produção, por meio de uma conspiração envolvendo o governo dos EUA, os militares e o empresariado nacional e internacional, aparelhados dentro do complexo IPES/IBAD.",
        url:
          "https://open.spotify.com/episode/7H9HEQDNmYTikVxerD1HsI?go=1&sp_cid=40578d9a667f37b17594a6d5222085b3&nd=1&dlsi=75b2bf0443524797",
      },
      {
        number: 3,
        title:
          "As relações entre o PCB e o sindicato dos operários navais do Rio de Janeiro nas décadas de 1950 e 1960",
        description:
          "Neste episódio, falaremos sobre o sindicato dos operários navais antes do golpe empresarial-militar brasileiro de 1964. Como os operários se organizavam dentro do Sindicato e como foi a participação do Partido Comunista nas lutas da Categoria.",
        url:
          "https://open.spotify.com/episode/2Ql5ZZpNY8vGFxjLP4Kve1?go=1&sp_cid=40578d9a667f37b17594a6d5222085b3&nd=1&dlsi=938b9693297e4b6d",
      },
      {
        number: 4,
        title:
          "O golpe empresarial-militar brasileiro e as violências vividas pelos operários navais do Rio de Janeiro",
        description:
          "Neste episódio, falaremos sobre as diferentes formas de violências vividas pelos operários navais do Rio de Janeiro no período da ditadura empresarial militar brasileira. Você saberá como os operários navais vivenciaram o golpe de 1964. As inúmeras violências que sofreram e como resistiram ao terror imposto pelo Estado ditatorial.",
        url:
          "https://open.spotify.com/episode/6WrVhXy9az02uNZugAlGfK?go=1&sp_cid=40578d9a667f37b17594a6d5222085b3&nd=1&dlsi=3ce6422d9fab4281",
      },
      {
        number: 5,
        title:
          "Locais de prisão dos operários navais durante a ditadura empresarial-militar e os relatos das torturas",
        description:
          "Neste episódio, vamos relatar um pouco sobre o que aconteceu com os operários navais logo depois do golpe empresarial-militar de 1964, como suas prisões e torturas que sofreram. Falaremos também sobre os diversos lugares em que foram aprisionados, sequestrados e confinados na cidade de Niterói e do Rio de Janeiro.",
        url:
          "https://open.spotify.com/episode/4mw51kXMWcIkl9oIFbgSyc?go=1&sp_cid=40578d9a667f37b17594a6d5222085b3&nd=1&dlsi=3f4b5f6caebf4d4b",
      },
      {
        number: 6,
        title:
          "O fim da ditadura empresarial-militar brasileira de 1964 e a luta dos operários navais durante esse período",
        description:
          "Nesse episódio, falaremos sobre o fim da ditadura empresarial-militar brasileira de 1964, a Lei de Anistia e a luta dos operários navais durante esse período.",
        url:
          "https://open.spotify.com/episode/2qaKSJVozkEb0m054AIiAD?go=1&sp_cid=40578d9a667f37b17594a6d5222085b3&nd=1&dlsi=d1717f43c33f4851",
      },
      {
        number: 7,
        title:
          "Legado da luta: em memória aos operários perseguidos pelo regime ditatorial e as lições dos sobreviventes",
        description:
          "Neste episódio, o último da série do podcast, falaremos sobre o legado das lutas e das resistências dos operários navais atingidos pela ditadura empresarial-militar brasileira.",
        url:
          "https://open.spotify.com/episode/6xJE9lwqHIf4UpvM0EWo4R?go=1&sp_cid=40578d9a667f37b17594a6d5222085b3&nd=1&dlsi=1cc780ce40ff42d2",
      },
    ],
    episodeReferences: {
      1: {
        bibliographic: [
          "BANDEIRA, Moniz. Presença dos Estados Unidos no Brasil: (dois séculos de história). Civilização Brasileira, 1973.",
          "BRASIL. Relatório Final da Comissão Nacional da Verdade (Volumes I, II e III). Brasília: CNV, 2014.",
          "CAMPOS, Pedro H. P. Transversos: Revista de História. Rio de Janeiro, n. 08, dez. 2016. Tese de doutorado apresentada ao Programa de Pós-Graduação de História Social-PPGHS. Instituto de Ciências Humanas e Filosofia Departamento de História da Universidade Federal Fluminense - UFF. 2012. Niterói.",
          "DREIFUSS, Renè. A Conquista do Estado. Terceira Edição. Petrópolis: Vozes, 1981.",
          "PESSANHA, E. e MOREL, R. \"Gerações operárias: rupturas e continuidades na experiência de metalúrgicos do Rio de Janeiro\". Revista Brasileira de Ciências Sociais, Rio de Janeiro: Anpocs/Relume Dumará, 1991.",
          "PESSANHA, Elina Gonçalves da Fonte. Operários navais: trabalho, sindicalismo e política na indústria naval do Rio de Janeiro. Rio de Janeiro: Editora 7Letras, 2013.",
          "PESSANHA, Elina Gonçalves da Fonte. Os operários navais do Rio de Janeiro sob a ditadura do pós1964: repressão e resistência. Revista Mundos do Trabalho, vol. 6, n. 11, 2014, p. 11-23.",
          "RELATÓRIO/Comissão da Verdade do Rio. Rio de Janeiro: CEV-Rio, 2015.",
          "RELATÓRIO/Comissão Municipal da Verdade de Niterói, 2015.",
          "SILVA, Célia Pereira da. O Sindicato dos Operários Navais e o PCB no Contexto Pré-Golpe de 1964: Faces da Mesma Moeda. Rio de Janeiro, 2016.",
          "SILVA, Célia Pereira da. Os Operários Navais e suas Memórias Indeléveis: Sindicalismo e Comunismo no Contexto do Golpe de 1964; 2015; Monografia; Universidade Federal Fluminense.",
        ],
        sites: [
          {
            title: "BOMENY, Helena. Instituto João Goulart. 2010.",
            url: "https://historico.institutojoaogoulart.org.br/noticia.php?id=1365",
          },
          {
            title: "John F. Kennedy Presidential Library and Museum - Meetings: Tape 114/A50.",
            url: "https://www.jfklibrary.org/asset-viewer/archives/JFKPOF/MTG/JFKPOF-MTG-114-A50c/JFKPOF-MTG-114-A50c",
          },
          {
            title: "LAMARÃO, Sérgio. A conjuntura de radicalização ideológica e o golpe militar - Comício das Reformas. CPDOC.",
            url: "https://web.archive.org/web/20220121194300/https://cpdoc.fgv.br/producao/dossies/Jango/artigos/AConjunturaRadicalizacao/Comicio_das_reformas",
          },
        ],
        films: ["TAVARES, Camilo (Diretor). O dia que durou 21 anos. Brasil. Pequi Filmes. 2013."],
        interviews: [
          "Jayme Navas da Costa",
          "José Carlos Teodoro de Almeida",
          "Ivan Duarte",
          "Manuel Francisco Spindola",
          "Benedito Joaquim dos Santos",
          "Oswaldo Garcia Veloso",
        ],
        newspapers: [
          "Tribuna da Imprensa, 14/03/1964.",
          "Jornal Última Hora, 17/03/1964.",
          "Jornal Correio da Manhã. Rio de Janeiro, 1960-1964.",
          "Jornal O Fluminense. Niterói, 1960-1964.",
          "Jornal O Semanário. Rio de Janeiro, 1956-1963.",
          "Jornal Última Hora. Rio de Janeiro, 1960-1964.",
        ],
        documents: [
          "Manifesto dos Coronéis, 1952.",
          "Carta de demissão de João Goulart.",
        ],
      },
      2: {
        bibliographic: [
          "BANDEIRA, Moniz. O governo João Goulart: as lutas sociais no Brasil 1961-1964. Ed. Civilização Brasileira. 4 edição. 1978. Rio de Janeiro.",
          "CAMPOS, Pedro H. P. Transversos: Revista de História. Rio de Janeiro, n. 08, dez. 2016. Tese de doutorado apresentada ao Programa de Pós-Graduação de História Social-PPGHS. Instituto de Ciências Humanas e Filosofia Departamento de História da Universidade Federal Fluminense - UFF. 2012. Niterói.",
          "DREIFUSS, Renè. A Conquista do Estado. Terceira Edição. Petrópolis: Vozes, 1981.",
          "FERRAZ, Joana D'Arc. O DIA QUE DUROU 21 ANOS: AS SIMBIOSES ENTRE O PASSADO E O PRESENTE PELAS LENTES DO CINEMA. Transversos: Revista de História. Rio de Janeiro, n. 08, dez. 2016.",
          "IANNI, Octavio. A Ditadura do Grande Capital. São Paulo. Expressão Popular, 2019. 356p.",
          "MELO, Demian Bezerra. O Comício da Central: o Rio e as reformas de Jango. Cadernos de História, Belo Horizonte, v. 15, n. 22, 1º sem. 2014.",
          "PEREIRA, Tulio Augusto de Paiva. As tramas, as conspirações, os golpes e os acontecimentos que prenunciaram 1964 no Brasil: o governo João Goulart. Revista Científica Multidisciplinar Núcleo do Conhecimento. Ano 06, Ed. 02, Vol. 03, pp. 112-152. Fevereiro de 2021.",
          "SILVA, Célia Pereira da. O Sindicato dos Operários Navais e o PCB no Contexto Pré-Golpe de 1964: Faces da Mesma Moeda. Rio de Janeiro, 2016.",
          "SILVA, Célia Pereira da. Os Operários Navais e suas Memórias Indeléveis: Sindicalismo e Comunismo no Contexto do Golpe de 1964; 2015; Monografia; Universidade Federal Fluminense.",
        ],
        sites: [
          {
            title: "WESTIN, Ricardo. Há 60 anos, Congresso aceitou renúncia e abortou golpe de Jânio Quadros. Agência Senado. 2021.",
            url: "https://www12.senado.leg.br/noticias/especiais/arquivo-s/ha-60-anos-congresso-aceitou-renuncia-e-abortou-golpe-de-janio-quadros",
          },
          {
            title: "Testemunhos no RJ contam história da repressão ao Sindicato dos Operários Navais. CNV Memórias Reveladas. 2013.",
            url: "https://cnv.memoriasreveladas.gov.br/outros-destaques/346-testemunhos-contam-historia-da-repressao-ao-sindicato-dos-operarios-navais-de-niteroi-e-sao-goncalo.html",
          },
          {
            title: "LAMARÃO, Sérgio. Instituto Brasileiro de Ação Democrática (IBAD). CPDOC.",
            url: "https://www.fgv.br/cpdoc/acervo/dicionarios/verbete-tematico/instituto-brasileiro-de-acao-democratica-ibad",
          },
          {
            title: "Resultado geral do referendo de 1963. Seção de Arquivo do Tribunal Superior Eleitoral.",
            url: "https://www.justicaeleitoral.jus.br/arquivos/referendo-de-1963/rybena_pdf?file=https://www.justicaeleitoral.jus.br/arquivos/referendo-de-1963/at_download/file",
          },
        ],
        films: ["TAVARES, Camilo (Diretor). O dia que durou 21 anos. Brasil. Pequi Filmes. 2013."],
        interviews: [
          "Jayme Navas da Costa",
          "José Carlos Teodoro de Almeida",
          "Ivan Duarte",
          "Manuel Francisco Spindola",
          "Benedito Joaquim dos Santos",
          "Oswaldo Garcia Veloso",
        ],
      },
      3: {
        bibliographic: [
          "CAMPOS, Lucas Pacheco. A prática de silenciar lembrando: uma análise da administração política da memória na Comissão Nacional da Verdade. Dissertação de Mestrado. Programa de Pós-Graduação em Administração, 2016.",
          "GOMES, Angela Castro (org.). A Época dos Operários Navais. Niterói: Produção do Departamento de História, Laboratório de História Oral e Iconografia da UFF, 1999.",
          "MATTOS, Marcelo Badaró. Trabalhadores e sindicatos na conjuntura do pré-64: a experiência carioca. Lutas Sociais, nº 5, 1998, pp. 25-33.",
          "MATTOS, Marcelo Badaró. Greves, sindicatos e repressão policial no Rio de Janeiro (1954-1964). Revista Brasileira de História. São Paulo, v. 24, nº 47, p. 241-270, 2004.",
          "MONTALVÃO, Sérgio de Sousa; FERRAZ, Joana D'Arc Fernandes. Uma greve em dois tempos: o movimento nacional dos marítimos de 1953 no Rio de Janeiro e os impasses da historiografia política. Izquierdas, 49, agosto 2020: 1230-1242.",
          "PESSANHA, Elina. Operários Navais - Trabalho, Sindicalismo e Política na Indústria Naval do Rio de Janeiro. Rio de Janeiro: 7 Letras, 2012.",
          "PESSANHA, Elina. Os Operários Navais do Rio de Janeiro sob a Ditadura do pós-1964: repressão e resistência. Revista Mundos do Trabalho, vol. 6, nº 11, p. 11-23, jan./jun., 2014.",
          "PESSANHA, Elina e MOREL, Regina. Gerações operárias: rupturas e continuidades na experiência de metalúrgicos no Rio de Janeiro. Revista Brasileira de Ciências Sociais (RBCS). v. 6, n. 17, Rio de Janeiro, outubro, 1991.",
          "RELATÓRIO/Comissão da Verdade do Rio. Rio de Janeiro: CEV-Rio, 2015.",
          "RELATÓRIO/Comissão Municipal da Verdade de Niterói, 2015.",
          "SILVA, Célia Pereira da. O Sindicato dos Operários Navais e o PCB no Contexto Pré-Golpe de 1964: Faces da Mesma Moeda. Rio de Janeiro, 2016.",
          "SILVA, Célia Pereira da. Os Operários Navais e suas Memórias Indeléveis: Sindicalismo e Comunismo no Contexto do Golpe de 1964; 2015; Monografia; Universidade Federal Fluminense.",
        ],
        sites: [
          {
            title: "Breve Histórico do PCB. Portal PCB.",
            url: "https://pcb.org.br/portal/docs/historia.html",
          },
          {
            title: "Cuba não está só. StB no Brasil. 2016.",
            url: "https://stbnobrasil.com/pt/cuba-nao-esta-so",
          },
          {
            title: "Congresso de Solidariedade a Cuba. Museu da Pessoa.",
            url: "https://acervo.museudapessoa.org/pt/conteudo/imagem/congresso-de-solidariedade-a-cuba-4482",
          },
        ],
        interviews: [
          "Jayme Navas da Costa",
          "José Carlos Teodoro de Almeida",
          "Ivan Duarte",
          "Manuel Francisco Spindola",
          "Benedito Joaquim dos Santos",
          "Oswaldo Garcia Veloso",
          "Ricardo Costa",
        ],
        archives: [
          "Arquivo de História Oral do Laboratório de História Oral e Imagem do Departamento de História da Universidade Federal Fluminense (LABHOI-UFF).",
        ],
      },
      4: {
        bibliographic: [
          "CAMPOS, Lucas Pacheco. A prática de silenciar lembrando: uma análise da administração política da memória na Comissão Nacional da Verdade. Dissertação de Mestrado. Programa de Pós-Graduação em Administração, 2016.",
          "GOMES, Angela Castro (org.). A Época dos Operários Navais. Niterói: Produção do Departamento de História, Laboratório de História Oral e Iconografia da UFF, 1999.",
          "MATTOS, Marcelo Badaró. Trabalhadores e sindicatos na conjuntura do pré-64: a experiência carioca. Lutas Sociais, nº 5, 1998, pp. 25-33.",
          "MATTOS, Marcelo Badaró. Greves, sindicatos e repressão policial no Rio de Janeiro (1954-1964). Revista Brasileira de História. São Paulo, v. 24, nº 47, p. 241-270, 2004.",
          "MONTALVÃO, Sérgio de Sousa; FERRAZ, Joana D'Arc Fernandes. Uma greve em dois tempos: o movimento nacional dos marítimos de 1953 no Rio de Janeiro e os impasses da historiografia política. Izquierdas, 49, agosto 2020: 1230-1242.",
          "PESSANHA, Elina. Operários Navais - Trabalho, Sindicalismo e Política na Indústria Naval do Rio de Janeiro. Rio de Janeiro: 7 Letras, 2012.",
          "PESSANHA, Elina. Os Operários Navais do Rio de Janeiro sob a Ditadura do pós-1964: repressão e resistência. Revista Mundos do Trabalho, vol. 6, nº 11, p. 11-23, jan./jun., 2014.",
          "PESSANHA, Elina e MOREL, Regina. Gerações operárias: rupturas e continuidades na experiência de metalúrgicos no Rio de Janeiro. Revista Brasileira de Ciências Sociais (RBCS). v. 6, n. 17, Rio de Janeiro, outubro, 1991.",
          "RELATÓRIO/Comissão da Verdade do Rio. Rio de Janeiro: CEV-Rio, 2015.",
          "RELATÓRIO/Comissão Municipal da Verdade de Niterói, 2015.",
          "SILVA, Célia Pereira da. O Sindicato dos Operários Navais e o PCB no Contexto Pré-Golpe de 1964: Faces da Mesma Moeda. Rio de Janeiro, 2016.",
          "SILVA, Célia Pereira da. Os Operários Navais e suas Memórias Indeléveis: Sindicalismo e Comunismo no Contexto do Golpe de 1964; 2015; Monografia; Universidade Federal Fluminense.",
        ],
        interviews: [
          "Jayme Navas da Costa",
          "José Carlos Teodoro de Almeida",
          "Ivan Duarte",
          "Manuel Francisco Spindola",
          "Benedito Joaquim dos Santos",
          "Oswaldo Garcia Veloso",
        ],
      },
      5: {
        bibliographic: [
          "CAMPOS, Lucas Pacheco. A prática de silenciar lembrando: uma análise da administração política da memória na Comissão Nacional da Verdade. Dissertação de Mestrado. Programa de Pós-Graduação em Administração, 2016.",
          "GOMES, Angela Castro (org.). A Época dos Operários Navais. Niterói: Produção do Departamento de História, Laboratório de História Oral e Iconografia da UFF, 1999.",
          "MONTALVÃO, Sérgio de Sousa. O tempo de antes, um tempo de reivindicações e conquistas (1953-1964): memória e identidade dos operários navais do Rio de Janeiro. Análise Social, n. 238, p. 162-183, 2021.",
          "PESSANHA, Elina. Operários Navais - Trabalho, Sindicalismo e Política na Indústria Naval do Rio de Janeiro. Rio de Janeiro: 7 Letras, 2012.",
          "PESSANHA, Elina. Os Operários Navais do Rio de Janeiro sob a Ditadura do pós-1964: repressão e resistência. Revista Mundos do Trabalho, vol. 6, nº 11, p. 11-23, jan./jun., 2014.",
          "PESSANHA, Elina e MOREL, Regina. Gerações operárias: rupturas e continuidades na experiência de metalúrgicos no Rio de Janeiro. Revista Brasileira de Ciências Sociais (RBCS). v. 6, n. 17, Rio de Janeiro, outubro, 1991.",
          "RELATÓRIO/Comissão da Verdade do Rio. Rio de Janeiro: CEV-Rio, 2015.",
          "RELATÓRIO/Comissão Municipal da Verdade de Niterói, 2015.",
          "SILVA, Célia Pereira da. O Sindicato dos Operários Navais e o PCB no Contexto Pré-Golpe de 1964: Faces da Mesma Moeda. Rio de Janeiro, 2016.",
          "SILVA, Célia Pereira da. Os Operários Navais e suas Memórias Indeléveis: Sindicalismo e Comunismo no Contexto do Golpe de 1964; 2015; Monografia; Universidade Federal Fluminense.",
        ],
        sites: [
          {
            title:
              "LOPES, Ari; SOARES, Sérgio; AGUIAR, Gustavo. 1964, o ano em que a bola não rolou no Caio Martins. O São Gonçalo. 30 de julho de 2015.",
            url: "https://www.osaogoncalo.com.br/esportes/7697/1964-o-ano-em-que-a-bola-nao-rolou-no-caio-martins",
          },
          {
            title:
              "GONTIJO, Gabriel. Caio Martins 80 anos. Um estádio como presídio no coração de Icaraí. A Tribuna. 20 de julho de 2021.",
            url: "https://www.atribunarj.com.br/caio-martins-80-anos-um-estadio-como-presidio-no-coracao-de-icarai/",
          },
          {
            title:
              "ANTHUNES, Thiago. Estádio Caio Martins teve 38 presos na ditadura militar: Estudo da Comissão da Verdade também aponta envolvimento de empresas. O Dia. 19 de dezembro de 2013.",
            url: "https://odia.ig.com.br/noticia/rio-de-janeiro/2013-12-19/estadio-caio-martins-teve-38-presos-na-ditadura-militar.html",
          },
          {
            title:
              "Onze advogados contaram sobre as dificuldades para atuar em defesa de presos políticos durante o regime militar. CNV Memórias Reveladas.",
            url: "https://cnv.memoriasreveladas.gov.br/m/outros-destaques/151-campo-de-concentracao-tortura-mutilacao-e-solidariedade-nos-depoimentos-de-advogados-a-comissao-da-verdade.html",
          },
        ],
        interviews: [
          "Jayme Navas da Costa",
          "José Carlos Teodoro de Almeida",
          "Ivan Duarte",
          "Manuel Francisco Spindola",
          "Benedito Joaquim dos Santos",
          "Oswaldo Garcia Veloso",
          "Vera Regina Assis da Costa",
        ],
      },
      6: {
        bibliographic: [
          "BRASIL. Lei nº 6.683, de 28 de agosto de 1979.",
          "BRASIL. Lei nº 9.140, de 04 de dezembro de 1995.",
          "BRASIL. Lei nº 11.111, de 5 de maio de 2005.",
          "BRASIL. Lei nº 12.527, de 18 de novembro de 2011.",
          "BRASIL. Lei nº 12.528, de 18 de novembro de 2011.",
          "BRASIL. Terceiro Programa Nacional de Direitos Humanos (III-PNDH). Secretaria Especial dos Direitos Humanos da Presidência da República. Programa instaurado a partir do decreto nº 7.037, de dezembro de 2009 e atualizado pelo decreto nº 7.177, de maio de 2010.",
          "BRASIL. Relatório Final da Comissão Nacional da Verdade (Volumes I, II e III). Brasília: CNV, 2014.",
          "CAMPOS, Lucas Pacheco. A prática de silenciar lembrando: uma análise da administração política da memória na Comissão Nacional da Verdade. Dissertação de Mestrado. Programa de Pós-Graduação em Administração, 2016.",
          "FERRAZ, Joana D.'Arc Fernandes. A Pandorga e a Lei: passado-presente-futuro. Maracanan, n. 18, p. 134-156, 2018.",
          "GOMES, Angela Castro (org.). A Época dos Operários Navais. Niterói: Produção do Departamento de História, Laboratório de História Oral e Iconografia da UFF, 1999.",
          "MONTALVÃO, Sérgio de Sousa. O tempo de antes, um tempo de reivindicações e conquistas (1953-1964): memória e identidade dos operários navais do Rio de Janeiro. Análise Social, n. 238, p. 162-183, 2021.",
          "PESSANHA, Elina. Operários Navais - Trabalho, Sindicalismo e Política na Indústria Naval do Rio de Janeiro. Rio de Janeiro: 7 Letras, 2012.",
          "PESSANHA, Elina. Os Operários Navais do Rio de Janeiro sob a Ditadura do pós-1964: repressão e resistência. Revista Mundos do Trabalho, vol. 6, nº 11, p. 11-23, jan./jun., 2014.",
          "PESSANHA, Elina e MOREL, Regina. Gerações operárias: rupturas e continuidades na experiência de metalúrgicos no Rio de Janeiro. Revista Brasileira de Ciências Sociais (RBCS). v. 6, n. 17, Rio de Janeiro, outubro, 1991.",
          "Programa Nacional de Direitos Humanos (PNDH-3) / Secretaria de Direitos Humanos da Presidência da República. Brasília: SDH/PR, 2010.",
          "RELATÓRIO/Comissão da Verdade do Rio. Rio de Janeiro: CEV-Rio, 2015.",
          "RELATÓRIO/Comissão Municipal da Verdade de Niterói, 2015.",
          "SILVA, Célia Pereira da. O Sindicato dos Operários Navais e o PCB no Contexto Pré-Golpe de 1964: Faces da Mesma Moeda. Rio de Janeiro, 2016.",
          "SILVA, Célia Pereira da. Os Operários Navais e suas Memórias Indeléveis: Sindicalismo e Comunismo no Contexto do Golpe de 1964; 2015; Monografia; Universidade Federal Fluminense.",
        ],
        sites: [
          {
            title: "Lei nº 6.683, de 28 de agosto de 1979.",
            url: "https://www.planalto.gov.br/ccivil_03/leis/L6683.htm",
          },
          {
            title: "Lei nº 9.140, de 04 de dezembro de 1995.",
            url: "https://www.planalto.gov.br/ccivil_03/LEIS/L9140.htm",
          },
          {
            title: "Lei nº 11.111, de 5 de maio de 2005.",
            url: "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2005/lei/l11111.htm",
          },
          {
            title: "Lei nº 12.527, de 18 de novembro de 2011.",
            url: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm",
          },
          {
            title: "Lei nº 12.528, de 18 de novembro de 2011.",
            url: "https://www.planalto.gov.br/ccivil_03/_Ato2011-2014/2011/Lei/L12528.htm",
          },
          {
            title: "Relatórios da Comissão Nacional da Verdade.",
            url: "http://cnv.memoriasreveladas.gov.br/index.php",
          },
          {
            title:
              "Testemunhos da repressão ao Sindicato dos Operários Navais (RJ). Comissão Nacional da Verdade. YouTube, 24 de fevereiro de 2015.",
            url: "https://youtube.com/playlist?list=PL9n0M0Ixl2jemE-nOoo40iLGMFcse9v7h",
          },
        ],
        interviews: [
          "Jayme Navas da Costa",
          "José Carlos Teodoro de Almeida",
          "Ivan Duarte",
          "Manuel Francisco Spindola",
          "Benedito Joaquim dos Santos",
          "Oswaldo Garcia Veloso",
          "Vera Regina Assis da Costa",
        ],
      },
      7: {
        bibliographic: [
          "BRASIL. Relatório Final da Comissão Nacional da Verdade (Volumes I, II e III). Brasília: CNV, 2014.",
          "CAMPOS, Lucas Pacheco. A prática de silenciar lembrando: uma análise da administração política da memória na Comissão Nacional da Verdade. Dissertação de Mestrado. Programa de Pós-Graduação em Administração, 2016.",
          "ROUSSEFF, Dilma. Discurso da Presidente Dilma Rousseff em 10 de dezembro de 2014. Ocasião da cerimônia de entrega do relatório final da CNV.",
          "GOMES, Angela Castro (org.). A Época dos Operários Navais. Niterói: Produção do Departamento de História, Laboratório de História Oral e Iconografia da UFF, 1999.",
          "MONTALVÃO, Sérgio de Sousa. O tempo de antes, um tempo de reivindicações e conquistas (1953-1964): memória e identidade dos operários navais do Rio de Janeiro. Análise Social, n. 238, p. 162-183, 2021.",
          "PESSANHA, Elina. Operários Navais - Trabalho, Sindicalismo e Política na Indústria Naval do Rio de Janeiro. Rio de Janeiro: 7 Letras, 2012.",
          "PESSANHA, Elina. Os Operários Navais do Rio de Janeiro sob a Ditadura do pós-1964: repressão e resistência. Revista Mundos do Trabalho, vol. 6, nº 11, p. 11-23, jan./jun., 2014.",
          "PESSANHA, Elina e MOREL, Regina. Gerações operárias: rupturas e continuidades na experiência de metalúrgicos no Rio de Janeiro. Revista Brasileira de Ciências Sociais (RBCS). v. 6, n. 17, Rio de Janeiro, outubro, 1991.",
          "Programa Nacional de Direitos Humanos (PNDH-3) / Secretaria de Direitos Humanos da Presidência da República. Brasília: SDH/PR, 2010.",
          "RELATÓRIO/Comissão da Verdade do Rio. Rio de Janeiro: CEV-Rio, 2015.",
          "RELATÓRIO/Comissão Municipal da Verdade de Niterói, 2015.",
          "SILVA, Célia Pereira da. O Sindicato dos Operários Navais e o PCB no Contexto Pré-Golpe de 1964: Faces da Mesma Moeda. Rio de Janeiro, 2016.",
          "SILVA, Célia Pereira da. Os Operários Navais e suas Memórias Indeléveis: Sindicalismo e Comunismo no Contexto do Golpe de 1964; 2015; Monografia; Universidade Federal Fluminense.",
          "TELES, Edson e SAFATLE, Vladimir (org.). O que resta da ditadura. São Paulo: Boitempo, 2010.",
        ],
        sites: [
          {
            title: "Discurso da Presidente Dilma Rousseff durante entrega do relatório final da Comissão Nacional da Verdade.",
            url: "https://www2.planalto.gov.br/acompanhe-o-planalto/discursos/discursos-dapresidenta/discurso-da-presidenta-da-republica-dilma-rousseff-durante-entrega-dorelatorio-final-da-comissao-nacional-da-verdade-brasilia-df",
          },
          {
            title: "Acervo Jornal GTNM/RJ. Grupo Tortura Nunca Mais, Rio de Janeiro.",
            url: "http://www.torturanuncamais-rj.org.br/noticias/acervo-jornal-gtnmrj/",
          },
          {
            title: "Relatórios da Comissão Nacional da Verdade.",
            url: "http://cnv.memoriasreveladas.gov.br/index.php",
          },
          {
            title:
              "Testemunhos da repressão ao Sindicato dos Operários Navais (RJ). Comissão Nacional da Verdade. YouTube, 24 de fevereiro de 2015.",
            url: "https://youtube.com/playlist?list=PL9n0M0Ixl2jemE-nOoo40iLGMFcse9v7h",
          },
        ],
        interviews: [
          "Jayme Navas da Costa",
          "José Carlos Teodoro de Almeida",
          "Ivan Duarte",
          "Manuel Francisco Spindola",
          "Benedito Joaquim dos Santos",
          "Oswaldo Garcia Veloso",
          "Vera Regina Assis da Costa",
        ],
      },
    },
    episodeImages: {
      1: [
        {
          title: "Documento 1",
          url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000085-5cae85caeb/unnamed%20%282%29.jpg?ph=3554c7d1fd",
        },
        {
          title: "Documento 2",
          url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000087-d3dc4d3dc7/unnamed%20%281%29.jpg?ph=3554c7d1fd",
        },
        {
          title: "Manifesto dos Coronéis",
          url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000089-2de742de76/Manifesto%20Coron%C3%A9is.jfif?ph=3554c7d1fd",
        },
        {
          title: "Carta de demissão de João Goulart",
          url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000096-173f7173fa/demissaojango.jfif?ph=3554c7d1fd",
        },
      ],
      2: [
        {
          title: "Arquivo de imagem 1",
          url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000090-84fba84fbd/ep2.jpg?ph=3554c7d1fd",
        },
        {
          title: "Arquivo de imagem 2",
          url: "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000094-a6996a6998/ep22-2.png?ph=3554c7d1fd",
        },
      ],
    },
    references: {
      bibliographic: [
        "BANDEIRA, Moniz. Presença dos Estados Unidos no Brasil: (dois séculos de história). Civilização Brasileira, 1973.",
        "BRASIL. Relatório Final da Comissão Nacional da Verdade (Volumes I, II e III). Brasília: CNV, 2014.",
        "CAMPOS, Pedro H. P. Transversos: Revista de História. Rio de Janeiro, n. 08, dez. 2016. Tese de doutorado apresentada ao Programa de Pós-Graduação de História Social-PPGHS. Instituto de Ciências Humanas e Filosofia Departamento de História da Universidade Federal Fluminense - UFF. 2012. Niterói.",
        "DREIFUSS, Renè. A Conquista do Estado. Terceira Edição. Petrópolis: Vozes, 1981.",
        "PESSANHA, E. e MOREL, R. \"Gerações operárias: rupturas e continuidades na experiência de metalúrgicos do Rio de Janeiro\". Revista Brasileira de Ciências Sociais, Rio de Janeiro: Anpocs/Relume Dumará, 1991.",
        "PESSANHA, Elina Gonçalves da Fonte. Operários navais: trabalho, sindicalismo e política na indústria naval do Rio de Janeiro. Rio de Janeiro: Editora 7Letras, 2013.",
        "PESSANHA, Elina Gonçalves da Fonte. Os operários navais do Rio de Janeiro sob a ditadura do pós1964: repressão e resistência. Revista Mundos do Trabalho, vol. 6, n. 11, 2014, p. 11-23.",
        "RELATÓRIO/Comissão da Verdade do Rio. Rio de Janeiro: CEV-Rio, 2015.",
        "RELATÓRIO/Comissão Municipal da Verdade de Niterói, 2015.",
        "SILVA, Célia Pereira da. O Sindicato dos Operários Navais e o PCB no Contexto Pré-Golpe de 1964: Faces da Mesma Moeda. Rio de Janeiro, 2016.",
        "SILVA, Célia Pereira da. Os Operários Navais e suas Memórias Indeléveis: Sindicalismo e Comunismo no Contexto do Golpe de 1964; 2015; Monografia; Universidade Federal Fluminense.",
      ],
      sites: [
        {
          title: "BOMENY, Helena. Instituto João Goulart. 2010.",
          url: "https://historico.institutojoaogoulart.org.br/noticia.php?id=1365",
        },
        {
          title: "John F. Kennedy Presidential Library and Museum - Meetings: Tape 114/A50.",
          url: "https://www.jfklibrary.org/asset-viewer/archives/JFKPOF/MTG/JFKPOF-MTG-114-A50c/JFKPOF-MTG-114-A50c",
        },
        {
          title: "LAMARÃO, Sérgio. A conjuntura de radicalização ideológica e o golpe militar - Comício das Reformas. CPDOC.",
          url: "https://web.archive.org/web/20220121194300/https://cpdoc.fgv.br/producao/dossies/Jango/artigos/AConjunturaRadicalizacao/Comicio_das_reformas",
        },
      ],
      films: ["TAVARES, Camilo (Diretor). O dia que durou 21 anos. Brasil. Pequi Filmes. 2013."],
      interviews: [
        "Jayme Navas da Costa",
        "José Carlos Teodoro de Almeida",
        "Ivan Duarte",
        "Manuel Francisco Spindola",
        "Benedito Joaquim dos Santos",
        "Oswaldo Garcia Veloso",
      ],
      newspapers: [
        "Tribuna da Imprensa, 14/03/1964.",
        "Jornal Última Hora, 17/03/1964.",
        "Jornal Correio da Manhã. Rio de Janeiro, 1960-1964.",
        "Jornal O Fluminense. Niterói, 1960-1964.",
        "Jornal O Semanário. Rio de Janeiro, 1956-1963.",
        "Jornal Última Hora. Rio de Janeiro, 1960-1964.",
      ],
      documents: [
        "Manifesto dos Coronéis, 1952.",
        "Carta de demissão de João Goulart.",
      ],
    },
    images: [
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000085-5cae85caeb/unnamed%20%282%29.jpg?ph=3554c7d1fd",
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000087-d3dc4d3dc7/unnamed%20%281%29.jpg?ph=3554c7d1fd",
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000089-2de742de76/Manifesto%20Coron%C3%A9is.jfif?ph=3554c7d1fd",
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000096-173f7173fa/demissaojango.jfif?ph=3554c7d1fd",
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000090-84fba84fbd/ep2.jpg?ph=3554c7d1fd",
      "https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000094-a6996a6998/ep22-2.png?ph=3554c7d1fd",
    ],
  },
];

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json; charset=utf-8",
      cookie: request.cookie || "",
      ...(options.headers || {}),
    },
  });

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) request.cookie = setCookie.split(";")[0];

  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} falhou: ${response.status} ${await response.text()}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

await request("/auth/login", {
  method: "POST",
  body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
});

const managed = await request("/contents/manage");

for (const podcast of podcasts) {
  const body = {
    title: podcast.title,
    description: podcast.description,
    type: "PODCAST",
    researcherName: "Equipe LACE",
    externalUrl: podcast.externalUrl,
    fileUrl: podcast.coverUrl,
    metadata: {
      thumbnail: podcast.coverUrl,
      platform: "Spotify",
      episodes: podcast.episodes,
      references: podcast.references,
      episodeReferences: podcast.episodeReferences,
      episodeImages: podcast.episodeImages,
      images: podcast.images,
    },
  };

  const existing = managed.contents.find((content) => (
    content.type === "PODCAST" &&
    (content.title === podcast.title || content.externalUrl === podcast.externalUrl)
  ));

  if (existing) {
    await request(`/contents/${existing.id}`, { method: "PATCH", body: JSON.stringify(body) });
    await request(`/contents/${existing.id}`, { method: "PATCH", body: JSON.stringify({ published: true }) });
  } else {
    const created = await request("/contents", { method: "POST", body: JSON.stringify(body) });
    await request(`/contents/${created.content.id}`, { method: "PATCH", body: JSON.stringify({ published: true }) });
  }
}

const publicContents = await request("/contents?type=PODCAST");
console.log(`${publicContents.contents.length} podcasts publicados.`);
