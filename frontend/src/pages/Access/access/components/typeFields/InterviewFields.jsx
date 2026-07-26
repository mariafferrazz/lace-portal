import { fieldClass, sectionClass } from "../../constants";
import CreditsFields from "../fields/CreditsFields";
import ImageSourceField from "../fields/ImageSourceField";
import PeopleFields from "../fields/PeopleFields";

export default function InterviewFields({ form, actions }) {
  return (
    <section className={sectionClass}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="font-semibold md:col-span-2">Link do video<input className={fieldClass} type="url" placeholder="YouTube, Vimeo ou outro player publico" value={form.videoUrl} onChange={actions.update("videoUrl")} /></label>
        <ImageSourceField className="md:col-span-2" label="Imagem de capa" values={form.imageUrls} onUrlChange={(index, value) => actions.updateUrlList("imageUrls", index, value)} onUrlAdd={() => actions.addUrl("imageUrls")} onUrlRemove={(index) => actions.removeUrl("imageUrls", index)} onFileChange={actions.updateImageFile} />
        <label className="font-semibold md:col-span-2">Descricao<textarea className={`${fieldClass} min-h-36 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
      </div>
      <div className="mt-5 space-y-5">
        <PeopleFields title="Pesquisadores e participantes" description="Cadastre nome, funcao, descricao e Lattes. Campos vazios serao ignorados." items={form.people} onAdd={() => actions.addObject("people", actions.emptyPerson)} onRemove={(index) => actions.removeObject("people", index, actions.emptyPerson)} onChange={(index, field, value) => actions.updateObject("people", index, field, value)} />
        <CreditsFields items={form.credits} onAdd={() => actions.addObject("credits", actions.emptyCredit)} onRemove={(index) => actions.removeObject("credits", index, actions.emptyCredit)} onChange={(index, field, value) => actions.updateObject("credits", index, field, value)} />
      </div>
    </section>
  );
}
