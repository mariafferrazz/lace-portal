import { fieldClass } from "../../constants";
import RepeatableGroup from "./RepeatableGroup";

export default function CreditsFields({ items, onAdd, onRemove, onChange }) {
  return (
    <RepeatableGroup
      title="Informações adicionais e créditos"
      description="Exemplo: título 'Música e trilha sonora', informação 'Samba da Guanabara' e a descrição do pesquisador. Campos vazios não aparecem no site."
      items={items}
      onAdd={onAdd}
      onRemove={onRemove}
      addLabel="Informação"
      renderItem={(item, index) => (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="font-semibold">Título<input className={fieldClass} placeholder="Música e trilha sonora" value={item.title} onChange={(event) => onChange(index, "title", event.target.value)} /></label>
          <label className="font-semibold">Informação<input className={fieldClass} placeholder="Samba da Guanabara, de..." value={item.value} onChange={(event) => onChange(index, "value", event.target.value)} /></label>
          <label className="font-semibold md:col-span-2">Descrição<textarea className={`${fieldClass} min-h-28 resize-y`} value={item.description} onChange={(event) => onChange(index, "description", event.target.value)} /></label>
          <label className="font-semibold md:col-span-2">Link relacionado<input className={fieldClass} type="url" placeholder="https://..." value={item.url} onChange={(event) => onChange(index, "url", event.target.value)} /></label>
        </div>
      )}
    />
  );
}
