import { useId, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function linkName(url = "") {
  if (url.includes("lattes.cnpq.br")) return "Lattes";
  if (url.includes("linkedin.com")) return "LinkedIn";
  return "Site";
}

function profileLinks(links, profileUrl) {
  const normalized = (Array.isArray(links) ? links : [])
    .map((link) => ({ name: String(link?.name || "").trim(), url: String(link?.url || "").trim() }))
    .filter((link) => link.name && /^https?:\/\//i.test(link.url));
  if (profileUrl && !normalized.some((link) => link.url === profileUrl)) {
    normalized.push({ name: linkName(profileUrl), url: profileUrl });
  }
  return [...new Map(normalized.map((link) => [link.url, link])).values()];
}

export default function TeamCard({ name, role, bio, profileUrl, links }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const visibleLinks = profileLinks(links, profileUrl);

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
          {visibleLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3" aria-label={`Links de ${name}`}>
              {visibleLinks.map((link) => (
                <a
                  key={link.url}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/60 px-4 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.name} <ExternalLink size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
