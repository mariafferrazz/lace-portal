import { Plus, X } from "lucide-react";
import { fieldClass } from "../../constants";

export default function NamedLinksField({ items, onChange, onAdd, onRemove, className = "" }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-text">Links relacionados</h3>
          <p className="mt-1 text-sm leading-6 text-muted">Dê um nome a cada botão, como Inscrição, Instagram, Site ou Programação.</p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-primary/60 px-3 py-1 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary"
          onClick={onAdd}
        >
          <Plus size={14} aria-hidden="true" /> Adicionar link
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl border border-border bg-background p-4 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)_auto] md:items-end">
            <label className="font-semibold">
              Nome do link
              <input
                className={fieldClass}
                placeholder="Ex.: Inscrição"
                value={item.name}
                onChange={(event) => onChange(index, "name", event.target.value)}
              />
            </label>
            <label className="font-semibold">
              URL
              <input
                className={fieldClass}
                type="text"
                inputMode="url"
                placeholder="https://... ou /pagina-do-site"
                value={item.url}
                onChange={(event) => onChange(index, "url", event.target.value)}
              />
            </label>
            <button
              type="button"
              className="grid size-12 cursor-pointer place-items-center rounded-xl border border-red-500/40 text-red-700 transition hover:border-red-500 hover:bg-red-600 hover:text-white dark:text-red-300"
              onClick={() => onRemove(index)}
              aria-label={`Remover link ${index + 1}`}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
