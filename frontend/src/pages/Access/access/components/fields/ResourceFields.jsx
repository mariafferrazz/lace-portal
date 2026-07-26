import { fieldClass } from "../../constants";
import RepeatableGroup from "./RepeatableGroup";

export default function ResourceFields({ items, onAdd, onRemove, onChange }) {
  return (
    <RepeatableGroup
      title="Documentos, videos e links"
      description="Exemplo: Informe Publico. Adicione quantos recursos forem necessarios."
      items={items}
      onAdd={onAdd}
      onRemove={onRemove}
      addLabel="Recurso"
      renderItem={(item, index) => (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="font-semibold">Titulo<input className={fieldClass} value={item.title} onChange={(event) => onChange(index, "title", event.target.value)} /></label>
          <label className="font-semibold">Tipo<select className={fieldClass} value={item.kind} onChange={(event) => onChange(index, "kind", event.target.value)}><option value="DOCUMENT">Documento</option><option value="VIDEO">Video</option><option value="AUDIO">Audio</option><option value="LINK">Outro link</option></select></label>
          <label className="font-semibold md:col-span-2">URL<input className={fieldClass} type="url" placeholder="https://..." value={item.url} onChange={(event) => onChange(index, "url", event.target.value)} /></label>
        </div>
      )}
    />
  );
}
