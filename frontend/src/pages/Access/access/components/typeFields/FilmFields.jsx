import { alphabetOptions, fieldClass, sectionClass } from "../../constants";
import ImageSourceField from "../fields/ImageSourceField";

export default function FilmFields({ form, actions }) {
  return (
    <section className={sectionClass}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="font-semibold">Letra do indice<select className={fieldClass} value={form.alphabetLetter} onChange={actions.update("alphabetLetter")}>{alphabetOptions.map((letter) => <option key={letter} value={letter}>{letter}</option>)}</select></label>
        <label className="font-semibold">Direcao<input className={fieldClass} value={form.direction} onChange={actions.update("direction")} /></label>
        <label className="font-semibold md:col-span-2">Link do filme<input className={fieldClass} type="url" placeholder="YouTube ou outro player publico" value={form.videoUrl} onChange={actions.update("videoUrl")} /></label>
        <ImageSourceField className="md:col-span-2" label="Imagem do filme" values={form.imageUrls} onUrlChange={(index, value) => actions.updateUrlList("imageUrls", index, value)} onUrlAdd={() => actions.addUrl("imageUrls")} onUrlRemove={(index) => actions.removeUrl("imageUrls", index)} onFileChange={actions.updateImageFile} />
        <label className="font-semibold md:col-span-2">Resumo<textarea className={`${fieldClass} min-h-40 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
        <p className="text-sm leading-6 text-muted md:col-span-2">O banco guarda o resumo completo. No card publico, o texto deve usar line-clamp e o botao Ver mais abre a pagina ou expande o conteudo.</p>
      </div>
    </section>
  );
}
