import { fieldClass, sectionClass } from "../../constants";
import ImageSourceField from "../fields/ImageSourceField";
import TextListField from "../fields/TextListField";

export default function ViralEscapeFields({ form, actions }) {
  return (
    <section className={sectionClass}>
      <div className="grid gap-5">
        <TextListField label="Autoria" values={form.authorNames} onChange={(index, value) => actions.updateTextList("authorNames", index, value)} onAdd={() => actions.addText("authorNames")} onRemove={(index) => actions.removeText("authorNames", index)} addButtonLabel="Autor" placeholder="Nome do autor" />
        <ImageSourceField label="Imagem do card" values={form.imageUrls} onUrlChange={(index, value) => actions.updateUrlList("imageUrls", index, value)} onUrlAdd={() => actions.addUrl("imageUrls")} onUrlRemove={(index) => actions.removeUrl("imageUrls", index)} onFileChange={actions.updateImageFile} />
        <label className="font-semibold">Texto completo<textarea className={`${fieldClass} min-h-72 resize-y`} value={form.bodyText} onChange={actions.update("bodyText")} /></label>
        <label className="font-semibold">Descricao curta do card<textarea className={`${fieldClass} min-h-28 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
      </div>
    </section>
  );
}
