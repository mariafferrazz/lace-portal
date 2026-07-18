import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Library, Play } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../ui/Container";
import api from "../../services/api";

function mapContentToItem(content) {
  const youtubeId = content.metadata?.youtubeId;

  return {
    title: content.title,
    description: content.description || "Conteúdo disponível no acervo do LACE.",
    meta: content.researcherName,
    href: content.externalUrl || content.fileUrl,
    thumbnail: content.metadata?.thumbnail || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null),
    youtubeId,
  };
}

export default function ArchivePage({ eyebrow, title, description, items = [], emptyMessage, contentType }) {
  const [remoteItems, setRemoteItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(contentType));
  const visibleItems = contentType ? remoteItems : items;
  const mediaCards = contentType === "INTERVIEW";

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
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item) => (
              mediaCards && item.href ? (
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
    </main>
  );
}
