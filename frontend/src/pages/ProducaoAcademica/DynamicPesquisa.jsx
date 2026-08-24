import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Library } from "lucide-react";
import Container from "../../components/ui/Container";
import SocialShare from "../../components/ui/SocialShare";
import { loadResearch } from "../../features/content/public/navigation";
import { contentFileUrls, contentImage } from "../../utils/contentMetadata";

function researchForPage(content, requestedSlug) {
  const metadata = content.metadata || {};
  const team = Array.isArray(metadata.team) && metadata.team.length
    ? metadata.team
    : Array.isArray(metadata.researchers) ? metadata.researchers : [];

  return {
    title: content.title,
    slug: requestedSlug,
    url: content.externalUrl || "",
    image: contentImage(content),
    summary: content.description ? content.description.split(/\n{2,}/).filter(Boolean) : [],
    publicReportUrl: contentFileUrls(content)[0] || metadata.publicReportUrl,
    researchers: team.map((person) => ({
      name: person.name,
      description: [person.role, person.description].filter(Boolean).join(" — "),
      lattes: person.lattesUrl || person.lattes,
    })),
    commission: metadata.commission || "",
    additionalInfo: Array.isArray(metadata.additionalInfo) ? metadata.additionalInfo : [],
    resources: Array.isArray(metadata.resources) ? metadata.resources : [],
  };
}

function ResearchLinks({ research }) {
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      {research.publicReportUrl && (
        <a className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary" href={research.publicReportUrl} target="_blank" rel="noreferrer">
          Informe Público <ExternalLink size={16} aria-hidden="true" />
        </a>
      )}
      {research.resources?.map((resource, index) => resource.url && (
        <a key={`${resource.url}-${index}`} className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary" href={resource.url} target="_blank" rel="noreferrer">
          {resource.title || "Abrir recurso"} <ExternalLink size={16} aria-hidden="true" />
        </a>
      ))}
      {research.url && (
        <a className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 font-semibold text-text transition hover:border-primary hover:text-primary" href={research.url} target="_blank" rel="noreferrer">
          Fonte original <ExternalLink size={16} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

export default function DynamicPesquisa() {
  const { researchSlug } = useParams();
  const [page, setPage] = useState({ slug: "", research: null });
  const loading = page.slug !== researchSlug;
  const research = loading ? null : page.research;

  useEffect(() => {
    let active = true;

    loadResearch(researchSlug)
      .then((content) => {
        if (active) {
          setPage({
            slug: researchSlug,
            research: researchForPage(content, researchSlug),
          });
        }
      })
      .catch(() => {
        if (active) setPage({ slug: researchSlug, research: null });
      });

    return () => {
      active = false;
    };
  }, [researchSlug]);

  if (loading) {
    return (
      <main className="bg-background py-20 lg:py-28">
        <Container><p className="text-muted">Carregando pesquisa...</p></Container>
      </main>
    );
  }

  if (!research) {
    return (
      <main className="bg-background py-20 lg:py-28">
        <Container>
          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 md:p-12">
            <Library className="text-primary" aria-hidden="true" />
            <h1 className="mt-5 font-title text-4xl md:text-5xl">Pesquisa em organização</h1>
            <p className="mt-4 max-w-2xl leading-8 text-muted">
              Esta pesquisa ainda não foi publicada no acervo do LACE ou está aguardando aprovação.
            </p>
            <Link className="mt-6 inline-flex items-center gap-2 font-semibold text-primary" to="/producao-academica/pesquisas">
              <ArrowLeft size={18} aria-hidden="true" /> Voltar para pesquisas
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-background py-20 lg:py-28">
      <Container>
        <Link className="inline-flex items-center gap-2 font-semibold text-primary transition hover:text-text" to="/producao-academica/pesquisas">
          <ArrowLeft size={18} aria-hidden="true" /> Todas as pesquisas
        </Link>

        <header className={`mt-8 grid gap-10 ${research.image ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""}`}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Produção acadêmica · Pesquisa</p>
            <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">{research.title}</h1>
          </div>
          {research.image && (
            <figure className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
              <img className="max-h-[650px] w-full object-contain" src={research.image} alt={research.title} decoding="async" />
            </figure>
          )}
        </header>

        <section className="mt-12 max-w-5xl space-y-5 leading-8 text-muted">
          <h2 className="font-title text-4xl text-text">Resumo da pesquisa</h2>
          {research.summary.length > 0
            ? research.summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            : <p>O resumo desta pesquisa ainda não foi informado.</p>}
        </section>

        {research.researchers?.length > 0 && (
          <section className="mt-14">
            <h2 className="font-title text-4xl text-text">Equipe de pesquisa</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {research.researchers.map((researcher) => (
                <article key={researcher.name} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-text">{researcher.name}</h3>
                  {researcher.description && <p className="mt-2 text-sm leading-6 text-muted">{researcher.description}</p>}
                  {researcher.lattes && (
                    <a className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-text" href={researcher.lattes} target="_blank" rel="noreferrer">
                      Lattes <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {research.commission && (
          <section className="mt-12 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-title text-4xl text-text">Comissão científica</h2>
            <p className="mt-4 leading-8 text-muted">{research.commission}</p>
          </section>
        )}

        {research.additionalInfo?.length > 0 && (
          <section className="mt-12 grid gap-4 md:grid-cols-2">
            {research.additionalInfo.map((info, index) => (
              <article key={`${info.title || "informacao"}-${index}`} className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-title text-3xl text-text">{info.title || "Informação adicional"}</h2>
                {info.description && <p className="mt-3 whitespace-pre-line leading-7 text-muted">{info.description}</p>}
              </article>
            ))}
          </section>
        )}

        <ResearchLinks research={research} />
        <SocialShare title={research.title} url={`/producao-academica/pesquisas/${research.slug}`} className="mt-8" />
      </Container>
    </main>
  );
}
