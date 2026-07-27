import { Upload } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { contentAreas, contentTypes, fieldClass } from "../constants";
import useContentForm from "../hooks/useContentForm";
import ContentTypeFields from "./typeFields/ContentTypeFields";

export default function ContentForm({ onCreated, initialArea = "CINEMA_DITADURA", initialType, onClose, content = null, teamMembers = [], referenceOptions = {}, onReferenceCreated, canManageAuthors = false }) {
  const actions = useContentForm({ content, initialArea, initialType, onCreated, onClose, teamMembers, onReferenceCreated });
  const { form, status, loading, isEditing, submit } = actions;

  return (
    <section className="rounded-3xl border border-border bg-card p-6 md:p-9">
      <div className="flex items-center gap-3 text-primary"><Upload aria-hidden="true" /><h2 className="font-title text-3xl text-text">{isEditing ? "Editar conteúdo" : "Novo conteúdo"}</h2></div>
      <p className="mt-3 text-muted">Cada tipo mostra apenas os campos usados pela página pública. Campos opcionais vazios não serão renderizados.</p>

      <form className="mt-7 grid gap-5 md:grid-cols-2" onSubmit={submit}>
        <label className="font-semibold">Área editorial *<select className={fieldClass} required value={form.area} onChange={actions.updateArea}>{contentAreas.map((area) => <option key={area.value} value={area.value}>{area.label}</option>)}</select></label>
        <label className="font-semibold">Tipo de conteúdo *<select className={fieldClass} required value={form.type} onChange={actions.updateType}>{contentTypes.filter(([value]) => contentAreas.find((area) => area.value === form.area)?.types.includes(value)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        {form.type !== "ARTICLE" && (
          <label className="font-semibold md:col-span-2">Título *<input className={fieldClass} required maxLength={200} placeholder={form.type === "CINEMA_SHOW" ? "VIII Mostra Cinema e Ditadura" : ""} value={form.title} onChange={actions.update("title")} /></label>
        )}

        <ContentTypeFields form={form} actions={actions} referenceOptions={referenceOptions} canManageAuthors={canManageAuthors} />

        <label className="font-semibold md:col-span-2">Responsável pelo cadastro<select className={fieldClass} value={form.researcherMemberId} onChange={actions.updateResearcher}><option value="">Equipe LACE / não informar</option>{teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}{form.researcherMemberId.startsWith("name:") && <option value={form.researcherMemberId}>{form.researcherName}</option>}</select></label>

        <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center"><Button type="submit" disabled={loading} className="disabled:cursor-wait disabled:opacity-60">{loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Enviar para revisão"}</Button>{status && <p className={status.ok ? "text-sm font-semibold text-green-700 dark:text-green-300" : "text-sm font-semibold text-red-700 dark:text-red-300"} role="status">{status.message}</p>}</div>
      </form>
    </section>
  );
}
