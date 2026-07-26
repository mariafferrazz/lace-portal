import { alphabetOptions, fieldClass, sectionClass } from "../../constants";
import ImageSourceField from "../fields/ImageSourceField";
import RelationPicker from "../fields/RelationPicker";
import TextListField from "../fields/TextListField";

export default function GlossaryFields({ form, actions, referenceOptions }) {
  return (
    <section className={sectionClass}>
      <div className="grid gap-5">
        <label className="font-semibold">Letra do indice<select className={fieldClass} value={form.alphabetLetter} onChange={actions.update("alphabetLetter")}>{alphabetOptions.map((letter) => <option key={letter} value={letter}>{letter}</option>)}</select></label>
        <TextListField label="Autoria" values={form.authorNames} onChange={(index, value) => actions.updateTextList("authorNames", index, value)} onAdd={() => actions.addText("authorNames")} onRemove={(index) => actions.removeText("authorNames", index)} addButtonLabel="Autor" placeholder="Nome do autor" />
        <label className="font-semibold">Descricao completa<textarea className={`${fieldClass} min-h-56 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
        <ImageSourceField label="Imagens do verbete" values={form.imageUrls} onUrlChange={(index, value) => actions.updateUrlList("imageUrls", index, value)} onUrlAdd={() => actions.addUrl("imageUrls")} onUrlRemove={(index) => actions.removeUrl("imageUrls", index)} onFileChange={actions.updateImageFile} />
        <RelationPicker label="Filmes relacionados" description="Os filmes sao lidos diretamente do banco. Marque quantos forem necessarios." options={referenceOptions.films || []} selectedIds={form.relatedFilmIds} onToggle={(id) => actions.toggleId("relatedFilmIds", id)} />
        <TextListField label="Referencias bibliograficas" values={form.references} onChange={(index, value) => actions.updateTextList("references", index, value)} onAdd={() => actions.addText("references")} onRemove={(index) => actions.removeText("references", index)} addButtonLabel="Referencia" placeholder="Referencia completa" />
        <p className="text-sm leading-6 text-muted">O card usa uma descricao limitada; Ler verbete abre a pagina completa com imagens, filmes e referencias.</p>
      </div>
    </section>
  );
}
