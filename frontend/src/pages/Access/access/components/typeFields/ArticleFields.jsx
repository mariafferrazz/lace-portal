import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../../../components/ui/Button";
import { fieldClass, sectionClass } from "../../constants";
import RelationPicker from "../fields/RelationPicker";

function normalizedName(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

export default function ArticleFields({ form, actions, referenceOptions, canManageAuthors = false }) {
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorDescription, setAuthorDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [removingAuthorId, setRemovingAuthorId] = useState("");

  async function createAuthor() {
    if (!authorName.trim()) return;

    const existingAuthor = (referenceOptions.articleAuthors || [])
      .find((author) => normalizedName(author.title) === normalizedName(authorName));
    if (existingAuthor) {
      if (!form.articleAuthorIds.includes(existingAuthor.id)) {
        actions.toggleId("articleAuthorIds", existingAuthor.id);
      }
      setAuthorName("");
      setAuthorDescription("");
      setShowAuthorForm(false);
      return;
    }

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

  async function removeAuthor(author) {
    const articleCount = Number(author.articleCount || 0);
    const workMessage = articleCount === 0
      ? "Este autor ainda não possui artigos vinculados."
      : `${articleCount} ${articleCount === 1 ? "artigo está vinculado" : "artigos estão vinculados"} a este autor.`;
    const confirmed = window.confirm(
      `Remover "${author.title}"?\n\n${workMessage}\nOs artigos exclusivos serão excluídos. Artigos em coautoria serão preservados para os demais autores.`,
    );
    if (!confirmed) return;

    setRemovingAuthorId(author.id);
    try {
      await actions.removeArticleAuthor(author);
    } finally {
      setRemovingAuthorId("");
    }
  }

  return (
    <section className={sectionClass}>
      <div className="grid gap-5">
        <div>
          <h3 className="font-title text-2xl text-text">Autoria do artigo</h3>
          <p className="mt-1 text-sm font-normal leading-6 text-muted">Selecione uma ou mais autorias. Ao salvar o artigo, cada novo autor passa a aparecer na página de Artigos do site.</p>
        </div>
        <RelationPicker label="Autores cadastrados *" description={canManageAuthors ? "Marque a autoria deste artigo. A lixeira remove o autor e suas obras exclusivas." : "Marque a autoria deste artigo."} searchPlaceholder="Buscar autor pelo nome" options={referenceOptions.articleAuthors || []} selectedIds={form.articleAuthorIds} onToggle={(id) => actions.toggleId("articleAuthorIds", id)} onRemoveOption={canManageAuthors ? removeAuthor : undefined} removingOptionId={removingAuthorId} emptyMessage="Nenhum autor cadastrado. Use o botão Adicionar autor." />
        <div>
          <Button className="inline-flex min-w-56 flex-nowrap items-center justify-center gap-2 whitespace-nowrap" type="button" variant="outline" onClick={() => setShowAuthorForm((value) => !value)}><Plus className="shrink-0" size={15} /><span>Adicionar autor</span></Button>
          {showAuthorForm && <div className="mt-4 grid gap-4 rounded-2xl border border-border bg-background p-4"><label className="font-semibold">Nome do autor *<input className={fieldClass} value={authorName} onChange={(event) => setAuthorName(event.target.value)} /></label><label className="font-semibold">Descrição do autor (opcional)<textarea className={`${fieldClass} min-h-24 resize-y`} value={authorDescription} onChange={(event) => setAuthorDescription(event.target.value)} /></label><Button type="button" disabled={creating || !authorName.trim()} onClick={createAuthor}>{creating ? "Salvando autor..." : "Salvar autor e selecionar"}</Button></div>}
        </div>
        <div className="border-t border-border pt-5">
          <h3 className="font-title text-2xl text-text">Dados do artigo</h3>
        </div>
        <label className="font-semibold">Título do artigo *<input className={fieldClass} required maxLength={200} value={form.title} onChange={actions.update("title")} /></label>
        <label className="font-semibold">Link do artigo em PDF *<input className={fieldClass} type="url" required placeholder="https://...arquivo.pdf" value={form.pdfUrl} onChange={actions.update("pdfUrl")} /></label>
        <label className="font-semibold">Descrição<textarea className={`${fieldClass} min-h-36 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
      </div>
    </section>
  );
}
