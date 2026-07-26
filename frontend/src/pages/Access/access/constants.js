export const contentTypes = [
  ["FILM", "Filme"],
  ["GLOSSARY", "Verbete"],
  ["INTERVIEW", "Entrevista"],
  ["PODCAST", "Podcast"],
  ["VIRAL_ESCAPE_LINES", "Linhas de Fugas Virais"],
  ["ARTICLE", "Artigo"],
  ["ARTICLE_AUTHOR", "Autor de artigo"],
  ["RESEARCH", "Pesquisa"],
  ["CINEMA_SHOW", "Mostra Cinema e Ditadura"],
  ["EVENT", "Outro evento"],
];

export const contentAreas = [
  { value: "CINEMA_DITADURA", label: "Cinema e Ditadura", types: ["FILM", "GLOSSARY"] },
  { value: "PRODUCAO_AUDIOVISUAL", label: "Producao Audiovisual", types: ["INTERVIEW", "PODCAST"] },
  {
    value: "PRODUCAO_ACADEMICA",
    label: "Producao Academica",
    types: ["VIRAL_ESCAPE_LINES", "ARTICLE", "ARTICLE_AUTHOR", "RESEARCH"],
  },
  { value: "EVENTOS_ATIVIDADES", label: "Eventos e Atividades", types: ["CINEMA_SHOW", "EVENT"] },
];

export const cinemaShowAreas = ["CINEMA_DITADURA", "EVENTOS_ATIVIDADES"];
export const eventYearOptions = Array.from({ length: 20 }, (_, index) => String(2021 + index));
export const alphabetOptions = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));

export const emptyEpisode = { title: "", description: "", url: "" };
export const emptyPerson = { name: "", role: "", description: "", lattesUrl: "" };
export const emptyCredit = { title: "", value: "", description: "", url: "" };
export const emptyInfo = { title: "", description: "" };
export const emptyResource = { title: "", kind: "DOCUMENT", url: "" };
export const emptyReference = { value: "" };
export const emptySession = {
  date: "",
  filmId: "",
  title: "",
  direction: "",
  sessionUrl: "",
  sessionUrls: [""],
};

export const initialForm = {
  title: "",
  researcherName: "",
  researcherMemberId: "",
  area: "CINEMA_DITADURA",
  type: "FILM",
  description: "",
  bodyText: "",
  imageUrl: "",
  imageUrls: [""],
  fileUrl: "",
  fileUrls: [""],
  videoUrl: "",
  podcastUrl: "",
  pdfUrl: "",
  alphabetLetter: "A",
  direction: "",
  authorNames: [""],
  articleAuthorIds: [],
  relatedFilmIds: [],
  references: [""],
  episodes: [{ ...emptyEpisode }],
  people: [{ ...emptyPerson }],
  credits: [{ ...emptyCredit }],
  researchTeam: [{ ...emptyPerson }],
  additionalInfo: [{ ...emptyInfo }],
  resources: [{ ...emptyResource }],
  showNumber: "",
  eventYear: "2026",
  createCinemaPage: true,
  playlistUrl: "",
  playlistUrls: [""],
  sessions: [{ ...emptySession }],
};

export const fieldClass = "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";
export const compactFieldClass = "w-full rounded-xl border border-border bg-background px-3 py-2 text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";
export const sectionClass = "md:col-span-2 rounded-2xl border border-primary/30 bg-primary/5 p-5";
export const maxEmbeddedImageSize = 2 * 1024 * 1024;
