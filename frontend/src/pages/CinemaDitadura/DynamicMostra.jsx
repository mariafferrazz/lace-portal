import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Film, Library, PlayCircle } from "lucide-react";
import Container from "../../components/ui/Container";
import SocialShare from "../../components/ui/SocialShare";
import api from "../../services/api";
import { contentImageUrls, contentPlaylistUrls, sessionArchiveUrls, sessionWatchUrls } from "../../utils/contentMetadata";
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

export default function DynamicMostra() {
  const { showSlug } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessions = Array.isArray(show?.metadata?.sessions) ? show.metadata.sessions : [];
  const playlistUrls = show ? contentPlaylistUrls(show) : [];
  const imageUrl = show ? contentImageUrls(show)[0] : "";

  useEffect(() => {
    let active = true;
    setLoading(true);

    api
      .get(`/contents/cinema-shows/${showSlug}`)
      .then(({ data }) => {
        if (active) setShow(data.content || null);
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
                <a
                  key={url}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary px-5 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <PlayCircle size={18} aria-hidden="true" /> Abrir playlist {playlistUrls.length > 1 ? index + 1 : ""}
                </a>
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
                        {session.direction && <p className="mt-3 text-sm text-muted">Direção: {session.direction}</p>}
                        {session.note && <p className="mt-3 text-sm text-muted">{session.note}</p>}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        {archiveFilmUrls.map((url, urlIndex) => (
                          <a
                            key={`archive-${url}`}
                            className="group inline-flex w-fit items-center gap-2 text-base font-semibold text-primary"
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="animated-underline">Assistir ao filme{archiveFilmUrls.length > 1 ? ` ${urlIndex + 1}` : ""}</span>
                            <PlayCircle size={18} aria-hidden="true" />
                          </a>
                        ))}
                        {sessionUrls.map((url, urlIndex) => (
                          <a
                            key={`session-${url}`}
                            className="group inline-flex w-fit items-center gap-2 text-base font-semibold text-primary"
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="animated-underline">Assistir à sessão{sessionUrls.length > 1 ? ` ${urlIndex + 1}` : ""}</span>
                            <PlayCircle size={18} aria-hidden="true" />
                          </a>
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
    </main>
  );
}
