import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function TeamCard({ name, role, bio }) {
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
        </div>
      )}
    </article>
  );
}
