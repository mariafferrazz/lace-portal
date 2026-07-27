import { fieldClass, sectionClass } from "../../constants";
import EventYearField from "../fields/EventYearField";
import ImageSourceField from "../fields/ImageSourceField";
import MultiUrlField from "../fields/MultiUrlField";
import RepeatableGroup from "../fields/RepeatableGroup";
import { formatDateInput } from "../../utils";

export default function CinemaShowFields({ form, actions, referenceOptions }) {
  const films = referenceOptions.films || [];

  function updateFilm(sessionIndex, filmIndex, key, value) {
    actions.updateNestedObject("sessions", sessionIndex, "films", filmIndex, key, value);
  }

  function selectFilm(sessionIndex, filmIndex, filmId) {
    const film = films.find((item) => item.id === filmId);
    updateFilm(sessionIndex, filmIndex, "filmId", filmId);
    updateFilm(sessionIndex, filmIndex, "filmUrl", film?.url || "");
    updateFilm(sessionIndex, filmIndex, "title", film?.title || "");
    updateFilm(sessionIndex, filmIndex, "direction", film?.direction || "");
    updateFilm(sessionIndex, filmIndex, "year", film?.year || "");
    updateFilm(sessionIndex, filmIndex, "addToDatabase", false);
  }

  function toggleNewFilm(sessionIndex, filmIndex, checked) {
    updateFilm(sessionIndex, filmIndex, "addToDatabase", checked);
    updateFilm(sessionIndex, filmIndex, "filmId", "");
    updateFilm(sessionIndex, filmIndex, "filmUrl", "");
    updateFilm(sessionIndex, filmIndex, "title", "");
    updateFilm(sessionIndex, filmIndex, "direction", "");
    updateFilm(sessionIndex, filmIndex, "year", "");
  }

  return (
    <section className={sectionClass}>
      <div className="grid gap-5 md:grid-cols-2">
        <EventYearField value={form.eventYear} onYearChange={actions.update("eventYear")} label="Ano da mostra *" />
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/30 bg-background p-4 font-semibold transition hover:border-primary">
          <input className="mt-1 size-5 accent-primary" type="checkbox" checked={form.createCinemaPage} onChange={actions.updateCheckbox("createCinemaPage")} />
          <span>Criar página em Cinema e Ditadura</span>
        </label>
        <ImageSourceField className="md:col-span-2" label="Imagem da mostra" values={form.imageUrls} onUrlChange={(index, value) => actions.updateUrlList("imageUrls", index, value)} onUrlAdd={() => actions.addUrl("imageUrls")} onUrlRemove={(index) => actions.removeUrl("imageUrls", index)} onFileChange={actions.updateImageFile} />
        <MultiUrlField className="md:col-span-2" label="Playlist da mostra" values={form.playlistUrls} onChange={(index, value) => actions.updateUrlList("playlistUrls", index, value)} onAdd={() => actions.addUrl("playlistUrls")} onRemove={(index) => actions.removeUrl("playlistUrls", index)} />
        <label className="font-semibold md:col-span-2">Descrição<textarea className={`${fieldClass} min-h-40 resize-y`} value={form.description} onChange={actions.update("description")} /></label>
        <p className="text-sm leading-6 text-muted md:col-span-2">Ao ser publicada, a mostra entra automaticamente em Destaques, em Eventos do ano informado e, com a opção acima marcada, no menu Cinema e Ditadura.</p>
      </div>

      <div className="mt-5">
        <RepeatableGroup
          title="Calendário e sessões"
          description="Cada sessão pode reunir quantos filmes forem necessários. Selecione filmes do acervo ou marque a opção para cadastrar um novo."
          items={form.sessions}
          onAdd={() => actions.addObject("sessions", actions.emptySession)}
          onRemove={(index) => actions.removeObject("sessions", index, actions.emptySession)}
          addLabel="Adicionar sessão"
          renderItem={(session, sessionIndex) => (
            <div className="flex min-w-0 flex-col gap-5">
              <div className="grid min-w-0 gap-4 md:grid-cols-2">
                <label className="font-semibold">Data<input className={fieldClass} inputMode="numeric" placeholder="dd/mm/aaaa" maxLength={10} value={session.date} onChange={(event) => actions.updateObject("sessions", sessionIndex, "date", formatDateInput(event.target.value))} /></label>
                <label className="font-semibold">Título da sessão <span className="font-normal text-muted">(opcional)</span><input className={fieldClass} placeholder="Ex.: Debate com realizadores" value={session.title} onChange={(event) => actions.updateObject("sessions", sessionIndex, "title", event.target.value)} /></label>
              </div>

              <div className="min-w-0 w-full">
                <RepeatableGroup
                  title="Filmes desta sessão"
                  description="No calendário público, cada filme terá seu próprio botão: Assistir ao filme 1, 2, 3 e assim por diante."
                  items={session.films}
                  onAdd={() => actions.addNestedObject("sessions", sessionIndex, "films", actions.emptySessionFilm)}
                  onRemove={(filmIndex) => actions.removeNestedObject("sessions", sessionIndex, "films", filmIndex, actions.emptySessionFilm)}
                  addLabel="Adicionar outro filme"
                  renderItem={(sessionFilm, filmIndex) => (
                    <div className="grid gap-4 md:grid-cols-2">
                    <label className="font-semibold md:col-span-2">Filme do acervo
                      <select
                        className={`${fieldClass} ${sessionFilm.addToDatabase ? "cursor-not-allowed opacity-60" : ""}`}
                        value={sessionFilm.filmId}
                        disabled={sessionFilm.addToDatabase}
                        onChange={(event) => selectFilm(sessionIndex, filmIndex, event.target.value)}
                      >
                        <option value="">Selecione um filme</option>
                        {films.map((film) => <option key={film.id} value={film.id}>{film.title}</option>)}
                      </select>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/30 bg-card p-4 font-semibold md:col-span-2">
                      <input
                        className="mt-1 size-5 accent-primary"
                        type="checkbox"
                        checked={sessionFilm.addToDatabase}
                        onChange={(event) => toggleNewFilm(sessionIndex, filmIndex, event.target.checked)}
                      />
                      <span>Cadastrar novo filme<span className="mt-1 block text-sm font-normal text-muted">Abre os campos abaixo, cadastra o filme no acervo e o vincula automaticamente a esta sessão.</span></span>
                    </label>

                    {(sessionFilm.addToDatabase || sessionFilm.filmId) && (
                      <>
                        <label className="font-semibold md:col-span-2">Título do filme<input className={`${fieldClass} ${sessionFilm.filmId ? "cursor-not-allowed opacity-70" : ""}`} readOnly={Boolean(sessionFilm.filmId)} placeholder="Nome do filme" value={sessionFilm.title} onChange={(event) => updateFilm(sessionIndex, filmIndex, "title", event.target.value)} /></label>
                        <label className="font-semibold md:col-span-2">URL do filme<input className={`${fieldClass} ${sessionFilm.filmId ? "cursor-not-allowed opacity-70" : ""}`} readOnly={Boolean(sessionFilm.filmId)} type="url" placeholder="https://..." value={sessionFilm.filmUrl} onChange={(event) => updateFilm(sessionIndex, filmIndex, "filmUrl", event.target.value)} /></label>
                        <label className="font-semibold">Direção<input className={`${fieldClass} ${sessionFilm.filmId ? "cursor-not-allowed opacity-70" : ""}`} readOnly={Boolean(sessionFilm.filmId)} value={sessionFilm.direction} onChange={(event) => updateFilm(sessionIndex, filmIndex, "direction", event.target.value)} /></label>
                        <label className="font-semibold">Ano<input className={`${fieldClass} ${sessionFilm.filmId ? "cursor-not-allowed opacity-70" : ""}`} readOnly={Boolean(sessionFilm.filmId)} inputMode="numeric" pattern="[0-9]{4}" maxLength={4} placeholder="2011" value={sessionFilm.year} onChange={(event) => updateFilm(sessionIndex, filmIndex, "year", event.target.value)} /></label>
                        {sessionFilm.filmId && <p className="text-sm leading-6 text-muted md:col-span-2">Título, URL, direção e ano vêm diretamente do cadastro do filme. Para alterá-los em todas as páginas vinculadas, edite o filme na área Cinema e Ditadura → Filmes.</p>}
                      </>
                    )}
                    </div>
                  )}
                />
              </div>

              <MultiUrlField className="md:col-span-2" label="Link do vídeo da sessão" values={session.sessionUrls} onChange={(urlIndex, value) => actions.updateNestedUrlList("sessions", sessionIndex, "sessionUrls", urlIndex, value)} onAdd={() => actions.addNestedUrl("sessions", sessionIndex, "sessionUrls")} onRemove={(urlIndex) => actions.removeNestedUrl("sessions", sessionIndex, "sessionUrls", urlIndex)} />
            </div>
          )}
        />
      </div>
    </section>
  );
}
