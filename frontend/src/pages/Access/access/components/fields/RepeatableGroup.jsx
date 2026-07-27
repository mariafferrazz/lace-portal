import { Plus, Trash2 } from "lucide-react";
import Button from "../../../../../components/ui/Button";

export default function RepeatableGroup({ title, description, items, onAdd, onRemove, renderItem, addLabel = "Adicionar" }) {
  return (
    <section className="rounded-2xl border border-border bg-card/70 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="font-title text-xl text-text">{title}</h4>
          {description && <p className="mt-1 text-sm leading-6 text-muted">{description}</p>}
        </div>
        <Button type="button" variant="outline" className="inline-flex min-w-56 flex-none flex-nowrap items-center justify-center gap-2 self-start whitespace-nowrap" onClick={onAdd}>
          <Plus className="shrink-0" size={15} aria-hidden="true" /> <span>{addLabel}</span>
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <article key={index} className="relative rounded-2xl border border-border bg-background p-4">
            <button
              type="button"
              className="absolute right-3 top-3 rounded-xl border border-red-500/40 p-2 text-red-700 transition hover:bg-red-500/10 dark:text-red-300"
              onClick={() => onRemove(index)}
              aria-label={`Remover item ${index + 1}`}
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
            <div className="pr-12">{renderItem(item, index)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
