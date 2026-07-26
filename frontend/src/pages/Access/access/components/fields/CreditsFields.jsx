import { fieldClass } from "../../constants";
import RepeatableGroup from "./RepeatableGroup";

export default function CreditsFields({ items, onAdd, onRemove, onChange }) {
  return (
    <RepeatableGroup
      title="Informacoes adicionais e creditos"
      description="Exemplo: titulo 'Musica e trilha sonora', informacao 'Samba da Guanabara' e a descricao do pesquisador. Campos vazios nao aparecem no site."
      items={items}
      onAdd={onAdd}
      onRemove={onRemove}
      addLabel="Informacao"
      renderItem={(item, index) => (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="font-semibold">Titulo<input className={fieldClass} placeholder="Musica e trilha sonora" value={item.title} onChange={(event) => onChange(index, "title", event.target.value)} /></label>
          <label className="font-semibold">Informacao<input className={fieldClass} placeholder="Samba da Guanabara, de..." value={item.value} onChange={(event) => onChange(index, "value", event.target.value)} /></label>
          <label className="font-semibold md:col-span-2">Descricao<textarea className={`${fieldClass} min-h-28 resize-y`} value={item.description} onChange={(event) => onChange(index, "description", event.target.value)} /></label>
          <label className="font-semibold md:col-span-2">Link relacionado<input className={fieldClass} type="url" placeholder="https://..." value={item.url} onChange={(event) => onChange(index, "url", event.target.value)} /></label>
        </div>
      )}
    />
  );
}
