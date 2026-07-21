import { useId, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const contributionTypeLabels = {
  FILM: "Filme",
  GLOSSARY: "Verbete",
  CINEMA_SHOW: "Mostra",
  ARTICLE: "Artigo",
  RESEARCH: "Pesquisa",
  VIRAL_ESCAPE_LINES: "Linhas de Fugas Virais",
  INTERVIEW: "Entrevista",
  PODCAST: "Podcast",
  EVENT: "Evento",
};

export default function TeamCard({ name, role, bio, profileUrl, contributions = [] }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <article id={slugify(name)} className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 transition hover:border-primary/60">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full cursor-pointer items-center justify-between gap-5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <span>
          <span className="block font-title text-2xl md:text-3xl">{name}</span>
          <span className="mt-1 block text-primary">{role}</span>
        </span>
        <ChevronDown aria-hidden="true" className={`shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div id={contentId} className="overflow-hidden">
          <p className="mt-6 border-t border-border pt-5 leading-7 text-muted">{bio}</p>
          {profileUrl && (
            <a
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-primary/60 px-4 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
            >
              Lattes / LinkedIn <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}
          {contributions.length > 0 && (
            <section className="mt-6 border-t border-border pt-5">
              <h4 className="font-title text-2xl text-text">Contribuições</h4>
              <ul className="mt-3 space-y-2">
                {contributions.map((item) => (
                  <li key={item.id} className="text-sm leading-6 text-muted">
                    <span className="font-semibold text-primary">{contributionTypeLabels[item.type] || item.type}</span>
                    {" · "}
                    <span className="text-text">{item.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </article>
  );
}
