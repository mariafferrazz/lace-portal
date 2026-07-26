import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../../components/ui/Button";
import { fieldClass, sectionClass } from "../../constants";
import RelationPicker from "../fields/RelationPicker";

export default function ArticleFields({ form, actions, referenceOptions }) {
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorDescription, setAuthorDescription] = useState("");
  const [creating, setCreating] = useState(false);

  async function createAuthor() {
    if (!authorName.trim()) return;
    setCreating(true);
    try {
      await actions.createArticleAuthor({ name: authorName, description: authorDescription });
      setAuthorName("");
      setAuthorDescription("");
      setShowAuthorForm(false);
    } catch {
      // A mensagem de erro e exibida pelo formulario principal.
    } finally {
      setCreating(false);
    }
  }

  return (
    <section className={sectionClass}>
      <div className="grid gap-5">
        <label className="font-semibold">Descrição<textarea className={`${fieldClass} min-h-36 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
        <label className="font-semibold">Link do artigo em PDF<input className={fieldClass} type="url" placeholder="https://...arquivo.pdf" value={form.pdfUrl} onChange={actions.update("pdfUrl")} /></label>
        <RelationPicker label="Autores" description="Marque um ou mais autores. A página de cada autor é criada como um conteúdo independente." options={referenceOptions.articleAuthors || []} selectedIds={form.articleAuthorIds} onToggle={(id) => actions.toggleId("articleAuthorIds", id)} emptyMessage="Nenhum autor cadastrado. Use o botão abaixo." />
        <div>
          <Button type="button" variant="outline" onClick={() => setShowAuthorForm((value) => !value)}><Plus size={15} /> Adicionar autor</Button>
          {showAuthorForm && <div className="mt-4 grid gap-4 rounded-2xl border border-border bg-background p-4"><label className="font-semibold">Nome do autor *<input className={fieldClass} value={authorName} onChange={(event) => setAuthorName(event.target.value)} /></label><label className="font-semibold">Descrição opcional<textarea className={`${fieldClass} min-h-24 resize-y`} value={authorDescription} onChange={(event) => setAuthorDescription(event.target.value)} /></label><Button type="button" disabled={creating || !authorName.trim()} onClick={createAuthor}>{creating ? "Criando..." : "Criar autor e selecionar"}</Button></div>}
        </div>
      </div>
    </section>
  );
}
