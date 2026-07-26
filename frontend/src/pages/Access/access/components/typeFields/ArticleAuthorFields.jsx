import { fieldClass, sectionClass } from "../../constants";
import ImageSourceField from "../fields/ImageSourceField";

export default function ArticleAuthorFields({ form, actions }) {
  return (
    <section className={sectionClass}>
      <div className="grid gap-5">
        <ImageSourceField label="Foto ou imagem do autor" values={form.imageUrls} onUrlChange={(index, value) => actions.updateUrlList("imageUrls", index, value)} onUrlAdd={() => actions.addUrl("imageUrls")} onUrlRemove={(index) => actions.removeUrl("imageUrls", index)} onFileChange={actions.updateImageFile} />
        <label className="font-semibold">Biografia ou descricao<textarea className={`${fieldClass} min-h-36 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
        <p className="text-sm leading-6 text-muted">Ao publicar, o autor entra automaticamente na navegacao de Artigos e recebe uma pagina dinamica propria.</p>
      </div>
    </section>
  );
}
