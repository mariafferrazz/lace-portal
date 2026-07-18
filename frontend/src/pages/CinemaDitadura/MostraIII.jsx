import { useEffect, useState } from "react";
import { CalendarDays, ExternalLink, PlayCircle, X } from "lucide-react";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import api from "../../services/api";
import { getStaticContents } from "../../data/staticContent";

const playlistUrl = "https://www.youtube.com/playlist?list=PLgImeU9gw981tOfL6Yu8AGdqwyd8qAuoZ";

const playlistVideos = [
  {
    id: "Y4EhQ6pFd2o",
    title: "Nossos Mortos Têm Voz",
    shortTitle: "Nossos Mortos Têm Voz",
    thumbnail: "https://i.ytimg.com/vi/Y4EhQ6pFd2o/hqdefault.jpg",
    meta: "Transmitido em 04/07/2021",
    date: "04/07/2021",
    titleFontSize: "2.1rem",
  },
  {
    id: "0kuXEeHfEzA",
    title: "CAMPONESES DO ARAGUAIA - A Guerrilha vista por dentro",
    shortTitle: "Camponeses do Araguaia - A Guerrilha vista por dentro",
    thumbnail: "https://i.ytimg.com/vi/0kuXEeHfEzA/hqdefault.jpg",
    meta: "Transmitido em 16/07/2021",
    date: "16/07/2021",
    titleFontSize: "1.65rem",
  },
  {
    id: "bOaBaZlTqF4",
    title: "15 Filhos",
    shortTitle: "15 Filhos",
    thumbnail: "https://i.ytimg.com/vi/bOaBaZlTqF4/hqdefault.jpg",
    meta: "Transmitido em 19/08/2021",
    date: "19/08/2021",
    titleFontSize: "2.3rem",
  },
  {
    id: "8Usy1OTeDqM",
    title: "Marãiwatsédé - O Resgate da Terra",
    shortTitle: "Marãiwatsédé - O Resgate da Terra",
    thumbnail: "https://i.ytimg.com/vi/8Usy1OTeDqM/hqdefault.jpg",
    meta: "Transmitido em 10/09/2021",
    date: "10/09/2021",
    titleFontSize: "1.95rem",
  },
  {
    id: "HpPr9coY5oA",
    title: "O Nosso Sagrado",
    shortTitle: "O Nosso Sagrado",
    thumbnail: "https://i.ytimg.com/vi/HpPr9coY5oA/hqdefault.jpg",
    meta: "Transmitido em 21/10/2021",
    date: "21/10/2021",
    titleFontSize: "2.2rem",
  },
  {
    id: "kcnyLc8shCE",
    title: "BARRA 68, sem perder a ternura.",
    shortTitle: "Barra 68, sem perder a ternura",
    thumbnail: "https://i.ytimg.com/vi/kcnyLc8shCE/hqdefault.jpg",
    meta: "Transmitido em 05/11/2021",
    date: "05/11/2021",
    titleFontSize: "1.95rem",
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

export default function MostraIII() {
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Cinema e Ditadura · 2021</p>
            <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">III Mostra Cinema e Ditadura</h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              A III Mostra Cinema e Ditadura reúne sessões e debates sobre memória, resistência, violência de Estado,
              território, povos originários e os legados da ditadura empresarial-militar brasileira.
            </p>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <img
              className="aspect-video w-full object-cover"
              src={playlistVideos[0].thumbnail}
              alt="Registro da III Mostra Cinema e Ditadura"
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
          aria-label="Abrir playlist completa da III Mostra"
        >
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.25em] text-primary">Transmissões gravadas</span>
            <span className="mt-3 block font-title text-4xl">Playlist completa da III Mostra</span>
            <span className="mt-3 block text-muted">Registros das transmissões realizadas entre julho e novembro de 2021.</span>
          </span>
          <Button as="span" variant="outline" className="mt-6 inline-flex shrink-0 items-center gap-2 md:mt-0">
            <PlayCircle size={18} aria-hidden="true" /> Abrir playlist
          </Button>
        </button>

        <section className="mt-16">
          <div className="flex items-center gap-3 text-primary">
            <CalendarDays aria-hidden="true" />
            <h2 className="font-title text-4xl text-text md:text-5xl">Calendário 2021</h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {playlistVideos.map((video) => {
              const film = findFilmByTitle(films, video.shortTitle);

              return (
                <article
                  key={`${video.date}-${video.id}`}
                  className="grid w-full gap-5 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[190px_minmax(0,1fr)]"
                >
                  <time
                    className="flex min-h-20 w-full shrink-0 items-center justify-center rounded-2xl border border-primary/60 bg-primary/15 px-4 text-center text-primary sm:min-h-full"
                    dateTime={video.date.split("/").reverse().join("-")}
                  >
                    <span className="whitespace-nowrap font-title font-semibold leading-none" style={{ fontSize: "2.35rem", letterSpacing: "-0.03em" }}>
                      {video.date}
                    </span>
                  </time>

                  <div className="flex min-w-0 flex-col justify-between py-1">
                    <div>
                      <h3
                        className="font-title"
                        style={{ fontSize: video.titleFontSize, lineHeight: 1.08 }}
                      >
                        {video.shortTitle}
                      </h3>
                      {film?.metadata?.director && <p className="mt-3 text-sm text-muted">Direção: {film.metadata.director}</p>}
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
                      <button
                        type="button"
                        className="group inline-flex w-fit cursor-pointer items-center gap-2 text-base font-semibold text-primary"
                        onClick={() => setActiveSessionVideo(video)}
                      >
                        <span className="animated-underline">Assistir à sessão</span>
                        <PlayCircle size={18} aria-hidden="true" />
                      </button>
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
                <h2 id="playlist-modal-title" className="mt-3 font-title text-4xl md:text-5xl">III Mostra Cinema e Ditadura</h2>
                <p className="mt-3 text-muted">Playlist · 6 vídeos · por LACE</p>
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
