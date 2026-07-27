import { fieldClass, sectionClass } from "../../constants";
import ImageSourceField from "../fields/ImageSourceField";
import TextListField from "../fields/TextListField";

export default function ViralEscapeFields({ form, actions }) {
  return (
    <section className={sectionClass}>
      <div className="grid gap-5">
        <TextListField label="Autoria literária" values={form.viralAuthorNames} onChange={(index, value) => actions.updateTextList("viralAuthorNames", index, value)} onAdd={() => actions.addText("viralAuthorNames")} onRemove={(index) => actions.removeText("viralAuthorNames", index)} addButtonLabel="Autor" placeholder="Nome do autor ou autora da obra" />
        <p className="-mt-3 text-sm leading-6 text-muted">Esta autoria pertence somente à obra literária e não cria vínculos com o menu de autores de artigos.</p>
        <ImageSourceField label="Imagens da obra" values={form.imageUrls} onUrlChange={(index, value) => actions.updateUrlList("imageUrls", index, value)} onUrlAdd={() => actions.addUrl("imageUrls")} onUrlRemove={(index) => actions.removeUrl("imageUrls", index)} onFileChange={actions.updateImageFile} />
        <p className="-mt-3 text-sm leading-6 text-muted">A primeira imagem será usada como capa do card. As demais aparecerão dentro da obra.</p>
        <label className="font-semibold">Texto completo<textarea className={`${fieldClass} min-h-72 resize-y`} value={form.bodyText} onChange={actions.update("bodyText")} /></label>
        <label className="font-semibold">Descrição do autor ou autora<textarea className={`${fieldClass} min-h-28 resize-y`} value={form.viralAuthorBio} onChange={actions.update("viralAuthorBio")} /></label>
      </div>
    </section>
  );
}
