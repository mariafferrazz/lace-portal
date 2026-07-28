import { emptyRelatedLink, fieldClass, sectionClass } from "../../constants";
import EventYearField from "../fields/EventYearField";
import ImageSourceField from "../fields/ImageSourceField";
import NamedLinksField from "../fields/NamedLinksField";

export default function EventFields({ form, actions }) {
  return (
    <section className={sectionClass}>
      <div className="grid gap-5 md:grid-cols-2">
        <EventYearField value={form.eventYear} onYearChange={actions.update("eventYear")} label="Ano do evento *" />
        <ImageSourceField label="Imagem do evento" values={form.imageUrls} onUrlChange={(index, value) => actions.updateUrlList("imageUrls", index, value)} onUrlAdd={() => actions.addUrl("imageUrls")} onUrlRemove={(index) => actions.removeUrl("imageUrls", index)} onFileChange={actions.updateImageFile} />
        <label className="font-semibold md:col-span-2">Descrição<textarea className={`${fieldClass} min-h-40 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
        <NamedLinksField
          className="md:col-span-2"
          items={form.relatedLinks}
          onChange={(index, field, value) => actions.updateObject("relatedLinks", index, field, value)}
          onAdd={() => actions.addObject("relatedLinks", emptyRelatedLink)}
          onRemove={(index) => actions.removeObject("relatedLinks", index, emptyRelatedLink)}
        />
        <p className="text-sm leading-6 text-muted md:col-span-2">Ao ser publicado, este evento entra automaticamente em Destaques e na página Eventos do ano informado. Outros eventos usam detalhes em modal; mostras usam página própria e são cadastradas no tipo Mostra Cinema e Ditadura.</p>
      </div>
    </section>
  );
}
