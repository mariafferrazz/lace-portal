import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink, FileText, X } from "lucide-react";
import Container from "../../components/ui/Container";
import SocialShare from "../../components/ui/SocialShare";
import api from "../../services/api";
import { CONTENT_UPDATED_EVENT } from "../../features/content/contentEvents";
import { contentFileUrls, contentImage } from "../../utils/contentMetadata";
import { researchSlug as contentResearchSlug } from "../../utils/contentRoutes";

function researchFromContent(content) {
  const metadata = content.metadata || {};
  const team = Array.isArray(metadata.team) && metadata.team.length
    ? metadata.team
    : Array.isArray(metadata.researchers) ? metadata.researchers : [];
  return {
    id: content.id,
    title: content.title,
    slug: contentResearchSlug(content),
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

function mergeDynamicResearches(dynamicContents) {
  return dynamicContents.map(researchFromContent);
}

export default function Pesquisas() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dynamicContents, setDynamicContents] = useState([]);
  const [loadState, setLoadState] = useState("loading");
  const allResearches = useMemo(() => mergeDynamicResearches(dynamicContents), [dynamicContents]);
  const activeResearch = useMemo(() => {
    const hash = location.hash.replace("#", "");
    return hash ? allResearches.find((item) => item.slug === hash) || null : null;
  }, [allResearches, location.hash]);

  useEffect(() => {
    let active = true;
    const refreshResearches = () => api.get("/contents", { params: { type: "RESEARCH" } })
      .then(({ data }) => {
        if (active) {
          setDynamicContents(data.contents || []);
          setLoadState("ready");
        }
      })
      .catch(() => {
        if (active) {
          setDynamicContents([]);
          setLoadState("error");
        }
      });

    refreshResearches();
    window.addEventListener("focus", refreshResearches);
    window.addEventListener(CONTENT_UPDATED_EVENT, refreshResearches);

    return () => {
      active = false;
      window.removeEventListener("focus", refreshResearches);
      window.removeEventListener(CONTENT_UPDATED_EVENT, refreshResearches);
    };
  }, []);

  function setResearchAndHash(research) {
    navigate(`/producao-academica/pesquisas/${research.slug}`);
  }

  function closeResearch() {
    navigate(`${location.pathname}${location.search}`, { replace: true });
  }

  function navigateResearch(direction) {
    if (!activeResearch) return;

    const currentIndex = allResearches.findIndex((research) => research.title === activeResearch.title);
    const nextIndex =
      direction === "previous"
        ? (currentIndex - 1 + allResearches.length) % allResearches.length
        : (currentIndex + 1) % allResearches.length;

    setResearchAndHash(allResearches[nextIndex]);
  }

  useEffect(() => {
    if (!activeResearch) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        navigate(`${location.pathname}${location.search}`, { replace: true });
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeResearch, location.pathname, location.search, navigate]);

  return (
    <main className="bg-background py-20 lg:py-28">
      <Container>
        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Produção acadêmica</p>
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">Pesquisas</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Nessa aba você pode conferir as pesquisas desenvolvidas pelo nosso núcleo de pesquisa:
          </p>
        </header>

        <section className="mt-12 grid gap-4 sm:grid-cols-2" aria-label="Pesquisas">
          {loadState === "loading" && <p className="text-muted sm:col-span-2">Carregando pesquisas...</p>}
          {loadState === "error" && <p className="text-muted sm:col-span-2">Não foi possível carregar as pesquisas do banco de dados.</p>}
          {loadState === "ready" && allResearches.length === 0 && <p className="text-muted sm:col-span-2">Nenhuma pesquisa publicada.</p>}
          {allResearches.map((research) => (
            <button
              key={research.id || research.slug}
              className="group inline-flex min-h-20 w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 text-left font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              type="button"
              onClick={() => setResearchAndHash(research)}
            >
              <span>{research.title}</span>
              <FileText size={20} className="shrink-0 text-primary transition group-hover:text-on-primary" aria-hidden="true" />
            </button>
          ))}
        </section>
      </Container>

      {activeResearch && (
        <ResearchModal
          research={activeResearch}
          researchPosition={allResearches.findIndex((item) => item.title === activeResearch.title) + 1}
          researchCount={allResearches.length}
          onClose={closeResearch}
          onNavigate={navigateResearch}
        />
      )}
    </main>
  );
}

function ResearchModal({ research, researchPosition, researchCount, onClose, onNavigate }) {
  useEffect(() => {
    const navigateByKeyboard = (event) => {
      const tagName = event.target?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") return;

      if (event.key === "ArrowLeft") onNavigate("previous");
      if (event.key === "ArrowRight") onNavigate("next");
    };

    window.addEventListener("keydown", navigateByKeyboard);

    return () => window.removeEventListener("keydown", navigateByKeyboard);
  }, [onNavigate]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="research-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/20 bg-background p-6 shadow-2xl md:p-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-3 text-white transition hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          aria-label="Fechar pesquisa"
        >
          <X size={24} aria-hidden="true" />
        </button>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Pesquisa</p>
        <h2 id="research-title" className="mt-3 pr-12 font-title text-4xl md:text-5xl">
          {research.title}
        </h2>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate("previous")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Pesquisa anterior"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Anterior
          </button>
          <span className="text-sm font-semibold text-muted">
            {researchPosition} de {researchCount}
          </span>
          <button
            type="button"
            onClick={() => onNavigate("next")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 font-semibold text-text transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Próxima pesquisa"
          >
            Próxima
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>

        {research.image && (
          <img
            className="mt-8 max-h-[460px] w-full rounded-2xl border border-border object-cover"
            src={research.image}
            alt={research.title}
            loading="lazy"
            decoding="async"
          />
        )}

        <section className="mt-8 space-y-5 leading-8 text-muted">
          <h3 className="font-title text-3xl text-text">Resumo da pesquisa</h3>
          {research.summary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        {research.researchers?.length > 0 && (
          <section className="mt-10">
            <h3 className="font-title text-3xl text-text">Equipe de pesquisa</h3>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {research.researchers.map((researcher) => (
                <article key={researcher.name} className="rounded-2xl border border-border bg-card p-4">
                  <h4 className="font-semibold text-text">{researcher.name}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted">{researcher.description}</p>
                  {researcher.lattes && (
                    <a
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-text"
                      href={researcher.lattes}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lattes <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  )}
                </article>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">Dentre outros.</p>
          </section>
        )}

        {research.commission && (
          <section className="mt-10 rounded-2xl border border-border bg-card p-5">
            <h3 className="font-title text-3xl text-text">Comissão científica</h3>
            <p className="mt-4 leading-8 text-muted">{research.commission}</p>
          </section>
        )}

        {research.additionalInfo?.length > 0 && (
          <section className="mt-10 grid gap-4 md:grid-cols-2">
            {research.additionalInfo.map((info, index) => (
              <article key={`${info.title || "informacao"}-${index}`} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-title text-2xl text-text">{info.title || "Informação adicional"}</h3>
                {info.description && <p className="mt-3 whitespace-pre-line leading-7 text-muted">{info.description}</p>}
              </article>
            ))}
          </section>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {research.publicReportUrl && (
            <a
              className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
              href={research.publicReportUrl}
              target="_blank"
              rel="noreferrer"
            >
              Informe Público <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}
          {research.resources?.map((resource, index) => resource.url && (
            <a
              key={`${resource.url}-${index}`}
              className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary-fill hover:text-on-primary"
              href={resource.url}
              target="_blank"
              rel="noreferrer"
            >
              {resource.title || "Abrir recurso"} <ExternalLink size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
        <SocialShare title={research.title} url={`/producao-academica/pesquisas/${research.slug}`} className="mt-8" />
      </div>
    </div>,
    document.body,
  );
}
