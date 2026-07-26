export const menu = [
  { title: "Início", path: "/" },
  {
    title: "Cinema e Ditadura",
    children: [
      { title: "Filmes", path: "/cinema-e-ditadura/filmes" },
      { title: "Verbetes", path: "/cinema-e-ditadura/verbetes" },
      { title: "VII Mostra Cinema e Ditadura", path: "/cinema-e-ditadura/vii-mostra" },
      { title: "VI Mostra Cinema e Ditadura", path: "/cinema-e-ditadura/vi-mostra" },
      { title: "V Mostra Cinema e Ditadura", path: "/cinema-e-ditadura/v-mostra" },
      { title: "IV Mostra Cinema e Ditadura", path: "/cinema-e-ditadura/iv-mostra" },
      { title: "III Mostra Cinema e Ditadura", path: "/cinema-e-ditadura/iii-mostra" },
    ],
  },
  {
    title: "Produção Audiovisual",
    children: [
      { title: "Entrevistas", path: "/producao-audiovisual/entrevistas" },
      { title: "Podcasts", path: "/producao-audiovisual/podcasts" },
    ],
  },
  {
    title: "Produção Acadêmica",
    children: [
      { title: "Linhas de Fugas Virais", path: "/producao-academica/linhas-de-fugas-virais" },
      {
        title: "Artigos",
        path: "/producao-academica/artigos",
        children: [
          { title: "Joana D'Arc Fernandes Ferraz", path: "/producao-academica/artigos#joana-d-arc-fernandes-ferraz" },
          { title: "Cecília Maria Bouças Coimbra", path: "/producao-academica/artigos#cecilia-maria-boucas-coimbra" },
          { title: "Ana Cláudia Camuri", path: "/producao-academica/artigos#ana-claudia-camuri" },
          { title: "Flávia Mendes Ferreira", path: "/producao-academica/artigos#flavia-mendes-ferreira" },
          { title: "Carlos Contente", path: "/producao-academica/artigos#carlos-contente" },
          { title: "Aline Ribeiro Nascimento", path: "/producao-academica/artigos#aline-ribeiro-nascimento" },
        ],
      },
      {
        title: "Pesquisas",
        path: "/producao-academica/pesquisas",
        children: [
          { title: "Aracruz Celulose S/A", path: "/producao-academica/pesquisas#aracruz-celulose" },
          { title: "Ditadura na UFF", path: "/producao-academica/pesquisas#ditadura-na-uff" },
        ],
      },
    ],
  },
  {
    title: "Eventos e Atividades",
    children: [
      { title: "Eventos 2025", path: "/eventos/2025" },
      { title: "Eventos 2024", path: "/eventos/2024" },
      { title: "Eventos 2023", path: "/eventos/2023" },
      { title: "Eventos 2022", path: "/eventos/2022" },
      { title: "Eventos 2021", path: "/eventos/2021" },
    ],
  },
];
