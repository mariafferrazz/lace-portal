import { Plus, X } from "lucide-react";
import { fieldClass } from "../../constants";

export default function MultiUrlField({
  label,
  values,
  onChange,
  onAdd,
  onRemove,
  className = "",
  inputType = "url",
  placeholder = "https://...",
  addButtonLabel = "URL",
}) {
  return (
    <div className={`font-semibold ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-primary/60 px-3 py-1 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary"
          onClick={onAdd}
        >
          <Plus size={14} aria-hidden="true" /> {addButtonLabel}
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              className={fieldClass}
              type={value?.startsWith("data:image/") ? "text" : inputType}
              placeholder={placeholder}
              value={value}
              onChange={(event) => onChange(index, event.target.value)}
            />
            <button
              type="button"
              className="mt-2 grid size-12 shrink-0 cursor-pointer place-items-center rounded-xl border border-red-500/40 text-red-700 transition hover:border-red-500 hover:bg-red-600 hover:text-white dark:text-red-300"
              onClick={() => onRemove(index)}
              aria-label={`Remover item ${index + 1}`}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
