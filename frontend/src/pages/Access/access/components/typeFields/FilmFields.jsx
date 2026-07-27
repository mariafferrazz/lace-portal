import { alphabetOptions, fieldClass, sectionClass } from "../../constants";
import ImageSourceField from "../fields/ImageSourceField";

export default function FilmFields({ form, actions }) {
  return (
    <section className={sectionClass}>
      <div className="grid gap-5 md:grid-cols-3">
        <label className="font-semibold">Letra do índice<select className={fieldClass} value={form.alphabetLetter} onChange={actions.update("alphabetLetter")}>{alphabetOptions.map((letter) => <option key={letter} value={letter}>{letter}</option>)}</select></label>
        <label className="font-semibold">Direção<input className={fieldClass} value={form.direction} onChange={actions.update("direction")} /></label>
        <label className="font-semibold">Ano<input className={fieldClass} inputMode="numeric" pattern="[0-9]{4}" maxLength={4} placeholder="2011" value={form.filmYear} onChange={actions.update("filmYear")} /></label>
        <label className="font-semibold md:col-span-3">Link do filme<input className={fieldClass} type="url" placeholder="YouTube ou outro player público" value={form.videoUrl} onChange={actions.update("videoUrl")} /></label>
        <ImageSourceField className="md:col-span-3" label="Imagem do filme" values={form.imageUrls} onUrlChange={(index, value) => actions.updateUrlList("imageUrls", index, value)} onUrlAdd={() => actions.addUrl("imageUrls")} onUrlRemove={(index) => actions.removeUrl("imageUrls", index)} onFileChange={actions.updateImageFile} />
        <label className="font-semibold md:col-span-3">Resumo<textarea className={`${fieldClass} min-h-40 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
        <p className="text-sm leading-6 text-muted md:col-span-3">O banco guarda o resumo completo. No card público, o texto é resumido, e o botão “Ver mais” abre a página ou expande o conteúdo.</p>
      </div>
    </section>
  );
}
