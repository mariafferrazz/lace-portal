import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, ExternalLink, Images, X } from "lucide-react";
import Container from "../../components/ui/Container";
import SocialShare from "../../components/ui/SocialShare";
import api from "../../services/api";
import { eventYear, showPath } from "../../utils/contentRoutes";

function eventImage(content) {
  return content.metadata?.thumbnail || content.metadata?.imageUrl || content.fileUrl || "https://i.ytimg.com/vi/iuRlQ17bDbM/hqdefault.jpg";
}

function eventLink(content) {
  if (content.type === "CINEMA_SHOW") return showPath(content);
  return content.externalUrl || content.fileUrl || "";
}

export default function DynamicEventosYear() {
  const { year } = useParams();
  const [contents, setContents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const events = useMemo(
    () => contents
      .filter((content) => ["EVENT", "CINEMA_SHOW"].includes(content.type))
      .filter((content) => eventYear(content) === year),
    [contents, year],
  );

  useEffect(() => {
    let active = true;
    api
      .get("/contents")
      .then(({ data }) => {
        if (active) setContents(data.contents || []);
      })
      .catch(() => {
        if (active) setContents([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activeEvent) return undefined;
    const close = (event) => event.key === "Escape" && setActiveEvent(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [activeEvent]);

  return (
    <main className="bg-background py-20 lg:py-28">
      <Container>
        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Eventos e atividades</p>
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">Eventos {year}</h1>
        </header>

        {loading ? (
          <p className="mt-14 text-muted">Carregando eventos...</p>
        ) : events.length > 0 ? (
          <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label={`Eventos ${year}`}>
            {events.map((content) => (
              <button
                key={content.id}
                type="button"
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card text-left text-text transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setActiveEvent(content)}
              >
                <img className="aspect-[4/3] w-full object-cover" src={eventImage(content)} alt="" loading="lazy" decoding="async" />
                <span className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">{eventYear(content)}</span>
                  <span className="mt-3 block font-title text-3xl">{content.title}</span>
                  {content.description && <span className="mt-4 flex-1 leading-7 text-muted">{content.description}</span>}
                  <span className="mt-6 inline-flex items-center gap-2 self-start font-semibold text-primary">
                    <span className="animated-underline">Ver detalhes</span>
                    <Images size={16} aria-hidden="true" />
                  </span>
                </span>
              </button>
            ))}
          </section>
        ) : (
          <div className="mt-14 rounded-3xl border border-dashed border-border bg-card/60 p-8 md:p-12">
            <CalendarDays className="text-primary" aria-hidden="true" />
            <h2 className="mt-5 font-title text-4xl">Eventos em organização</h2>
            <p className="mt-4 max-w-2xl leading-8 text-muted">Ainda não há conteúdos publicados para {year}.</p>
          </div>
        )}
      </Container>

      {activeEvent && <EventModal content={activeEvent} onClose={() => setActiveEvent(null)} />}
    </main>
  );
}

function EventModal({ content, onClose }) {
  const link = eventLink(content);
  const sessions = Array.isArray(content.metadata?.sessions) ? content.metadata.sessions : [];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dynamic-event-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/20 bg-background p-5 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          aria-label="Fechar evento"
        >
          <X size={24} aria-hidden="true" />
        </button>

        <section className="grid gap-8 pr-0 lg:grid-cols-[0.9fr_1.1fr] lg:pr-8">
          <img className="max-h-[620px] w-full rounded-2xl border border-border object-contain" src={eventImage(content)} alt={content.title} decoding="async" />

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">{eventYear(content)}</p>
            <h2 id="dynamic-event-title" className="mt-3 pr-10 font-title text-4xl md:text-5xl">{content.title}</h2>
            {content.description && <p className="mt-5 whitespace-pre-line leading-8 text-muted">{content.description}</p>}

            {sessions.length > 0 && (
              <section className="mt-8">
                <h3 className="font-title text-3xl">Sessões</h3>
                <div className="mt-4 grid gap-3">
                  {sessions.map((session, index) => (
                    <article key={`${session.date}-${session.title}-${index}`} className="rounded-2xl border border-border bg-card p-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{session.date || "Data a confirmar"}</p>
                      <h4 className="mt-2 font-title text-2xl">{session.title || `Sessão ${index + 1}`}</h4>
                      {session.direction && <p className="mt-2 text-sm leading-6 text-muted">{session.direction}</p>}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {link && (
              <div className="mt-8 flex flex-wrap gap-3">
                {link.startsWith("/") ? (
                  <Link className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary" to={link} onClick={onClose}>
                    Abrir página <ExternalLink size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  <a className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary" href={link} target="_blank" rel="noreferrer">
                    Abrir link <ExternalLink size={16} aria-hidden="true" />
                  </a>
                )}
              </div>
            )}

            <SocialShare title={content.title} url={`/eventos/${eventYear(content)}`} className="mt-8" />
          </div>
        </section>
      </div>
    </div>,
    document.body,
  );
}
