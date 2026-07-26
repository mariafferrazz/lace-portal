import { FolderUp } from "lucide-react";
import MultiUrlField from "./MultiUrlField";

export default function ImageSourceField({
  label,
  values,
  onUrlChange,
  onUrlAdd,
  onUrlRemove,
  onFileChange,
  className = "",
}) {
  return (
    <div className={`font-semibold ${className}`}>
      <MultiUrlField
        label={`${label} por URL`}
        values={values}
        onChange={onUrlChange}
        onAdd={onUrlAdd}
        onRemove={onUrlRemove}
      />

      <label className="mt-3 block">
        Ou selecionar imagem do PC
        <span className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 px-5 py-7 text-center transition hover:border-primary hover:bg-primary/10 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <FolderUp className="text-primary" size={34} aria-hidden="true" />
          <span className="mt-3 text-base font-semibold text-text">Escolher imagem do computador</span>
          <span className="mt-2 max-w-xl text-sm font-normal leading-6 text-muted">
            Use JPG, PNG ou WEBP. Para imagens muito grandes, prefira uma URL publica.
          </span>
          <input
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
          />
        </span>
      </label>
    </div>
  );
}
