import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { compactFieldClass } from "../../constants";

export default function RelationPicker({ label, description, options = [], selectedIds = [], onToggle, onRemoveOption, removingOptionId = "", emptyMessage = "Nenhum item cadastrado.", searchPlaceholder = "Buscar pelo título" }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? options.filter((option) => option.title.toLowerCase().includes(term)) : options;
  }, [options, query]);

  return (
    <div className="font-semibold">
      <span>{label}</span>
      {description && <p className="mt-1 text-sm font-normal leading-6 text-muted">{description}</p>}
      <label className="relative mt-3 block">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={17} />
        <input className={`${compactFieldClass} pl-10`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} />
      </label>
      <div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-2xl border border-border bg-background p-3">
        {visible.length === 0 ? (
          <p className="text-sm font-normal text-muted">{emptyMessage}</p>
        ) : visible.map((option) => (
          <div key={option.id} className="flex items-start gap-2 rounded-xl border border-transparent p-2 font-normal transition hover:border-primary/30 hover:bg-primary/5">
            <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
              <input className="mt-1 size-4 shrink-0 accent-primary" type="checkbox" checked={selectedIds.includes(option.id)} onChange={() => onToggle(option.id)} />
              <span className="min-w-0">
                <span className="block font-semibold text-text">{option.title}</span>
                {option.subtitle && <span className="mt-1 block text-xs text-muted">{option.subtitle}</span>}
              </span>
            </label>
            {onRemoveOption && (
              <button
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-red-500/50 text-red-700 transition hover:border-red-500 hover:bg-red-600 hover:text-white disabled:cursor-wait disabled:opacity-50 dark:text-red-300 dark:hover:text-white"
                type="button"
                aria-label={`Remover ${option.title} e suas obras`}
                title="Remover autor e suas obras"
                disabled={removingOptionId === option.id}
                onClick={() => onRemoveOption(option)}
              >
                <Trash2 size={17} aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
