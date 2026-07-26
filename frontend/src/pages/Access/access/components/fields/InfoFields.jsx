import { fieldClass } from "../../constants";
import RepeatableGroup from "./RepeatableGroup";

export default function InfoFields({ items, onAdd, onRemove, onChange }) {
  return (
    <RepeatableGroup
      title="Informacoes adicionais"
      description="Use para comissao cientifica, financiamento, parceiros ou outras secoes."
      items={items}
      onAdd={onAdd}
      onRemove={onRemove}
      addLabel="Secao"
      renderItem={(item, index) => (
        <div className="grid gap-4">
          <label className="font-semibold">Titulo<input className={fieldClass} value={item.title} onChange={(event) => onChange(index, "title", event.target.value)} /></label>
          <label className="font-semibold">Descricao<textarea className={`${fieldClass} min-h-28 resize-y`} value={item.description} onChange={(event) => onChange(index, "description", event.target.value)} /></label>
        </div>
      )}
    />
  );
}
