import { useMemo } from "react";
import { Bell, CheckCircle2, Pencil } from "lucide-react";
import Button from "../../../../components/ui/Button";
import api from "../../../../services/api";
import { cardActionButtonClass } from "../constants";
import { compareDashboardContents, contentAreaLabel, typeLabel } from "../utils";

export default function PendingApprovals({ contents, refresh, onEdit, onOpen }) {
  const pending = useMemo(
    () => contents.filter((content) => !content.published && content.type !== "ARTICLE_AUTHOR").sort(compareDashboardContents),
    [contents],
  );
  if (pending.length === 0) return null;

  async function approve(content) {
    await api.patch(`/contents/${content.id}`, { published: true });
    refresh();
  }

  return (
    <section className="mb-6 rounded-3xl border border-primary/40 bg-primary/10 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <Bell className="mt-1 text-primary" aria-hidden="true" />
          <div>
            <h2 className="font-title text-3xl text-text">Aguardando autorização</h2>
            <p className="mt-1 text-muted">
              {pending.length} {pending.length === 1 ? "conteúdo precisa" : "conteúdos precisam"} de revisão da coordenação antes de entrar no site.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {pending.slice(0, 6).map((content) => (
          <article key={content.id} className="grid gap-4 rounded-2xl border border-border bg-background p-4 transition hover:border-primary/50 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                {contentAreaLabel(content)} - {typeLabel(content.type)}
              </p>
              <h3 className="mt-1 line-clamp-2 max-w-[78ch] overflow-hidden text-ellipsis font-title text-[clamp(1.35rem,1.7vw,1.6rem)] leading-tight">
                {content.title}
              </h3>
              <p className="mt-1 text-sm text-muted">
                Enviado por {content.createdBy?.name || "usuário do LACE"} - Pesquisador(a): <strong className="text-text">{content.researcherName}</strong>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
              <Button variant="outline" className={cardActionButtonClass} type="button" onClick={() => onOpen(content)}>
                Abrir página
              </Button>
              <Button variant="outline" className={cardActionButtonClass} type="button" onClick={() => onEdit(content)}>
                <Pencil size={15} aria-hidden="true" /> Editar
              </Button>
              <Button className={cardActionButtonClass} type="button" onClick={() => approve(content)}>
                <CheckCircle2 size={15} aria-hidden="true" /> Publicar
              </Button>
            </div>
          </article>
        ))}
        {pending.length > 6 && (
          <p className="text-sm text-muted">
            Mais {pending.length - 6} conteúdos em revisão aparecem nas áreas editoriais abaixo.
          </p>
        )}
      </div>
    </section>
  );
}
