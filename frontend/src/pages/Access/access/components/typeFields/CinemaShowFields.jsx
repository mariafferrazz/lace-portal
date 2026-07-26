import { fieldClass, sectionClass } from "../../constants";
import EventYearField from "../fields/EventYearField";
import ImageSourceField from "../fields/ImageSourceField";
import MultiUrlField from "../fields/MultiUrlField";
import RepeatableGroup from "../fields/RepeatableGroup";
import { formatDateInput } from "../../utils";

export default function CinemaShowFields({ form, actions, referenceOptions }) {
  const films = referenceOptions.films || [];

  function selectFilm(index, filmId) {
    const film = films.find((item) => item.id === filmId);
    actions.updateObject("sessions", index, "filmId", filmId);
    actions.updateObject("sessions", index, "filmUrl", film?.url || "");
    actions.updateObject("sessions", index, "addFilmToDatabase", false);
  }

  return (
    <section className={sectionClass}>
      <div className="grid gap-5 md:grid-cols-2">
        <EventYearField value={form.eventYear} onYearChange={actions.update("eventYear")} label="Ano da mostra *" />
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/30 bg-background p-4 font-semibold transition hover:border-primary">
          <input className="mt-1 size-5 accent-primary" type="checkbox" checked={form.createCinemaPage} onChange={actions.updateCheckbox("createCinemaPage")} />
          <span>Criar página em Cinema e Ditadura<span className="mt-1 block text-sm font-normal leading-6 text-muted">O card em Eventos apontará para esta página, em vez de abrir somente um modal.</span></span>
        </label>
        <ImageSourceField className="md:col-span-2" label="Imagem da mostra" values={form.imageUrls} onUrlChange={(index, value) => actions.updateUrlList("imageUrls", index, value)} onUrlAdd={() => actions.addUrl("imageUrls")} onUrlRemove={(index) => actions.removeUrl("imageUrls", index)} onFileChange={actions.updateImageFile} />
        <MultiUrlField className="md:col-span-2" label="Playlist da mostra" values={form.playlistUrls} onChange={(index, value) => actions.updateUrlList("playlistUrls", index, value)} onAdd={() => actions.addUrl("playlistUrls")} onRemove={(index) => actions.removeUrl("playlistUrls", index)} />
        <label className="font-semibold md:col-span-2">Descrição<textarea className={`${fieldClass} min-h-40 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
        <p className="text-sm leading-6 text-muted md:col-span-2">Ao ser publicada, a mostra entra automaticamente em Destaques, em Eventos do ano informado e, com a opcao acima marcada, no menu Cinema e Ditadura.</p>
      </div>

      <div className="mt-5">
        <RepeatableGroup
          title="Calendário e sessões"
          description="Selecione um filme do acervo ou informe um novo filme e marque a opcao para cadastra-lo no banco."
          items={form.sessions}
          onAdd={() => actions.addObject("sessions", actions.emptySession)}
          onRemove={(index) => actions.removeObject("sessions", index, actions.emptySession)}
          addLabel="Sessão"
          renderItem={(session, index) => (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="font-semibold">Data<input className={fieldClass} inputMode="numeric" placeholder="dd/mm/aaaa" maxLength={10} value={session.date} onChange={(event) => actions.updateObject("sessions", index, "date", formatDateInput(event.target.value))} /></label>
              <label className="font-semibold">Filme do acervo
                <select className={fieldClass} value={session.filmId} onChange={(event) => selectFilm(index, event.target.value)}>
                  <option value="">Selecione um filme ou cadastre abaixo</option>
                  {films.map((film) => <option key={film.id} value={film.id}>{film.title}</option>)}
                </select>
              </label>
              <label className="font-semibold md:col-span-2">Título do filme/sessão<input className={fieldClass} placeholder="Nome do filme" value={session.title} onChange={(event) => actions.updateObject("sessions", index, "title", event.target.value)} /></label>
              <label className="font-semibold md:col-span-2">URL do filme<input className={fieldClass} type="url" placeholder="https://..." value={session.filmUrl} onChange={(event) => actions.updateObject("sessions", index, "filmUrl", event.target.value)} /></label>
              {!session.filmId && (
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/30 bg-background p-4 font-semibold md:col-span-2">
                  <input className="mt-1 size-5 accent-primary" type="checkbox" checked={session.addFilmToDatabase} onChange={(event) => actions.updateObject("sessions", index, "addFilmToDatabase", event.target.checked)} />
                  <span>Adicionar esse filme ao banco de dados<span className="mt-1 block text-sm font-normal text-muted">O filme será cadastrado no acervo e vinculado automaticamente a esta sessão.</span></span>
                </label>
              )}
              <label className="font-semibold md:col-span-2">Direção ou debate<input className={fieldClass} value={session.direction} onChange={(event) => actions.updateObject("sessions", index, "direction", event.target.value)} /></label>
              <MultiUrlField className="md:col-span-2" label="Link do vídeo da sessão" values={session.sessionUrls} onChange={(urlIndex, value) => actions.updateNestedUrlList("sessions", index, "sessionUrls", urlIndex, value)} onAdd={() => actions.addNestedUrl("sessions", index, "sessionUrls")} onRemove={(urlIndex) => actions.removeNestedUrl("sessions", index, "sessionUrls", urlIndex)} />
            </div>
          )}
        />
      </div>
    </section>
  );
}
