import { useEffect, useState } from "react";
import { CalendarDays, ExternalLink, PlayCircle, X } from "lucide-react";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import { getStaticContents } from "../../data/staticContent";

const sessions = [
  {
    date: "20/09/2025",
    title: "Vou Contar para os Meus Filhos",
    direction: "Tuca Siqueira",
    filmTitle: "Vou Contar para os Meus Filhos",
    videoId: "Ux2glsbWynM",
    titleFontSize: "2rem",
  },
  {
    date: "26/09/2025",
    title: "Visões do Paraíso",
    direction: "Cristiana Miranda",
    videoId: "LTnNaWM4R3Y",
    titleFontSize: "2.1rem",
  },
  {
    date: "08/10/2025",
    title: "O Dia em que Dorival Encarou a Guarda",
    direction: "Jorge Furtado e José Pedro Goulart",
    filmTitle: "O Dia em que Dorival Encarou a Guarda",
    filmYoutubeId: "I418PGZIONQ",
    titleFontSize: "1.8rem",
  },
  {
    date: "21/10/2025",
    title: "Zé",
    direction: "Rafael Conde",
    note: "Debate com Dulce Pandolfi e Ricardo Máximo.",
    filmTitle: "Zé",
    filmYoutubeId: "8L5g64U-sc8",
    videoId: "DAFR5oG3vPk",
    titleFontSize: "2.35rem",
  },
  {
    date: "21/10/2025",
    title: "Acervo Dops - Os papéis da repressão",
    direction: "Núcleo de audiovisual da UFF e Arquivo Público do Estado do Rio de Janeiro",
    note: "Debate com Felipe Nin, Fernanda Pradal e Daniel Elian.",
    filmTitle: "Acervo Dops - Os papéis da repressão",
    filmYoutubeId: "5BXLPRnrQJE",
    videoId: "BP90zueiAsI",
    titleFontSize: "1.7rem",
  },
  {
    date: "22/10/2025",
    title: "Caio Martins e o apagamento da memória",
    direction: "Lucas Cavalcante",
    note: "Debate com Kenia Maia e Gabriel Souza.",
    filmTitle: "Caio Martins e o apagamento da memória",
    filmYoutubeId: "c-oxcKCqVws",
    videoId: "tJSgBMCBnWo",
    titleFontSize: "1.8rem",
  },
  {
    date: "09/12/2025",
    title: "Qual é a memória da ditadura militar?",
    note: "Debate com Helen Ortiz, Guilherme Oliveira, Gabriel Rivas, Stella Moreira e Maria Antônia.",
    filmTitle: "Qual é a memória da ditadura militar?",
    filmYoutubeId: "0pXwARWKHlk",
    videoId: "WsI9D1cTV64",
    titleFontSize: "1.75rem",
  },
  {
    date: "09/12/2025",
    title: "Arquivos da ditadura: luta e resistência em Perus",
    direction: "Memorial da Resistência de SP",
    note: "Debate com Liza Santos, Gabriel Rivas, Rayane Miranda, Carlos Santos e Rafaela Reis.",
    videoId: "_VmVV19X6EM",
    titleFontSize: "1.9rem",
  },
  {
    date: "10/12/2025",
    title: "Atuação da FEDEFAM como espaço de resistência e de memória na ditadura Argentina",
    note: "Debate com María Adela Antokoletz (Madre de la Plaza de Mayo).",
    filmTitle: "Atuação da FEDEFAM como espaço de resistência e de memória na ditadura Argentina",
    filmYoutubeId: "O2jwZVeaPkM",
    videoId: "xInohttBwsY",
    titleFontSize: "1.55rem",
  },
];

const playlistUrl = "https://www.youtube.com/playlist?list=PLgImeU9gw9824wqqt4x-Rhq7xl6ODZQtM";

const playlistVideos = [
  {
    id: "Ux2glsbWynM",
    title: "VII Mostra Cinema e Ditadura - Vou Contar Para os Meus Filhos (Tuca Siqueira)",
    shortTitle: "Vou Contar para os Meus Filhos",
    thumbnail: "https://i2.ytimg.com/vi/Ux2glsbWynM/hqdefault.jpg",
    meta: "121 visualizações · Transmitido há 9 meses",
    date: "20/09/2025",
  },
  {
    id: "LTnNaWM4R3Y",
    title: "VII Mostra Cinema e Ditadura - Visões do Paraíso (Cristiana Miranda)",
    shortTitle: "Visões do Paraíso",
    thumbnail: "https://i1.ytimg.com/vi/LTnNaWM4R3Y/hqdefault.jpg",
    meta: "114 visualizações · Transmitido há 9 meses",
    date: "26/09/2025",
  },
  {
    id: "DAFR5oG3vPk",
    title: "VII Mostra Cinema e Ditadura - Zé",
    shortTitle: "Zé",
    thumbnail: "https://i.ytimg.com/vi/DAFR5oG3vPk/hqdefault.jpg",
    meta: "Sessão gravada · Debate com Dulce Pandolfi e Ricardo Máximo",
    date: "21/10/2025",
  },
  {
    id: "BP90zueiAsI",
    title: "VII Mostra Cinema e Ditadura - Acervo Dops - Os papéis da repressão",
    shortTitle: "Acervo Dops - Os papéis da repressão",
    thumbnail: "https://i.ytimg.com/vi/BP90zueiAsI/hqdefault.jpg",
    meta: "Sessão gravada · Debate com Felipe Nin, Fernanda Pradal e Daniel Elian",
    date: "21/10/2025",
  },
  {
    id: "tJSgBMCBnWo",
    title: "VII Mostra Cinema e Ditadura - Caio Martins e o apagamento da memória",
    shortTitle: "Caio Martins e o apagamento da memória",
    thumbnail: "https://i.ytimg.com/vi/tJSgBMCBnWo/hqdefault.jpg",
    meta: "Sessão gravada · Debate com Kenia Maia e Gabriel Souza",
    date: "22/10/2025",
  },
  {
    id: "WsI9D1cTV64",
    title: "VII Mostra Cinema e Ditadura - Qual é a memória da ditadura militar?",
    shortTitle: "Qual é a memória da ditadura militar?",
    thumbnail: "https://i.ytimg.com/vi/WsI9D1cTV64/hqdefault.jpg",
    meta: "Sessão gravada · Debate com Helen Ortiz, Guilherme Oliveira, Gabriel Rivas, Stella Moreira e Maria Antônia",
    date: "09/12/2025",
  },
  {
    id: "_VmVV19X6EM",
    title: "VII Mostra Cinema e Ditadura - Arquivos da ditadura: luta e resistência em Perus",
    shortTitle: "Arquivos da ditadura: luta e resistência em Perus",
    thumbnail: "https://i.ytimg.com/vi/_VmVV19X6EM/hqdefault.jpg",
    meta: "Sessão gravada · Debate com Liza Santos, Gabriel Rivas, Rayane Miranda, Carlos Santos e Rafaela Reis",
    date: "09/12/2025",
  },
  {
    id: "xInohttBwsY",
    title: "VII Mostra Cinema e Ditadura - Atuação da FEDEFAM como espaço de resistência e de memória na ditadura Argentina",
    shortTitle: "Atuação da FEDEFAM como espaço de resistência e de memória na ditadura Argentina",
    thumbnail: "https://i.ytimg.com/vi/xInohttBwsY/hqdefault.jpg",
    meta: "Sessão gravada · Debate com María Adela Antokoletz",
    date: "10/12/2025",
  },
];

const normalizeTitle = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\(\d{4}\)/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const findFilmByTitle = (films, title) => {
  const normalizedTitle = normalizeTitle(title);
  return films.find((film) => {
    const normalizedFilmTitle = normalizeTitle(film.title);
    return (
      normalizedFilmTitle === normalizedTitle ||
      normalizedFilmTitle.includes(normalizedTitle) ||
      normalizedTitle.includes(normalizedFilmTitle)
    );
  });
};

export default function MostraVII() {
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [activePlaylistVideo, setActivePlaylistVideo] = useState(playlistVideos[0]);
  const [activeSessionVideo, setActiveSessionVideo] = useState(null);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [films, setFilms] = useState([]);
  const isAnyModalOpen = isPlaylistOpen || Boolean(activeSessionVideo) || Boolean(selectedFilm);

  useEffect(() => {
    api
      .get("/contents", { params: { type: "FILM" } })
      .then(({ data }) => setFilms(data.contents || []))
      .catch(async () => setFilms(await getStaticContents("FILM")));
  }, []);

  useEffect(() => {
    if (!isAnyModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsPlaylistOpen(false);
        setActiveSessionVideo(null);
        setSelectedFilm(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAnyModalOpen]);

  return (
    <main className="bg-background py-20 lg:py-28">
      <Container>
        <header className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Cinema e Ditadura · 2025</p>
            <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">VII Mostra Cinema e Ditadura</h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              A VII Mostra Cinema e Ditadura integra as atividades do Laboratório de Agenciamentos Cotidianos e
              Experiências (LACE), que reúne dois grupos de pesquisa certificados no CNPq.
            </p>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <img
              className="max-h-[650px] w-full object-contain"
              src="https://3554c7d1fd.cbaul-cdnwnd.com/22850089b1df8dc406ce77d80e531242/200000169-804c1804c2/13ad51a8-369d-446e-9987-d0ae30dd2fe7.webp?ph=3554c7d1fd"
              alt="Cartaz da VII Mostra Cinema e Ditadura"
            />
          </figure>
        </header>

        <button
          type="button"
          onClick={() => {
            setActivePlaylistVideo(playlistVideos[0]);
            setIsPlaylistOpen(true);
          }}
          className="group mt-16 flex w-full cursor-pointer flex-col rounded-3xl border border-primary/40 bg-primary/10 p-7 text-left transition hover:-translate-y-1 hover:border-primary hover:bg-primary/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 md:flex-row md:items-center md:justify-between md:gap-8 md:p-10"
          aria-label="Abrir playlist completa da VII Mostra"
        >
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.25em] text-primary">Transmissões gravadas</span>
            <span className="mt-3 block font-title text-4xl">Playlist completa da VII Mostra</span>
            <span className="mt-3 block text-muted">Registros das transmissões realizadas entre setembro e dezembro de 2025.</span>
          </span>
          <Button as="span" variant="outline" className="mt-6 inline-flex shrink-0 items-center gap-2 md:mt-0">
            <PlayCircle size={18} aria-hidden="true" /> Abrir playlist
          </Button>
        </button>

        <section className="mt-16">
          <div className="flex items-center gap-3 text-primary">
            <CalendarDays aria-hidden="true" />
            <h2 className="font-title text-4xl text-text md:text-5xl">Calendário 2025</h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {sessions.map((session) => {
              const playlistVideo = playlistVideos.find((video) => video.id === session.videoId);
              const film = findFilmByTitle(films, session.filmTitle || session.title);
              const fallbackFilm = session.filmYoutubeId
                ? {
                    title: session.filmTitle || session.title,
                    description: session.note || "",
                    metadata: {
                      youtubeId: session.filmYoutubeId,
                      imageUrl: `https://img.youtube.com/vi/${session.filmYoutubeId}/hqdefault.jpg`,
                      director: session.direction || null,
                    },
                  }
                : null;
              const filmToWatch = film?.metadata?.youtubeId ? film : fallbackFilm;

              return (
                <article
                  key={`${session.date}-${session.title}`}
                  className="grid w-full gap-5 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[190px_minmax(0,1fr)]"
                >
                  <time
                    className="flex min-h-20 w-full shrink-0 items-center justify-center rounded-2xl border border-primary/60 bg-primary/15 px-4 text-center text-primary sm:min-h-full"
                    dateTime={session.date.split("/").reverse().join("-")}
                  >
                    <span className="whitespace-nowrap font-title font-semibold leading-none" style={{ fontSize: "2.35rem", letterSpacing: "-0.03em" }}>
                      {session.date}
                    </span>
                  </time>

                  <div className="flex min-w-0 flex-col justify-between py-1">
                    <div>
                      <h3
                        className="font-title"
                        style={{ fontSize: session.titleFontSize, lineHeight: 1.08 }}
                      >
                        {session.title}
                      </h3>
                      {(session.direction || film?.metadata?.director) && (
                        <p className="mt-3 text-sm text-muted">Direção: {session.direction || film.metadata.director}</p>
                      )}
                      {session.note && <p className="mt-3 text-sm text-muted">{session.note}</p>}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      {filmToWatch?.metadata?.youtubeId && (
                        <button
                          type="button"
                          className="group inline-flex w-fit cursor-pointer items-center gap-2 text-base font-semibold text-primary"
                          onClick={() => setSelectedFilm(filmToWatch)}
                        >
                          <span className="animated-underline">Assistir ao filme</span>
                          <PlayCircle size={18} aria-hidden="true" />
                        </button>
                      )}
                      {playlistVideo && (
                        <button
                          type="button"
                          className="group inline-flex w-fit cursor-pointer items-center gap-2 text-base font-semibold text-primary"
                          onClick={() => setActiveSessionVideo(playlistVideo)}
                        >
                          <span className="animated-underline">Assistir à sessão</span>
                          <PlayCircle size={18} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </Container>

      {activeSessionVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveSessionVideo(null);
            }
          }}
        >
          <div className="relative w-full max-w-5xl rounded-3xl border border-white/20 bg-background p-5 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setActiveSessionVideo(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              aria-label="Fechar vídeo"
            >
              <X size={24} aria-hidden="true" />
            </button>

            <div className="aspect-video overflow-hidden rounded-2xl bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${activeSessionVideo.id}?wmode=opaque`}
                title={activeSessionVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-primary">{activeSessionVideo.date}</p>
            <h2 id="session-modal-title" className="mt-3 pr-12 font-title text-4xl md:text-5xl">
              {activeSessionVideo.shortTitle}
            </h2>
            <p className="mt-3 text-muted">{activeSessionVideo.meta}</p>
            <a
              className="mt-6 inline-flex cursor-pointer items-center gap-2 font-semibold text-primary"
              href={`https://www.youtube.com/watch?v=${activeSessionVideo.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="animated-underline">Abrir no YouTube</span>
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}

      {isPlaylistOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="playlist-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsPlaylistOpen(false);
            }
          }}
        >
          <div className="relative max-h-[94vh] w-full max-w-7xl overflow-y-auto rounded-3xl border border-white/20 bg-background p-5 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setIsPlaylistOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              aria-label="Fechar playlist"
            >
              <X size={24} aria-hidden="true" />
            </button>

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <section className="rounded-3xl border border-border bg-card p-5">
                <div className="aspect-video overflow-hidden rounded-2xl bg-black">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${activePlaylistVideo.id}?wmode=opaque`}
                    title={activePlaylistVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Transmissões gravadas</p>
                <h2 id="playlist-modal-title" className="mt-3 font-title text-4xl md:text-5xl">
                  VII Mostra Cinema e Ditadura
                </h2>
                <p className="mt-3 text-muted">Playlist · {playlistVideos.length} vídeos · por LACE</p>
                <a
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-primary-fill hover:text-on-primary"
                  href={playlistUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <PlayCircle size={18} aria-hidden="true" /> Reproduzir tudo
                </a>
              </section>

              <section className="pt-2">
                <h3 className="font-title text-3xl text-text md:text-4xl">Vídeos da playlist</h3>
                <div className="mt-6 grid gap-5">
                  {playlistVideos.map((video) => {
                    const active = activePlaylistVideo.id === video.id;
                    return (
                      <button
                        key={video.id}
                        type="button"
                        onClick={() => setActivePlaylistVideo(video)}
                        className={`grid cursor-pointer grid-cols-[160px_1fr] gap-4 rounded-2xl p-3 text-left transition hover:bg-card ${active ? "bg-card ring-1 ring-primary/60" : ""}`}
                      >
                        <img className="aspect-video w-full rounded-xl object-cover" src={video.thumbnail} alt="" loading="lazy" decoding="async" />
                        <span className="min-w-0">
                          <span className="block font-semibold leading-6 text-text">{video.title}</span>
                          <span className="mt-2 block text-sm text-muted">LACE</span>
                          <span className="mt-1 block text-sm text-muted">{video.meta}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {selectedFilm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="film-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedFilm(null);
            }
          }}
        >
          <div className="relative flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-background shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedFilm(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              aria-label="Fechar filme"
            >
              <X size={24} aria-hidden="true" />
            </button>

            <div className="aspect-video w-full bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${selectedFilm.metadata?.youtubeId}?wmode=opaque&autoplay=1`}
                title={selectedFilm.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Filme do acervo</p>
              <h2 id="film-modal-title" className="mt-3 font-title text-4xl md:text-5xl">
                {selectedFilm.title}
              </h2>
              {selectedFilm.metadata?.director && <p className="mt-3 text-muted">Direção: {selectedFilm.metadata.director}</p>}
              {selectedFilm.description && (
                <p className="mt-6 max-h-48 overflow-y-auto whitespace-pre-line leading-8 text-muted">{selectedFilm.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
