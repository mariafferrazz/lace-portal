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
    titleFontSize: "1.8rem",
  },
  {
    date: "15/10/2025",
    title: "Tupinambá — O Retorno da Terra",
    direction: "Daniela Alarcon",
    titleFontSize: "1.95rem",
  },
  {
    date: "22/10/2025",
    title: "A Real História de José Porfírio de Souza, em Trombas-GO",
    titleFontSize: "1.65rem",
  },
  {
    date: "29/10/2025",
    title: "Nau Insensata",
    direction: "Cristiano Sidoti",
    titleFontSize: "2.2rem",
  },
  {
    date: "05/11/2025",
    title: "Arqueologia no DOI-Codi: Rompendo o Silêncio",
    titleFontSize: "1.8rem",
  },
  {
    date: "12/11/2025",
    title: "Ditadura nas Universidades Brasileiras",
    note: "Sessão com dois curtas",
    titleFontSize: "1.9rem",
  },
  {
    date: "19/11/2025",
    title: "Asalto",
    direction: "Carlos Álvarez",
    titleFontSize: "2.2rem",
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
      .catch(() => setFilms(getStaticContents("FILM")));
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
            <span className="mt-3 block text-muted">Registros das transmissões realizadas entre setembro e novembro de 2025.</span>
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
          <div className="mt-8 grid gap-6 md:grid-cols-2" style={{ gridAutoRows: "196px" }}>
            {sessions.map((session) => {
              const playlistVideo = playlistVideos.find((video) => video.id === session.videoId);
              const film = findFilmByTitle(films, session.filmTitle || session.title);

              return (
                <article
                  key={`${session.date}-${session.title}`}
                  className="grid h-full min-h-0 w-full gap-6 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary"
                  style={{ gridTemplateColumns: "190px minmax(0, 1fr)" }}
                >
                  <time
                    className="flex h-full shrink-0 items-center justify-center rounded-2xl border border-primary/60 bg-primary/15 px-4 text-center text-white"
                    dateTime={session.date.split("/").reverse().join("-")}
                    style={{ width: "190px" }}
                  >
                    <span className="whitespace-nowrap font-title leading-none" style={{ fontSize: "2.35rem", letterSpacing: "-0.03em" }}>
                      {session.date}
                    </span>
                  </time>

                  <div className="flex min-h-0 min-w-0 flex-col justify-between overflow-hidden py-1">
                    <div>
                      <h3
                        className="max-w-[18rem] font-title"
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
                      {film?.metadata?.youtubeId && (
                        <button
                          type="button"
                          className="group inline-flex w-fit cursor-pointer items-center gap-2 text-base font-semibold text-primary"
                          onClick={() => setSelectedFilm(film)}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-8"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-8"
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
                <p className="mt-3 text-muted">Playlist · 2 vídeos · por LACE</p>
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
                        <img className="aspect-video w-full rounded-xl object-cover" src={video.thumbnail} alt="" />
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-8"
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
