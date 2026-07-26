import { fieldClass, sectionClass } from "../../constants";
import ImageSourceField from "../fields/ImageSourceField";
import InfoFields from "../fields/InfoFields";
import PeopleFields from "../fields/PeopleFields";
import ResourceFields from "../fields/ResourceFields";

export default function ResearchFields({ form, actions }) {
  return (
    <section className={sectionClass}>
      <div className="grid gap-5">
        <ImageSourceField label="Imagem da pesquisa" values={form.imageUrls} onUrlChange={(index, value) => actions.updateUrlList("imageUrls", index, value)} onUrlAdd={() => actions.addUrl("imageUrls")} onUrlRemove={(index) => actions.removeUrl("imageUrls", index)} onFileChange={actions.updateImageFile} />
        <label className="font-semibold">Resumo da pesquisa<textarea className={`${fieldClass} min-h-40 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
        <PeopleFields title="Equipe" description="Nome, função, descrição e Lattes. Todos os campos são opcionais." items={form.researchTeam} onAdd={() => actions.addObject("researchTeam", actions.emptyPerson)} onRemove={(index) => actions.removeObject("researchTeam", index, actions.emptyPerson)} onChange={(index, field, value) => actions.updateObject("researchTeam", index, field, value)} />
        <InfoFields items={form.additionalInfo} onAdd={() => actions.addObject("additionalInfo", actions.emptyInfo)} onRemove={(index) => actions.removeObject("additionalInfo", index, actions.emptyInfo)} onChange={(index, field, value) => actions.updateObject("additionalInfo", index, field, value)} />
        <ResourceFields items={form.resources} onAdd={() => actions.addObject("resources", actions.emptyResource)} onRemove={(index) => actions.removeObject("resources", index, actions.emptyResource)} onChange={(index, field, value) => actions.updateObject("resources", index, field, value)} />
      </div>
    </section>
  );
}
