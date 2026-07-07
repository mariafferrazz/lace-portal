import { ArrowUpRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResearchCard({
  category,
  title,
  summary,
  author,
  to,
  actionLabel = "Leia",
  icon: Icon = FileText,
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary">
      <Icon className="text-primary" aria-hidden="true" />
      {category && (
        <p className="mt-4 text-xs uppercase tracking-widest text-primary">
          {category}
        </p>
      )}
      <h3 className="mt-3 font-title text-3xl">{title}</h3>
      <p className="mt-4 flex-1 text-muted line-clamp-4">{summary}</p>
      <div className="mt-6 flex items-center justify-between gap-4">
        {author && <span className="text-sm">{author}</span>}
        <Link
          to={to}
          className="ml-auto inline-flex items-center gap-2 font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {actionLabel} <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
