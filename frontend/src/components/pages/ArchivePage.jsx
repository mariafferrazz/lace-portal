import { ArrowRight, Library } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../ui/Container";

export default function ArchivePage({ eyebrow, title, description, items = [], emptyMessage }) {
  return (
    <main className="py-20 lg:py-28">
      <Container>
        <header className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
          <h1 className="mt-4 font-title text-5xl leading-tight md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{description}</p>
        </header>

        {items.length > 0 ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.title} className="flex flex-col rounded-2xl border border-border bg-card p-7">
                {item.meta && <p className="text-xs font-semibold uppercase tracking-widest text-primary">{item.meta}</p>}
                <h2 className="mt-3 font-title text-3xl">{item.title}</h2>
                <p className="mt-4 flex-1 leading-7 text-muted">{item.description}</p>
                {item.to && (
                  <Link className="mt-6 inline-flex items-center gap-2 font-semibold text-primary" to={item.to}>
                    Acessar <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </article>
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
