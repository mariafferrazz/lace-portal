import { fieldClass } from "../../constants";
import RepeatableGroup from "./RepeatableGroup";

export default function PeopleFields({ title, description, items, onAdd, onRemove, onChange }) {
  return (
    <RepeatableGroup
      title={title}
      description={description}
      items={items}
      onAdd={onAdd}
      onRemove={onRemove}
      addLabel="Pessoa"
      renderItem={(person, index) => (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="font-semibold">Nome<input className={fieldClass} value={person.name} onChange={(event) => onChange(index, "name", event.target.value)} /></label>
          <label className="font-semibold">Função ou título<input className={fieldClass} placeholder="Pesquisador, coordenação, doutorando..." value={person.role} onChange={(event) => onChange(index, "role", event.target.value)} /></label>
          <label className="font-semibold md:col-span-2">Descrição<textarea className={`${fieldClass} min-h-28 resize-y`} value={person.description} onChange={(event) => onChange(index, "description", event.target.value)} /></label>
          <label className="font-semibold md:col-span-2">Link do Lattes ou perfil<input className={fieldClass} type="url" placeholder="https://..." value={person.lattesUrl} onChange={(event) => onChange(index, "lattesUrl", event.target.value)} /></label>
        </div>
      )}
    />
  );
}
