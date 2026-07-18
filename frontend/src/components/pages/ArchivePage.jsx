import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Library, Play, PlayCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import api from "../../services/api";

function getSpotifyEmbedUrl(url) {
  const match = url?.match(/open\.spotify\.com\/episode\/([^?]+)/);
  return match ? `https://open.spotify.com/embed/episode/${match[1]}` : null;
}

function mapContentToItem(content) {
  const youtubeId = content.metadata?.youtubeId;

  return {
    title: content.title,
    description: content.description || "Conteúdo disponível no acervo do LACE.",
    meta: content.researcherName,
    href: content.externalUrl || content.fileUrl,
    thumbnail: content.metadata?.thumbnail || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null),
    youtubeId,
    episodes: content.metadata?.episodes || [],
    episodeReferences: content.metadata?.episodeReferences || {},
    episodeImages: content.metadata?.episodeImages || {},
    researchers: content.metadata?.researchers || [],
    soundtrack: content.metadata?.soundtrack || [],
    platform: content.metadata?.platform,
  };
}

export default function ArchivePage({ eyebrow, title, description, items = [], emptyMessage, contentType }) {
  const [remoteItems, setRemoteItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(contentType));
  const [activePodcast, setActivePodcast] = useState(null);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const visibleItems = contentType ? remoteItems : items;
  const mediaCards = contentType === "INTERVIEW" || contentType === "PODCAST";
  const isPodcastModalOpen = Boolean(activePodcast);
  const podcastEmbedUrl = getSpotifyEmbedUrl(activeEpisode?.url || activePodcast?.href);
  const activeEpisodeKey = activeEpisode?.number ? String(activeEpisode.number) : "";
  const activeEpisodeReferences = activePodcast?.episodeReferences?.[activeEpisodeKey];
  const activeEpisodeImages = activePodcast?.episodeImages?.[activeEpisodeKey] || [];
  const referenceSections = activeEpisodeReferences
    ? [
        ["Referências bibliográficas", activeEpisodeReferences.bibliographic],
        ["Sites", activeEpisodeReferences.sites],
        ["Filmes", activeEpisodeReferences.films],
        ["Entrevistas", activeEpisodeReferences.interviews],
        ["Jornais", activeEpisodeReferences.newspapers],
        ["Documentos", activeEpisodeReferences.documents],
        ["Arquivos", activeEpisodeReferences.archives],
      ].filter(([, entries]) => entries?.length)
    : [];

  useEffect(() => {
    if (!contentType) return undefined;

    let active = true;
    setLoading(true);
    api
      .get("/contents", { params: { type: contentType } })
      .then(({ data }) => {
        if (active) setRemoteItems((data.contents || []).map(mapContentToItem));
      })
      .catch(() => {
        if (active) setRemoteItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [contentType]);

  useEffect(() => {
    if (!isPodcastModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActivePodcast(null);
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;

      const episodes = activePodcast?.episodes || [];
      if (episodes.length < 2) return;

      event.preventDefault();
      setActiveEpisode((currentEpisode) => {
        const currentIndex = episodes.findIndex((episode) => episode.number === currentEpisode?.number);
        const fallbackIndex = currentIndex === -1 ? 0 : currentIndex;
        const nextIndex =
          event.key === "ArrowRight"
            ? (fallbackIndex + 1) % episodes.length
            : (fallbackIndex - 1 + episodes.length) % episodes.length;

        return episodes[nextIndex];
      });
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePodcast, isPodcastModalOpen]);

  return (
    <main className="py-20 lg:py-28">
      <Container>
        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">{title}</h1>
          {description && <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{description}</p>}
        </header>

        {loading ? (
          <p className="mt-14 text-muted">Carregando acervo...</p>
        ) : visibleItems.length > 0 ? (
          <div className={`mt-14 grid gap-6 ${contentType === "PODCAST" ? "" : "md:grid-cols-2 lg:grid-cols-3"}`}>
            {visibleItems.map((item) => (
              contentType === "PODCAST" ? (
                <article
                  key={item.title}
                  className="group grid w-full overflow-hidden rounded-3xl border border-primary/40 bg-card text-left text-text transition hover:-translate-y-1 hover:border-primary lg:grid-cols-[0.95fr_1.05fr]"
                >
                  <span className="relative block h-full min-h-72">
                    {item.thumbnail ? (
                      <img className="h-full min-h-72 w-full object-cover" src={item.thumbnail} alt="" />
                    ) : (
                      <span className="grid h-full min-h-72 place-items-center bg-surface">
                        <Library className="text-primary" aria-hidden="true" />
                      </span>
                    )}
                    <span className="absolute inset-0 grid place-items-center bg-black/20 transition group-hover:bg-black/40">
                      <span className="grid size-14 place-items-center rounded-full bg-primary-fill text-on-primary shadow-xl">
                        <Play fill="currentColor" aria-hidden="true" />
                      </span>
                    </span>
                  </span>
                  <span className="flex min-h-72 flex-col justify-between p-7 md:p-10">
                    <span>
                    {item.meta && <span className="text-xs font-semibold uppercase tracking-widest text-primary">{item.meta}</span>}
                    <span className="mt-3 block font-title text-4xl md:text-5xl">{item.title}</span>
                    <span className="mt-5 block max-w-3xl leading-8 text-muted">{item.description}</span>
                    <span className="mt-5 block text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                      {item.episodes.length} episódios
                    </span>
                    </span>
                    <span className="mt-8 grid gap-6 xl:grid-cols-[auto_1fr] xl:items-start">
                      <Button
                        type="button"
                        variant="outline"
                        className="inline-flex w-fit items-center gap-2"
                        onClick={() => {
                          setActivePodcast(item);
                          setActiveEpisode(item.episodes[0] || null);
                        }}
                      >
                        <PlayCircle size={18} aria-hidden="true" /> Abrir episódios
                      </Button>
                      {(item.researchers.length > 0 || item.soundtrack.length > 0) && (
                        <span className="grid gap-5 text-sm leading-6 text-muted md:grid-cols-2">
                          {item.researchers.length > 0 && (
                            <span>
                              <span className="block font-semibold uppercase tracking-[0.2em] text-primary">Pesquisadores</span>
                              <span className="mt-3 grid gap-2">
                                {item.researchers.map((researcher) => (
                                  <span key={researcher.name} className="block">
                                    {researcher.url ? (
                                      <a className="font-semibold text-primary" href={researcher.url}>
                                        <span className="animated-underline">{researcher.name}</span>
                                      </a>
                                    ) : (
                                      <span className="font-semibold text-text">{researcher.name}</span>
                                    )}
                                    <span className="block">{researcher.role}</span>
                                  </span>
                                ))}
                              </span>
                            </span>
                          )}
                          {item.soundtrack.length > 0 && (
                            <span>
                              <span className="block font-semibold uppercase tracking-[0.2em] text-primary">Música e trilha sonora</span>
                              <span className="mt-3 grid gap-2">
                                {item.soundtrack.map((track) => (
                                  <span key={track.title} className="block">
                                    <span className="font-semibold text-text">{track.title}</span>
                                    <span className="block">{track.description}</span>
                                  </span>
                                ))}
                              </span>
                            </span>
                          )}
                        </span>
                      )}
                    </span>
                  </span>
                </article>
              ) : mediaCards && item.href ? (
                <a
                  key={item.title}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-text transition hover:-translate-y-1 hover:border-primary focus-visible:-translate-y-1 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Acessar ${item.title}`}
                >
                  <span className="relative block">
                    {item.thumbnail ? (
                      <img className="aspect-video w-full object-cover" src={item.thumbnail} alt="" />
                    ) : (
                      <span className="grid aspect-video place-items-center bg-surface">
                        <Library className="text-primary" aria-hidden="true" />
                      </span>
                    )}
                    <span className="absolute inset-0 grid place-items-center bg-black/20 transition group-hover:bg-black/40">
                      <span className="grid size-14 place-items-center rounded-full bg-primary-fill text-on-primary shadow-xl">
                        <Play fill="currentColor" aria-hidden="true" />
                      </span>
                    </span>
                  </span>
                  <span className="flex flex-1 flex-col p-6">
                    {item.meta && <span className="text-xs font-semibold uppercase tracking-widest text-primary">{item.meta}</span>}
                    <span className="mt-3 block font-title text-3xl">{item.title}</span>
                    <span className="mt-4 flex-1 leading-7 text-muted">{item.description}</span>
                    <span className="mt-6 inline-flex items-center gap-2 self-start font-semibold text-primary">
                      <span className="animated-underline">Acessar</span>
                      <ExternalLink size={16} aria-hidden="true" />
                    </span>
                  </span>
                </a>
              ) : (
                <article key={item.title} className="flex flex-col rounded-2xl border border-border bg-card p-7">
                  {item.meta && <p className="text-xs font-semibold uppercase tracking-widest text-primary">{item.meta}</p>}
                  <h2 className="mt-3 font-title text-3xl">{item.title}</h2>
                  <p className="mt-4 flex-1 leading-7 text-muted">{item.description}</p>
                  {item.to && (
                    <Link className="mt-6 inline-flex items-center gap-2 font-semibold text-primary" to={item.to}>
                      Acessar <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                  {item.href && (
                    <a className="mt-6 inline-flex items-center gap-2 font-semibold text-primary" href={item.href} target="_blank" rel="noreferrer">
                      Acessar <ExternalLink size={16} aria-hidden="true" />
                    </a>
                  )}
                </article>
              )
            ))}
          </div>
        ) : (
          <div className="mt-14 rounded-3xl border border-dashed border-border bg-card/50 p-8 md:p-12">
            <Library className="text-primary" aria-hidden="true" />
            <h2 className="mt-5 font-title text-3xl">Acervo em organização</h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted">
              {emptyMessage || "Este conteúdo está sendo revisado e migrado para o novo portal do LACE."}
            </p>
          </div>
        )}
      </Container>

      {activePodcast && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="podcast-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActivePodcast(null);
          }}
        >
          <div className="relative max-h-[94vh] w-full max-w-7xl overflow-y-auto rounded-3xl border border-white/20 bg-background p-5 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setActivePodcast(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              aria-label="Fechar episódios"
            >
              <X size={24} aria-hidden="true" />
            </button>

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <section className="rounded-3xl border border-border bg-card p-5">
                {podcastEmbedUrl ? (
                  <iframe
                    className="h-40 w-full rounded-2xl bg-black"
                    src={podcastEmbedUrl}
                    title={activeEpisode?.title || activePodcast.title}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                ) : activePodcast.thumbnail ? (
                  <img className="aspect-video w-full rounded-2xl object-cover" src={activePodcast.thumbnail} alt="" />
                ) : (
                  <span className="grid aspect-video place-items-center rounded-2xl bg-surface">
                    <Library className="text-primary" aria-hidden="true" />
                  </span>
                )}

                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                  {activePodcast.platform || "Podcast"}
                </p>
                <h2 id="podcast-modal-title" className="mt-3 font-title text-4xl md:text-5xl">
                  {activePodcast.title}
                </h2>
                <p className="mt-3 text-muted">
                  {activePodcast.episodes.length} episódios · por LACE
                </p>
                {(activePodcast.researchers.length > 0 || activePodcast.soundtrack.length > 0) && (
                  <section className="mt-6 border-t border-border pt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {activePodcast.researchers.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Pesquisadores</h3>
                          <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
                            {activePodcast.researchers.map((researcher) => (
                              <li key={researcher.name}>
                                {researcher.url ? (
                                  <a className="font-semibold text-primary" href={researcher.url}>
                                    <span className="animated-underline">{researcher.name}</span>
                                  </a>
                                ) : (
                                  <span className="font-semibold text-text">{researcher.name}</span>
                                )}
                                <span className="block">{researcher.role}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {activePodcast.soundtrack.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Música e trilha sonora</h3>
                          <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
                            {activePodcast.soundtrack.map((track) => (
                              <li key={track.title}>
                                <span className="font-semibold text-text">{track.title}</span>
                                <span className="block">{track.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </section>
                )}
                {activeEpisode && (
                  <section className="mt-6 border-t border-border pt-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                      Episódio {activeEpisode.number}
                    </p>
                    <h3 className="mt-3 font-title text-3xl text-text md:text-4xl">{activeEpisode.title}</h3>
                    {activeEpisode.description && (
                      <p className="mt-4 leading-8 text-muted">{activeEpisode.description}</p>
                    )}
                  </section>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {(activeEpisode?.url || activePodcast.href) && (
                    <a
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-primary-fill hover:text-on-primary"
                      href={activeEpisode?.url || activePodcast.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <PlayCircle size={18} aria-hidden="true" /> Reproduzir episódio
                    </a>
                  )}
                  {activeEpisodeImages.map((image, index) => {
                    const imageUrl = typeof image === "string" ? image : image.url;
                    const imageTitle = typeof image === "string" ? `Imagem ${index + 1}` : image.title;

                    return (
                      <a
                        key={imageUrl}
                        className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink size={16} aria-hidden="true" /> {imageTitle}
                      </a>
                    );
                  })}
                </div>

                {referenceSections.length > 0 && (
                  <section className="mt-8 border-t border-border pt-6">
                    <h3 className="font-title text-3xl text-text">Referências</h3>
                    <div className="mt-5 grid gap-6">
                      {referenceSections.map(([sectionTitle, entries]) => (
                        <div key={sectionTitle}>
                          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{sectionTitle}</h4>
                          <ul className="mt-3 grid gap-3 text-sm leading-6 text-muted">
                            {entries.map((entry, index) => (
                              <li key={`${sectionTitle}-${index}`}>
                                {typeof entry === "string" ? (
                                  entry
                                ) : (
                                  <a className="text-primary" href={entry.url} target="_blank" rel="noreferrer">
                                    <span className="animated-underline">{entry.title}</span>
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </section>

              <section className="pt-2">
                <h3 className="font-title text-3xl text-text md:text-4xl">Episódios</h3>
                <div className="mt-6 grid gap-5">
                  {activePodcast.episodes.map((episode) => {
                    const active = activeEpisode?.number === episode.number;
                    return (
                      <button
                        key={`${activePodcast.title}-${episode.number}`}
                        type="button"
                        onClick={() => setActiveEpisode(episode)}
                        className={`grid cursor-pointer grid-cols-[70px_1fr] gap-4 rounded-2xl p-3 text-left transition hover:bg-card ${active ? "bg-card ring-1 ring-primary/60" : ""}`}
                      >
                        <span className="grid aspect-square place-items-center rounded-xl border border-primary/40 bg-primary/10 font-title text-3xl text-primary">
                          {episode.number}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold leading-6 text-text">{episode.title}</span>
                          <span className="mt-2 block text-sm text-muted">LACE</span>
                          <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                            <span className="animated-underline">Selecionar episódio</span>
                            <PlayCircle size={16} aria-hidden="true" />
                          </span>
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
    </main>
  );
}
