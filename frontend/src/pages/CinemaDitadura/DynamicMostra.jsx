import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, ExternalLink, Film, Library, ListVideo, PlayCircle, X } from "lucide-react";
import Container from "../../components/ui/Container";
import SocialShare from "../../components/ui/SocialShare";
import { loadCinemaShow } from "../../features/content/public/navigation";
import api, { apiError } from "../../services/api";
import {
  contentImageUrls,
  contentPlaylistUrls,
  sessionArchiveUrls,
  sessionWatchUrls,
  vimeoVideoId,
  youtubeVideoId,
} from "../../utils/contentMetadata";
import { showLabel, showPath } from "../../utils/contentRoutes";

function sessionKey(session, index) {
  return `${session.date || "sem-data"}-${session.title || "sessao"}-${index}`;
}

function dateTimeValue(date = "") {
  const [day, month, year] = String(date).split("/");
  return day && month && year ? `${year}-${month}-${day}` : undefined;
}

function playlistTitle(show) {
  const showNumber = show?.metadata?.showNumber;
  return showNumber ? `Playlist completa da ${showNumber} Mostra` : "Playlist completa da mostra";
}

function playlistPeriod(show) {
  const period = show?.metadata?.period;
  if (period) return `Registros das transmissões realizadas ${period}.`;
  return `Registros das transmissões realizadas${show?.metadata?.eventYear ? ` em ${show.metadata.eventYear}` : ""}.`;
}

function youtubePlaylistId(value) {
  try {
    const url = new URL(String(value || "").trim());
    return /(^|\.)youtube\.com$/.test(url.hostname) ? url.searchParams.get("list") || "" : "";
  } catch {
    return "";
  }
}

function mediaPlayerSource(media) {
  const url = media?.url || "";
  const youtubeId = youtubeVideoId(url);
  if (youtubeId) {
    return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1` };
  }

  const fallbackPlaylistId = youtubePlaylistId(url);
  if (fallbackPlaylistId) {
    return {
      kind: "iframe",
      src: `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(fallbackPlaylistId)}&autoplay=1`,
    };
  }

  const vimeoId = vimeoVideoId(url);
  if (vimeoId) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1` };
  if (/\.(?:mp4|webm|ogg)(?:$|[?#])/i.test(url)) return { kind: "video", src: url };
  return { kind: "external", src: url };
}

function PlayerFrame({ player, title }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-black">
      {player.kind === "iframe" && (
        <iframe
          className="aspect-video w-full"
          src={player.src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
      {player.kind === "video" && (
        <video className="aspect-video w-full" src={player.src} controls autoPlay playsInline>
          Seu navegador não oferece suporte à reprodução deste vídeo.
        </video>
      )}
      {player.kind === "external" && (
        <div className="grid min-h-72 place-items-center p-8 text-center">
          <div>
            <p className="text-muted">Este endereço não oferece um player incorporável.</p>
            <a className="mt-5 inline-flex items-center gap-2 rounded-xl border border-primary px-5 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary" href={player.src} target="_blank" rel="noreferrer">
              Abrir conteúdo original <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function PlaylistBrowser({ media }) {
  const [items, setItems] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api.get("/contents/youtube-playlist", { params: { url: media.url } })
      .then(({ data }) => {
        if (active) setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch((requestError) => {
        if (active) setError(apiError(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [media.url]);

  if (selectedVideo) {
    return (
      <div className="mt-6">
        <button
          type="button"
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => setSelectedVideo(null)}
        >
          <ArrowLeft size={17} aria-hidden="true" /> Voltar para a playlist
        </button>
        <h3 className="mb-4 font-title text-2xl text-text md:text-3xl">{selectedVideo.title}</h3>
        <PlayerFrame player={mediaPlayerSource(selectedVideo)} title={selectedVideo.title} />
      </div>
    );
  }

  if (loading) {
    return <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-muted">Carregando vídeos da playlist...</div>;
  }

  if (error || items.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted">{error || "Nenhum vídeo público foi encontrado nesta playlist."}</p>
        <a className="mt-5 inline-flex items-center gap-2 rounded-xl border border-primary px-5 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary" href={media.url} target="_blank" rel="noreferrer">
          Abrir playlist no YouTube <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="mb-4 flex items-center gap-2 text-muted"><ListVideo className="text-primary" size={20} aria-hidden="true" /> Escolha abaixo qual vídeo deseja assistir.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="group grid overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:-translate-y-0.5 hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:grid-cols-[180px_minmax(0,1fr)]"
            onClick={() => setSelectedVideo(item)}
          >
            <img className="aspect-video h-full w-full object-cover" src={item.thumbnail} alt="" loading="lazy" />
            <span className="flex min-w-0 items-center gap-3 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-fill text-on-primary"><PlayCircle size={20} aria-hidden="true" /></span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-widest text-primary">Vídeo {index + 1}</span>
                <span className="mt-1 block font-semibold leading-6 text-text">{item.title}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MediaPlayerModal({ media, onClose }) {
  const player = media.playlist ? null : mediaPlayerSource(media);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="show-media-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/20 bg-background p-5 shadow-2xl md:p-8">
        <button
          type="button"
          className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          aria-label="Fechar player"
          onClick={onClose}
        >
          <X size={24} aria-hidden="true" />
        </button>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Cinema e Ditadura</p>
        <h2 id="show-media-title" className="mt-3 pr-14 font-title text-3xl text-text md:text-5xl">{media.title}</h2>
        {media.playlist ? <PlaylistBrowser media={media} /> : <div className="mt-6"><PlayerFrame player={player} title={media.title} /></div>}
      </div>
    </div>,
    document.body,
  );
}

export default function DynamicMostra() {
  const { showSlug } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState(null);
  const sessions = Array.isArray(show?.metadata?.sessions) ? show.metadata.sessions : [];
  const playlistUrls = show ? contentPlaylistUrls(show) : [];
  const imageUrl = show ? contentImageUrls(show)[0] : "";

  useEffect(() => {
    let active = true;
    loadCinemaShow(showSlug)
      .then((content) => {
        if (active) setShow(content || null);
      })
      .catch(() => {
        if (active) setShow(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [showSlug]);

  useEffect(() => {
    if (!activeMedia) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setActiveMedia(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeMedia]);

  if (loading) {
    return (
      <main className="bg-background py-20 lg:py-28">
        <Container>
          <p className="text-muted">Carregando mostra...</p>
        </Container>
      </main>
    );
  }

  if (!show) {
    return (
      <main className="bg-background py-20 lg:py-28">
        <Container>
          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 md:p-12">
            <Library className="text-primary" aria-hidden="true" />
            <h1 className="mt-5 font-title text-4xl md:text-5xl">Mostra em organização</h1>
            <p className="mt-4 max-w-2xl leading-8 text-muted">
              Esta mostra ainda não foi publicada no acervo do LACE ou está aguardando aprovação.
            </p>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-background py-20 lg:py-28">
      <Container>
        <header className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Cinema e Ditadura{show.metadata?.eventYear ? ` · ${show.metadata.eventYear}` : ""}
            </p>
            <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">{showLabel(show)}</h1>
            {show.description && <p className="mt-6 max-w-4xl text-lg leading-8 text-muted">{show.description}</p>}
          </div>

          {imageUrl ? (
            <figure className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
              <img
                className="max-h-[650px] w-full object-contain"
                src={imageUrl}
                alt={showLabel(show)}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8">
              <Film className="text-primary" aria-hidden="true" />
              <p className="mt-4 leading-7 text-muted">Imagem da mostra ainda não cadastrada.</p>
            </div>
          )}
        </header>

        {playlistUrls.length > 0 && (
          <section className="mt-16 flex w-full flex-col rounded-3xl border border-primary/40 bg-primary/10 p-7 text-left md:flex-row md:items-center md:justify-between md:gap-8 md:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Transmissões gravadas</p>
              <h2 className="mt-3 font-title text-4xl">{playlistTitle(show)}</h2>
              <p className="mt-3 text-muted">{playlistPeriod(show)}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
              {playlistUrls.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary px-5 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => setActiveMedia({
                    url,
                    title: `${playlistTitle(show)}${playlistUrls.length > 1 ? ` ${index + 1}` : ""}`,
                    playlist: true,
                  })}
                >
                  <PlayCircle size={18} aria-hidden="true" /> Abrir playlist {playlistUrls.length > 1 ? index + 1 : ""}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16">
          <div className="flex items-center gap-3 text-primary">
            <CalendarDays className="text-primary" aria-hidden="true" />
            <h2 className="font-title text-4xl text-text md:text-5xl">
              Calendário{show.metadata?.eventYear ? ` ${show.metadata.eventYear}` : ""}
            </h2>
          </div>

          {sessions.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {sessions.map((session, index) => {
                const sessionUrls = sessionWatchUrls(session);
                const archiveFilmUrls = sessionArchiveUrls(session);

                return (
                  <article
                    key={sessionKey(session, index)}
                    className="grid w-full gap-5 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[190px_minmax(0,1fr)]"
                  >
                    <time
                      className="flex min-h-20 w-full shrink-0 items-center justify-center rounded-2xl border border-primary/60 bg-primary/15 px-4 text-center text-primary sm:min-h-full"
                      dateTime={dateTimeValue(session.date)}
                    >
                      <span className="whitespace-nowrap font-title font-semibold leading-none" style={{ fontSize: "2.35rem", letterSpacing: "-0.03em" }}>
                        {session.date || "A definir"}
                      </span>
                    </time>

                    <div className="flex min-w-0 flex-col justify-between py-1">
                      <div>
                        <h3 className="font-title text-3xl leading-tight text-text">{session.title || `Sessão ${index + 1}`}</h3>
                        {(session.direction || session.year) && (
                          <p className="mt-3 text-sm text-muted">
                            {session.direction && <>Direção: {session.direction}</>}
                            {session.direction && session.year && <span> · </span>}
                            {session.year && <>Ano: {session.year}</>}
                          </p>
                        )}
                        {session.note && <p className="mt-3 text-sm text-muted">{session.note}</p>}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        {archiveFilmUrls.map((url, urlIndex) => (
                          <button
                            key={`archive-${url}`}
                            type="button"
                            className="group inline-flex w-fit items-center gap-2 text-base font-semibold text-primary"
                            onClick={() => setActiveMedia({
                              url,
                              title: `${session.title || `Sessão ${index + 1}`} — filme${archiveFilmUrls.length > 1 ? ` ${urlIndex + 1}` : ""}`,
                            })}
                          >
                            <span className="animated-underline">Assistir ao filme{archiveFilmUrls.length > 1 ? ` ${urlIndex + 1}` : ""}</span>
                            <PlayCircle size={18} aria-hidden="true" />
                          </button>
                        ))}
                        {sessionUrls.map((url, urlIndex) => (
                          <button
                            key={`session-${url}`}
                            type="button"
                            className="group inline-flex w-fit items-center gap-2 text-base font-semibold text-primary"
                            onClick={() => setActiveMedia({
                              url,
                              title: `${session.title || `Sessão ${index + 1}`} — sessão${sessionUrls.length > 1 ? ` ${urlIndex + 1}` : ""}`,
                            })}
                          >
                            <span className="animated-underline">Assistir à sessão{sessionUrls.length > 1 ? ` ${urlIndex + 1}` : ""}</span>
                            <PlayCircle size={18} aria-hidden="true" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-border bg-card/60 p-8">
              <p className="leading-7 text-muted">O calendário desta mostra será publicado em breve.</p>
            </div>
          )}
        </section>

        <SocialShare title={showLabel(show)} url={showPath(show)} className="mt-12" />
      </Container>
      {activeMedia && <MediaPlayerModal media={activeMedia} onClose={() => setActiveMedia(null)} />}
    </main>
  );
}
