import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Library, Play, PlayCircle, Users, X } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import ContentCredit from "../ui/ContentCredit";
import SocialShare from "../ui/SocialShare";
import api from "../../services/api";
import {
  contentCredits,
  contentFileUrls,
  contentImageUrls,
  contentPeople,
  contentText,
  contentVideo,
} from "../../utils/contentMetadata";

function getSpotifyEmbedUrl(url) {
  const match = url?.match(/open\.spotify\.com\/episode\/([^?]+)/);
  return match ? `https://open.spotify.com/embed/episode/${match[1]}` : null;
}

function mapContentToItem(content) {
  const { youtubeId, vimeoId, url: videoUrl } = contentVideo(content);
  const fileUrls = contentFileUrls(content);
  const imageUrls = contentImageUrls(content);
  const storedAuthors = content.type === "VIRAL_ESCAPE_LINES"
    ? content.metadata?.viralAuthors || content.metadata?.authors
    : content.metadata?.authors;
  const authors = Array.isArray(storedAuthors) ? storedAuthors.filter(Boolean) : [];

  return {
    id: content.id,
    title: content.title,
    description: contentText(content) || "Conteúdo disponível no acervo do LACE.",
    meta: authors.join(", ") || content.researcherName,
    submittedBy: content.createdBy?.name,
    href: fileUrls[0] || videoUrl,
    links: fileUrls,
    thumbnail: imageUrls[0] || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null),
    youtubeId,
    vimeoId,
    embedUrl: youtubeId
      ? `https://www.youtube.com/embed/${youtubeId}?wmode=opaque&autoplay=1`
      : vimeoId ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1` : null,
    episodes: content.metadata?.episodes || [],
    episodeReferences: content.metadata?.episodeReferences || {},
    episodeImages: content.metadata?.episodeImages || {},
    researchers: contentPeople(content),
    credits: contentCredits(content),
    soundtrack: content.metadata?.soundtrack || [],
    platform: content.metadata?.platform,
    authorBio: content.metadata?.viralAuthorBio
      || content.metadata?.authorBio
      || (content.type === "VIRAL_ESCAPE_LINES" ? content.description : null),
    researcherUrl: content.metadata?.researcherUrl || content.metadata?.researcherProfileUrl || content.metadata?.lattesUrl || content.metadata?.curriculumUrl || content.metadata?.linkedinUrl,
    images: imageUrls,
  };
}

function ContentRelations({ people = [], credits = [] }) {
  if (!people.length && !credits.length) return null;

  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2">
      {people.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-title text-3xl text-text">Pessoas e equipe</h3>
          <div className="mt-4 grid gap-4">
            {people.map((person, index) => (
              <div key={`${person.name || "pessoa"}-${index}`}>
                <p className="font-semibold text-text">{person.name || "Nome não informado"}</p>
                {person.role && <p className="mt-1 text-sm text-primary">{person.role}</p>}
                {person.description && <p className="mt-2 text-sm leading-6 text-muted">{person.description}</p>}
                {person.lattesUrl && (
                  <a className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary" href={person.lattesUrl} target="_blank" rel="noreferrer">
                    Currículo <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {credits.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-title text-3xl text-text">Ficha técnica</h3>
          <div className="mt-4 grid gap-4">
            {credits.map((credit, index) => (
              <div key={`${credit.title || credit.value || "credito"}-${index}`}>
                <p className="font-semibold text-text">{credit.title || credit.value || "Crédito"}</p>
                {credit.title && credit.value && <p className="mt-1 text-primary">{credit.value}</p>}
                {credit.description && <p className="mt-2 text-sm leading-6 text-muted">{credit.description}</p>}
                {credit.url && (
                  <a className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary" href={credit.url} target="_blank" rel="noreferrer">
                    Abrir referência <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function ArchivePage({ eyebrow, title, description, items = [], emptyMessage, contentType }) {
  const [remoteItems, setRemoteItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(contentType));
  const [activePodcast, setActivePodcast] = useState(null);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [activeResearchersPodcast, setActiveResearchersPodcast] = useState(null);
  const [activeInterview, setActiveInterview] = useState(null);
  const [activeViralItem, setActiveViralItem] = useState(null);
  const visibleItems = useMemo(() => (contentType ? remoteItems : items), [contentType, items, remoteItems]);
  const viralItems = useMemo(
    () => (contentType === "VIRAL_ESCAPE_LINES" ? visibleItems : []),
    [contentType, visibleItems],
  );
  const interviewItems = useMemo(
    () => (contentType === "INTERVIEW" ? visibleItems : []),
    [contentType, visibleItems],
  );
  const mediaCards = contentType === "INTERVIEW" || contentType === "PODCAST";
  const isPodcastModalOpen = Boolean(activePodcast);
  const isResearchersModalOpen = Boolean(activeResearchersPodcast);
  const isInterviewModalOpen = Boolean(activeInterview);
  const isViralModalOpen = Boolean(activeViralItem);
  const podcastEmbedUrl = getSpotifyEmbedUrl(activeEpisode?.url || activePodcast?.href);
  const activeEpisodeKey = activeEpisode?.number ? String(activeEpisode.number) : "";
  const activeEpisodeReferences = activePodcast?.episodeReferences?.[activeEpisodeKey];
  const activeEpisodeImages = activePodcast?.episodeImages?.[activeEpisodeKey] || [];
  const activeViralImages = activeViralItem?.images || [];
  const activeViralImage = activeViralImages[0];
  const activeViralItemIndex = useMemo(
    () => viralItems.findIndex((item) => item.id === activeViralItem?.id || item.title === activeViralItem?.title),
    [activeViralItem?.id, activeViralItem?.title, viralItems],
  );
  const activeInterviewIndex = useMemo(
    () => interviewItems.findIndex((item) => item.id === activeInterview?.id || item.title === activeInterview?.title),
    [activeInterview?.id, activeInterview?.title, interviewItems],
  );
  const isAlineViralItem = activeViralItem?.meta === "Aline Ribeiro Nascimento";
  const authorAboutLabel = isAlineViralItem ? "Sobre a autora" : "Sobre o autor";
  const hasMultipleViralItems = viralItems.length > 1;
  const hasMultipleInterviews = interviewItems.length > 1;
  const referenceSections = useMemo(
    () => activeEpisodeReferences
      ? [
        ["Referências bibliográficas", activeEpisodeReferences.bibliographic],
        ["Sites", activeEpisodeReferences.sites],
        ["Filmes", activeEpisodeReferences.films],
        ["Entrevistas", activeEpisodeReferences.interviews],
        ["Jornais", activeEpisodeReferences.newspapers],
        ["Documentos", activeEpisodeReferences.documents],
        ["Arquivos", activeEpisodeReferences.archives],
      ].filter(([, entries]) => entries?.length)
      : [],
    [activeEpisodeReferences],
  );

  useEffect(() => {
    if (!contentType) return undefined;

    let active = true;
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

  useEffect(() => {
    if (!isResearchersModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveResearchersPodcast(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isResearchersModalOpen]);

  useEffect(() => {
    if (!isInterviewModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveInterview(null);
        return;
      }
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (!hasMultipleInterviews) return;

      event.preventDefault();
      const fallbackIndex = activeInterviewIndex === -1 ? 0 : activeInterviewIndex;
      const nextIndex = event.key === "ArrowRight"
        ? (fallbackIndex + 1) % interviewItems.length
        : (fallbackIndex - 1 + interviewItems.length) % interviewItems.length;
      setActiveInterview(interviewItems[nextIndex]);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeInterviewIndex, hasMultipleInterviews, interviewItems, isInterviewModalOpen]);

  useEffect(() => {
    if (!isViralModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveViralItem(null);
        return;
      }
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (!hasMultipleViralItems) return;

      event.preventDefault();
      const fallbackIndex = activeViralItemIndex === -1 ? 0 : activeViralItemIndex;
      const nextIndex =
        event.key === "ArrowRight"
          ? (fallbackIndex + 1) % viralItems.length
          : (fallbackIndex - 1 + viralItems.length) % viralItems.length;
      setActiveViralItem(viralItems[nextIndex]);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeViralItemIndex, hasMultipleViralItems, isViralModalOpen, viralItems]);

  return (
    <main className="py-20 lg:py-28">
      <Container>
        <header className={contentType === "VIRAL_ESCAPE_LINES" ? "max-w-none" : "max-w-4xl"}>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">{title}</h1>
          {description && (
            <p
              className={`mt-6 text-lg leading-8 text-muted ${
                contentType === "VIRAL_ESCAPE_LINES" ? "max-w-none text-justify" : "max-w-3xl"
              }`}
            >
              {description}
            </p>
          )}
        </header>

        {loading ? (
          <p className="mt-14 text-muted">Carregando acervo...</p>
        ) : visibleItems.length > 0 ? (
          <div className={`mt-14 grid gap-6 ${contentType === "PODCAST" ? "" : "md:grid-cols-2 lg:grid-cols-3"}`}>
            {visibleItems.map((item) => (
              contentType === "PODCAST" ? (
                <article
                  key={item.title}
                  className="group grid w-full overflow-hidden rounded-3xl border border-primary/40 bg-card text-left text-text transition hover:border-primary lg:grid-cols-[0.95fr_1.05fr]"
                >
                  <span className="relative block h-full min-h-72">
                    {item.thumbnail ? (
                      <img className="h-full min-h-72 w-full object-cover" src={item.thumbnail} alt="" loading="lazy" decoding="async" />
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
                    <ContentCredit name={item.meta} profileUrl={item.researcherUrl} submittedBy={item.submittedBy} label="Produção" />
                    <span className="mt-3 block font-title text-4xl md:text-5xl">{item.title}</span>
                    <span className="mt-5 block max-w-3xl leading-8 text-muted">{item.description}</span>
                    {item.soundtrack.length > 0 && (
                      <span className="mt-5 block rounded-2xl border border-border bg-surface/80 p-4 text-sm leading-6 text-muted">
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
                    <span className="mt-5 block text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                      {item.episodes.length} episódios
                    </span>
                    </span>
                    <span className="mt-8 flex flex-wrap gap-3">
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
                      {item.researchers.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="inline-flex w-fit items-center gap-2"
                          onClick={() => setActiveResearchersPodcast(item)}
                        >
                          <Users size={18} aria-hidden="true" /> Pesquisadores
                        </Button>
                      )}
                    </span>
                  </span>
                </article>
              ) : contentType === "INTERVIEW" && item.embedUrl ? (
                <button
                  key={item.title}
                  type="button"
                  className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card text-left text-text transition hover:border-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => setActiveInterview(item)}
                  aria-label={`Assistir ${item.title}`}
                >
                  <span className="relative block">
                    {item.thumbnail ? (
                      <img className="aspect-video w-full object-cover" src={item.thumbnail} alt="" loading="lazy" decoding="async" />
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
                    <ContentCredit name={item.meta} profileUrl={item.researcherUrl} submittedBy={item.submittedBy} label="Pesquisa" linkName={false} />
                    <span className="mt-3 block font-title text-3xl">{item.title}</span>
                    <span className="mt-4 flex-1 leading-7 text-muted">{item.description}</span>
                    <span className="mt-6 inline-flex items-center gap-2 self-start font-semibold text-primary">
                      <span className="animated-underline">Acessar</span>
                      <PlayCircle size={16} aria-hidden="true" />
                    </span>
                  </span>
                </button>
              ) : contentType === "VIRAL_ESCAPE_LINES" ? (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveViralItem(item)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`Abrir ${item.title}`}
                >
                  {item.thumbnail ? (
                    <img className="aspect-[4/3] w-full object-cover" src={item.thumbnail} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <span className="grid aspect-[4/3] place-items-center bg-surface">
                      <Library className="text-primary" aria-hidden="true" />
                    </span>
                  )}
                  <div className="p-6">
                    <ContentCredit name={item.meta} profileUrl={item.researcherUrl} submittedBy={item.submittedBy} label="Autoria" linkName={false} />
                    <span className="mt-3 block font-title text-3xl text-text">
                      <span className="animated-underline">{item.title}</span>
                    </span>
                  </div>
                </button>
              ) : mediaCards && item.href ? (
                <a
                  key={item.title}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-text transition hover:border-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Acessar ${item.title}`}
                >
                  <span className="relative block">
                    {item.thumbnail ? (
                      <img className="aspect-video w-full object-cover" src={item.thumbnail} alt="" loading="lazy" decoding="async" />
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
                    <ContentCredit name={item.meta} profileUrl={item.researcherUrl} submittedBy={item.submittedBy} label="Pesquisa" linkName={false} />
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
                  <ContentCredit name={item.meta} profileUrl={item.researcherUrl} submittedBy={item.submittedBy} label="Pesquisa" />
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

      {activeViralItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="viral-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveViralItem(null);
          }}
        >
          <div className="relative max-h-[94vh] w-full max-w-7xl overflow-y-auto rounded-3xl border border-white/20 bg-background p-5 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setActiveViralItem(null)}
              className="absolute right-4 top-4 z-20 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              aria-label="Fechar obra"
            >
              <X size={24} aria-hidden="true" />
            </button>

            <div className="pr-14">
              {activeViralItem.meta && (
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                  {activeViralItem.researcherUrl ? (
                    <a href={activeViralItem.researcherUrl} target="_blank" rel="noreferrer">
                      <span className="animated-underline">{activeViralItem.meta}</span>
                    </a>
                  ) : (
                    activeViralItem.meta
                  )}
                </p>
              )}
              <h2 id="viral-modal-title" className="mt-3 font-title text-4xl md:text-6xl">{activeViralItem.title}</h2>
            </div>

            {hasMultipleViralItems && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => {
                    const fallbackIndex = activeViralItemIndex === -1 ? 0 : activeViralItemIndex;
                    setActiveViralItem(viralItems[(fallbackIndex - 1 + viralItems.length) % viralItems.length]);
                  }}
                >
                  <ArrowLeft size={18} aria-hidden="true" /> Poema anterior
                </button>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => {
                    const fallbackIndex = activeViralItemIndex === -1 ? 0 : activeViralItemIndex;
                    setActiveViralItem(viralItems[(fallbackIndex + 1) % viralItems.length]);
                  }}
                >
                  Próximo poema <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            )}

            {isAlineViralItem ? (
              <section className="mt-8">
                {activeViralImages.length > 0 && (
                  <div className={`grid gap-4 ${activeViralImages.length > 1 ? "lg:grid-cols-2" : ""}`}>
                    {activeViralImages.map((imageUrl, index) => (
                      <div key={imageUrl} className="flex items-center justify-center rounded-2xl border border-border bg-black p-2 md:p-4">
                        <img className="max-h-[78vh] w-auto max-w-full object-contain" src={imageUrl} alt={`Página ${index + 1} de ${activeViralItem.title}`} decoding="async" />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <section className="mt-8 grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                {activeViralImage ? (
                  <div className="self-start rounded-2xl border border-border bg-surface p-2">
                    <img className="max-h-[72vh] w-full rounded-xl object-contain" src={activeViralImage} alt="" decoding="async" />
                  </div>
                ) : (
                  <span className="grid aspect-[4/5] place-items-center rounded-2xl bg-surface">
                    <Library className="text-primary" aria-hidden="true" />
                  </span>
                )}
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                  <p className="whitespace-pre-line font-title text-2xl leading-relaxed text-text md:text-3xl">
                    {activeViralItem.description}
                  </p>
                </div>
              </section>
            )}

            {activeViralItem.authorBio && <section className="mt-8 rounded-2xl border border-border bg-surface/80 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{authorAboutLabel}</h3>
              <p className="mt-3 leading-7 text-muted">
                {activeViralItem.authorBio}
              </p>
            </section>}
            <SocialShare title={activeViralItem.title} url="/producao-academica/linhas-de-fugas-virais" className="mt-8" />
          </div>
        </div>
      )}

      {activeInterview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="interview-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveInterview(null);
          }}
        >
          <div className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/20 bg-background p-5 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setActiveInterview(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              aria-label="Fechar entrevista"
            >
              <X size={24} aria-hidden="true" />
            </button>

            {hasMultipleInterviews && (
              <div className="mb-5 flex items-center justify-between gap-3 pr-14">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Entrevista anterior"
                  onClick={() => {
                    const fallbackIndex = activeInterviewIndex === -1 ? 0 : activeInterviewIndex;
                    setActiveInterview(interviewItems[(fallbackIndex - 1 + interviewItems.length) % interviewItems.length]);
                  }}
                >
                  <ArrowLeft size={18} aria-hidden="true" /> <span className="hidden sm:inline">Anterior</span>
                </button>
                <span className="text-sm font-semibold text-muted">
                  {activeInterviewIndex + 1} de {interviewItems.length}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Próxima entrevista"
                  onClick={() => {
                    const fallbackIndex = activeInterviewIndex === -1 ? 0 : activeInterviewIndex;
                    setActiveInterview(interviewItems[(fallbackIndex + 1) % interviewItems.length]);
                  }}
                >
                  <span className="hidden sm:inline">Próxima</span> <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-border bg-black">
              <iframe
                className="aspect-video w-full"
                src={activeInterview.embedUrl}
                title={activeInterview.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <ContentCredit name={activeInterview.meta} profileUrl={activeInterview.researcherUrl} submittedBy={activeInterview.submittedBy} label="Pesquisa" className="mt-6" />
            <h2 id="interview-modal-title" className="mt-3 pr-12 font-title text-4xl md:text-5xl">
              {activeInterview.title}
            </h2>
            <p className="mt-4 max-w-3xl leading-8 text-muted">{activeInterview.description}</p>

            <ContentRelations people={activeInterview.researchers} credits={activeInterview.credits} />

            {activeInterview.href && (
              <a
                className="mt-6 inline-flex items-center gap-2 font-semibold text-primary"
                href={activeInterview.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="animated-underline">Abrir vídeo original</span>
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            )}
            <SocialShare title={activeInterview.title} url="/producao-audiovisual/entrevistas" className="mt-8" />
          </div>
        </div>
      )}

      {activePodcast && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
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
                  <img className="aspect-video w-full rounded-2xl object-cover" src={activePodcast.thumbnail} alt="" decoding="async" />
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

                <ContentRelations credits={activePodcast.credits} />

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
                <SocialShare title={activeEpisode?.title || activePodcast.title} url="/producao-audiovisual/podcasts" className="mt-8" />
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

      {activeResearchersPodcast && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="researchers-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveResearchersPodcast(null);
          }}
        >
          <div className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/20 bg-background p-6 shadow-2xl md:p-10">
            <button
              type="button"
              onClick={() => setActiveResearchersPodcast(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              aria-label="Fechar pesquisadores"
            >
              <X size={24} aria-hidden="true" />
            </button>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              {activeResearchersPodcast.platform || "Podcast"}
            </p>
            <h2 id="researchers-modal-title" className="mt-3 font-title text-4xl md:text-5xl">
              Pesquisadoras e pesquisadores
            </h2>
            <p className="mt-4 max-w-3xl leading-8 text-muted">{activeResearchersPodcast.title}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {activeResearchersPodcast.researchers.map((researcher) => (
                <div key={researcher.name} className="rounded-2xl border border-border bg-card p-5">
                  {researcher.url || researcher.lattesUrl ? (
                    <a className="font-semibold text-primary" href={researcher.url || researcher.lattesUrl} target="_blank" rel="noreferrer">
                      <span className="animated-underline">{researcher.name}</span>
                    </a>
                  ) : (
                    <span className="font-semibold text-text">{researcher.name}</span>
                  )}
                  <p className="mt-2 text-sm leading-6 text-muted">{researcher.role}</p>
                  {researcher.description && <p className="mt-2 text-sm leading-6 text-muted">{researcher.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
