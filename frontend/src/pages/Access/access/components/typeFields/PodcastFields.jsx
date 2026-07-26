import { fieldClass, sectionClass } from "../../constants";
import CreditsFields from "../fields/CreditsFields";
import ImageSourceField from "../fields/ImageSourceField";
import PeopleFields from "../fields/PeopleFields";
import RepeatableGroup from "../fields/RepeatableGroup";

export default function PodcastFields({ form, actions }) {
  return (
    <section className={sectionClass}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="font-semibold md:col-span-2">Link principal do podcast<input className={fieldClass} type="url" placeholder="Spotify, YouTube ou player publico" value={form.podcastUrl} onChange={actions.update("podcastUrl")} /></label>
        <ImageSourceField className="md:col-span-2" label="Imagem de capa" values={form.imageUrls} onUrlChange={(index, value) => actions.updateUrlList("imageUrls", index, value)} onUrlAdd={() => actions.addUrl("imageUrls")} onUrlRemove={(index) => actions.removeUrl("imageUrls", index)} onFileChange={actions.updateImageFile} />
        <label className="font-semibold md:col-span-2">Descricao<textarea className={`${fieldClass} min-h-36 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
      </div>
      <div className="mt-5 space-y-5">
        <RepeatableGroup title="Episodios" description="O botao Abrir episodios no site usa esta lista. Novos episodios podem ser acrescentados durante a producao." items={form.episodes} onAdd={() => actions.addObject("episodes", actions.emptyEpisode)} onRemove={(index) => actions.removeObject("episodes", index, actions.emptyEpisode)} addLabel="Episodio" renderItem={(episode, index) => <div className="grid gap-4 md:grid-cols-2"><label className="font-semibold">Titulo<input className={fieldClass} value={episode.title} onChange={(event) => actions.updateObject("episodes", index, "title", event.target.value)} /></label><label className="font-semibold">Link<input className={fieldClass} type="url" placeholder="https://..." value={episode.url} onChange={(event) => actions.updateObject("episodes", index, "url", event.target.value)} /></label><label className="font-semibold md:col-span-2">Descricao<textarea className={`${fieldClass} min-h-24 resize-y`} value={episode.description} onChange={(event) => actions.updateObject("episodes", index, "description", event.target.value)} /></label></div>} />
        <PeopleFields title="Pesquisadores e participantes" description="Cadastre as pessoas relacionadas ao podcast." items={form.people} onAdd={() => actions.addObject("people", actions.emptyPerson)} onRemove={(index) => actions.removeObject("people", index, actions.emptyPerson)} onChange={(index, field, value) => actions.updateObject("people", index, field, value)} />
        <CreditsFields items={form.credits} onAdd={() => actions.addObject("credits", actions.emptyCredit)} onRemove={(index) => actions.removeObject("credits", index, actions.emptyCredit)} onChange={(index, field, value) => actions.updateObject("credits", index, field, value)} />
      </div>
    </section>
  );
}
