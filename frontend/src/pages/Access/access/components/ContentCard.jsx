import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import Button from "../../../../components/ui/Button";
import api from "../../../../services/api";
import { contentAreaLabel, typeLabel } from "../utils";

export default function ContentCard({ content, user, refresh, onEdit, onOpen }) {
  const isCoordinator = user.role === "COORDINATOR";
  const isReadOnly = content.readOnly;
  const canEdit = !isReadOnly;

  async function publish() {
    await api.patch(`/contents/${content.id}`, { published: !content.published });
    refresh();
  }

  async function remove() {
    if (!window.confirm(`Excluir "${content.title}"?`)) return;
    await api.delete(`/contents/${content.id}`);
    refresh();
  }

  return (
    <article className="rounded-2xl border border-border bg-background p-5 transition hover:border-primary/50">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {contentAreaLabel(content)} - {typeLabel(content.type)}
          </p>
          <h3 className="mt-2 line-clamp-2 max-w-[78ch] overflow-hidden text-ellipsis font-title text-[clamp(1.35rem,1.7vw,1.6rem)] leading-tight">
            {content.title}
          </h3>
          {content.type === "CINEMA_SHOW" && (
            <p className="mt-2 text-sm text-muted">
              Mostra: <strong className="text-text">{content.metadata?.showNumber || "Sem numeracao"}</strong>
              {content.metadata?.sessionCount ? ` - ${content.metadata.sessionCount} sessoes cadastradas` : ""}
            </p>
          )}
          <p className="mt-2 text-sm text-muted">
            Pesquisador(a): <strong className="text-text">{content.researcherName}</strong>
          </p>
          <p className="mt-1 text-xs text-muted">Enviado por {content.createdBy?.name || "usuario do LACE"}</p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${content.published ? "bg-green-600/15 text-green-700 dark:text-green-300" : "bg-primary/10 text-primary"}`}>
            <span className={`size-2 rounded-full ${content.published ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.85)]" : "bg-primary"}`} aria-hidden="true" />
            {isReadOnly ? "No site" : content.published ? "Publicado" : "Em revisao"}
          </span>
          <button className="cursor-pointer rounded-xl border border-primary/60 px-3 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary" type="button" onClick={() => onOpen(content)}>
            Abrir pagina
          </button>
          {canEdit && (
            <Button variant="outline" className="px-3 py-2 text-sm" type="button" onClick={() => onEdit(content)}>
              <Pencil className="inline" size={15} /> Editar
            </Button>
          )}
          {isCoordinator && !isReadOnly && !content.published && (
            <Button variant="outline" className="px-3 py-2 text-sm" type="button" onClick={publish}>
              <CheckCircle2 className="inline" size={15} /> Publicar
            </Button>
          )}
          {isCoordinator && !isReadOnly && (
            <button
              className="grid size-10 cursor-pointer place-items-center rounded-xl border border-red-500/50 text-red-700 transition hover:border-red-500 hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:text-red-300 dark:hover:text-white"
              type="button"
              aria-label={`Excluir ${content.title}`}
              title="Excluir conteudo"
              onClick={remove}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
