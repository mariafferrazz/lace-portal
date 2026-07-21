import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, ExternalLink, Film, Library } from "lucide-react";
import Container from "../../components/ui/Container";
import SocialShare from "../../components/ui/SocialShare";
import api from "../../services/api";
import { showLabel, showPath } from "../../utils/contentRoutes";

function sessionKey(session, index) {
  return `${session.date || "sem-data"}-${session.title || "sessao"}-${index}`;
}

export default function DynamicMostra() {
  const { showSlug } = useParams();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const show = useMemo(
    () => shows.find((content) => showPath(content).endsWith(`/${showSlug}`)),
    [showSlug, shows],
  );
  const sessions = Array.isArray(show?.metadata?.sessions) ? show.metadata.sessions : [];

  useEffect(() => {
    let active = true;
    api
      .get("/contents", { params: { type: "CINEMA_SHOW" } })
      .then(({ data }) => {
        if (active) setShows(data.contents || []);
      })
      .catch(() => {
        if (active) setShows([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="bg-background py-20 lg:py-28">
        <Container><p className="text-muted">Carregando mostra...</p></Container>
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
        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Cinema e Ditadura</p>
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">{showLabel(show)}</h1>
          {show.metadata?.eventYear && <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">{show.metadata.eventYear}</p>}
          {show.description && <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{show.description}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {show.metadata?.playlistUrl && (
              <a
                className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
                href={show.metadata.playlistUrl}
                target="_blank"
                rel="noreferrer"
              >
                Abrir playlist <ExternalLink size={16} aria-hidden="true" />
              </a>
            )}
            <Link
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:text-primary"
              to={`/eventos/${show.metadata?.eventYear || ""}`}
            >
              Ver em eventos <CalendarDays size={16} aria-hidden="true" />
            </Link>
          </div>
        </header>

        <section className="mt-14">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-primary" aria-hidden="true" />
            <h2 className="font-title text-4xl">Calendário</h2>
          </div>

          {sessions.length > 0 ? (
            <div className="mt-8 grid gap-5">
              {sessions.map((session, index) => (
                <article key={sessionKey(session, index)} className="rounded-2xl border border-border bg-card p-5 md:p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{session.date || "Data a confirmar"}</p>
                  <h3 className="mt-3 font-title text-3xl text-text">{session.title || `Sessão ${index + 1}`}</h3>
                  {session.direction && <p className="mt-3 leading-7 text-muted">{session.direction}</p>}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {session.sessionUrl && (
                      <a className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary" href={session.sessionUrl} target="_blank" rel="noreferrer">
                        Assistir à sessão <ExternalLink size={16} aria-hidden="true" />
                      </a>
                    )}
                    {session.archiveFilmUrl && (
                      <a className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:text-primary" href={session.archiveFilmUrl} target="_blank" rel="noreferrer">
                        Acessar filme no acervo <Film size={16} aria-hidden="true" />
                      </a>
                    )}
                    {session.archiveFile?.name && (
                      <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
                        Arquivo selecionado: <strong className="text-text">{session.archiveFile.name}</strong>
                      </span>
                    )}
                  </div>
                </article>
              ))}
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
