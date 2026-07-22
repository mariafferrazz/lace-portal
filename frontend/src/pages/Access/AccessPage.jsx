import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2, Database, FolderUp, LogOut, Pencil, Plus, ShieldCheck, Trash2, Upload, X } from "lucide-react";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import api, { apiError } from "../../services/api";
import { showSlug } from "../../utils/contentRoutes";

const contentTypes = [
  ["FILM", "Filme"],
  ["GLOSSARY", "Verbete"],
  ["CINEMA_SHOW", "Mostra Cinema e Ditadura"],
  ["ARTICLE", "Artigo"],
  ["RESEARCH", "Pesquisa"],
  ["VIRAL_ESCAPE_LINES", "Linhas de Fugas Virais"],
  ["INTERVIEW", "Entrevista"],
  ["PODCAST", "Podcast"],
  ["EVENT", "Evento"],
];

const contentAreas = [
  { value: "CINEMA_DITADURA", label: "Cinema e Ditadura", types: ["FILM", "GLOSSARY"] },
  { value: "PRODUCAO_AUDIOVISUAL", label: "Producao Audiovisual", types: ["INTERVIEW", "PODCAST"] },
  { value: "PRODUCAO_ACADEMICA", label: "Producao Academica", types: ["ARTICLE", "RESEARCH"] },
  { value: "EVENTOS_ATIVIDADES", label: "Eventos e Atividades", types: ["EVENT", "CINEMA_SHOW", "VIRAL_ESCAPE_LINES"] },
];

const areaForType = (type) => contentAreas.find((area) => area.types.includes(type));
const typeLabel = (type) => contentTypes.find(([value]) => value === type)?.[1] || type;
const cinemaShowAreas = ["CINEMA_DITADURA", "EVENTOS_ATIVIDADES"];
const eventYearOptions = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

function extractShowNumber(title = "") {
  const match = String(title).trim().match(/^([IVXLCDM]+)\b/i);
  return match ? match[1].toUpperCase() : "";
}

function selectedEventYear(form) {
  return form.eventYear === "__new__" ? form.customEventYear.trim() : form.eventYear.trim();
}

function showSlugFromTitle(title = "") {
  const number = extractShowNumber(title);
  return number ? showSlug(number) : showSlug(title);
}

function contentAreaLabel(content) {
  const areas = content.metadata?.editorialAreas;
  if (Array.isArray(areas) && areas.length > 0) {
    return areas
      .map((areaValue) => contentAreas.find((area) => area.value === areaValue)?.label)
      .filter(Boolean)
      .join(" + ");
  }
  return contentAreas.find((area) => area.value === content.metadata?.editorialArea)?.label || areaForType(content.type)?.label;
}

const emptySession = {
  date: "",
  title: "",
  direction: "",
  sessionUrl: "",
  sessionUrls: [""],
  archiveFilmUrl: "",
  archiveFilmUrls: [""],
};

const initialForm = {
  title: "",
  researcherName: "",
  researcherMemberId: "",
  area: "CINEMA_DITADURA",
  type: "FILM",
  description: "",
  externalUrl: "",
  fileUrl: "",
  fileUrls: [""],
  imageUrl: "",
  imageUrls: [""],
  showNumber: "",
  eventYear: "2026",
  customEventYear: "",
  createCinemaPage: true,
  playlistUrl: "",
  playlistUrls: [""],
  sessions: [{ ...emptySession }],
};

const fieldClass = "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";
const maxEmbeddedImageSize = 2 * 1024 * 1024;

const cleanUrlList = (urls) => urls.map((url) => url.trim()).filter(Boolean);

const ensureUrlList = (...values) => {
  const urls = values.flat().filter(Boolean);
  return urls.length ? urls : [""];
};

const uniqueUrls = (...values) => [...new Set(cleanUrlList(values.flat().filter(Boolean)))];

function createInitialForm(areaValue = "CINEMA_DITADURA", typeValue) {
  const area = contentAreas.find((item) => item.value === areaValue) || contentAreas[0];
  const type = typeValue && area.types.includes(typeValue) ? typeValue : area.types[0];
  return {
    ...initialForm,
    area: area.value,
    type,
    sessions: [{ ...emptySession }],
  };
}

function formFromContent(content) {
  const metadata = content.metadata || {};
  const areaValue = content.type === "CINEMA_SHOW"
    ? "EVENTOS_ATIVIDADES"
    : Array.isArray(metadata.editorialAreas)
    ? metadata.editorialAreas[0]
    : metadata.editorialArea || areaForType(content.type)?.value || "CINEMA_DITADURA";
  const base = createInitialForm(areaValue, content.type);
  return {
    ...base,
    title: content.title || "",
    researcherName: content.researcherMember?.name || content.researcherName || "",
    researcherMemberId: content.researcherMemberId || content.researcherMember?.id || content.metadata?.researcherMemberId || (content.researcherName ? `name:${content.researcherName}` : ""),
    description: content.description || "",
    externalUrl: content.externalUrl || "",
    fileUrl: content.fileUrl || "",
    fileUrls: ensureUrlList(metadata.fileUrls, content.fileUrl || content.externalUrl),
    imageUrl: metadata.imageUrl || "",
    imageUrls: ensureUrlList(metadata.imageUrls, metadata.imageUrl),
    showNumber: metadata.showNumber || "",
    eventYear: eventYearOptions.includes(String(metadata.eventYear || metadata.showYear || metadata.year || "")) ? String(metadata.eventYear || metadata.showYear || metadata.year || "") : ((metadata.eventYear || metadata.showYear || metadata.year) ? "__new__" : "2026"),
    customEventYear: eventYearOptions.includes(String(metadata.eventYear || metadata.showYear || metadata.year || "")) ? "" : String(metadata.eventYear || metadata.showYear || metadata.year || ""),
    createCinemaPage: metadata.createCinemaPage !== false && metadata.cinemaPath !== null,
    playlistUrl: metadata.playlistUrl || content.externalUrl || "",
    playlistUrls: ensureUrlList(metadata.playlistUrls, metadata.playlistUrl || content.externalUrl),
    sessions: Array.isArray(metadata.sessions) && metadata.sessions.length
      ? metadata.sessions.map((session) => ({
        ...emptySession,
        ...session,
        sessionUrls: ensureUrlList(session.sessionUrls, session.sessionUrl),
        archiveFilmUrls: ensureUrlList(session.archiveFilmUrls, session.archiveFilmUrl),
      }))
      : [{ ...emptySession }],
  };
}

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      onLogin(data.user);
    } catch (requestError) {
      setError(apiError(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-7 shadow-2xl md:p-10">
      <ShieldCheck className="text-primary" size={36} aria-hidden="true" />
      <h1 className="mt-5 font-title text-4xl">Acesso interno</h1>
      <p className="mt-3 leading-7 text-muted">Area exclusiva da Equipe LACE.</p>
      <form className="mt-8 space-y-5" onSubmit={submit}>
        <label className="block font-semibold">
          E-mail
          <input className={fieldClass} type="email" autoComplete="username" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label className="block font-semibold">
          Senha
          <input className={fieldClass} type="password" autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>
        {error && <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>}
        <Button className="w-full disabled:cursor-wait disabled:opacity-60" type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
      </form>
    </div>
  );
}

function ContentForm({ onCreated, initialArea = "CINEMA_DITADURA", initialType, onClose, content = null, teamMembers = [] }) {
  const isEditing = Boolean(content);
  const [form, setForm] = useState(() => (content ? formFromContent(content) : createInitialForm(initialArea, initialType)));
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const isCinemaShow = form.type === "CINEMA_SHOW";
  const isEvent = form.type === "EVENT";

  useEffect(() => {
    setForm(content ? formFromContent(content) : createInitialForm(initialArea, initialType));
    setStatus(null);
  }, [content, initialArea, initialType]);

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function updateImageUrl(value) {
    setForm((current) => ({ ...current, imageUrl: value, imageUrls: ensureUrlList(value, current.imageUrls.slice(1)) }));
  }

  function updateUrlList(field, index, value) {
    setForm((current) => {
      const urls = [...current[field]];
      urls[index] = value;
      return { ...current, [field]: urls, [field.replace(/s$/, "")]: urls[0] || "" };
    });
  }

  function addUrl(field) {
    setForm((current) => ({ ...current, [field]: [...current[field], ""] }));
  }

  function removeUrl(field, index) {
    setForm((current) => {
      const urls = current[field].length === 1 ? [""] : current[field].filter((_, urlIndex) => urlIndex !== index);
      return { ...current, [field]: urls, [field.replace(/s$/, "")]: urls[0] || "" };
    });
  }

  function updateImageFile(file) {
    setStatus(null);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus({ ok: false, message: "Selecione apenas arquivos de imagem." });
      return;
    }

    if (file.size > maxEmbeddedImageSize) {
      setStatus({ ok: false, message: "Esta imagem esta muito pesada. Use uma URL publica ou escolha uma imagem com ate 2 MB." });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") updateImageUrl(reader.result);
    };
    reader.onerror = () => {
      setStatus({ ok: false, message: "Nao foi possivel carregar esta imagem. Tente usar uma URL publica." });
    };
    reader.readAsDataURL(file);
  }

  function updateArea(event) {
    const area = contentAreas.find((item) => item.value === event.target.value);
    setForm((current) => ({ ...current, area: area.value, type: area.types[0] }));
  }

  function updateType(event) {
    setForm((current) => ({ ...current, type: event.target.value }));
  }

  function updateCheckbox(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.checked }));
  }

  function updateResearcher(event) {
    if (event.target.value.startsWith("name:")) {
      setForm((current) => ({
        ...current,
        researcherMemberId: event.target.value,
        researcherName: event.target.value.replace(/^name:/, ""),
      }));
      return;
    }
    const member = teamMembers.find((item) => item.id === event.target.value);
    setForm((current) => ({
      ...current,
      researcherMemberId: member?.id || "",
      researcherName: member?.name || "",
    }));
  }

  function updateSession(index, field, value) {
    setForm((current) => ({
      ...current,
      sessions: current.sessions.map((session, sessionIndex) =>
        sessionIndex === index ? { ...session, [field]: value } : session,
      ),
    }));
  }

  function updateSessionUrlList(sessionIndex, field, urlIndex, value) {
    setForm((current) => ({
      ...current,
      sessions: current.sessions.map((session, index) => {
        if (index !== sessionIndex) return session;
        const urls = [...session[field]];
        urls[urlIndex] = value;
        return { ...session, [field]: urls, [field.replace(/s$/, "")]: urls[0] || "" };
      }),
    }));
  }

  function addSessionUrl(sessionIndex, field) {
    setForm((current) => ({
      ...current,
      sessions: current.sessions.map((session, index) =>
        index === sessionIndex ? { ...session, [field]: [...session[field], ""] } : session,
      ),
    }));
  }

  function removeSessionUrl(sessionIndex, field, urlIndex) {
    setForm((current) => ({
      ...current,
      sessions: current.sessions.map((session, index) => {
        if (index !== sessionIndex) return session;
        const urls = session[field].length === 1 ? [""] : session[field].filter((_, indexToRemove) => indexToRemove !== urlIndex);
        return { ...session, [field]: urls, [field.replace(/s$/, "")]: urls[0] || "" };
      }),
    }));
  }

  function addSession() {
    setForm((current) => ({ ...current, sessions: [...current.sessions, { ...emptySession }] }));
  }

  function removeSession(index) {
    setForm((current) => ({
      ...current,
      sessions: current.sessions.length === 1
        ? [{ ...emptySession }]
        : current.sessions.filter((_, sessionIndex) => sessionIndex !== index),
    }));
  }

  function buildPayload() {
    const fileUrls = cleanUrlList(form.fileUrls);
    const imageUrls = cleanUrlList(form.imageUrls);
    const playlistUrls = cleanUrlList(form.playlistUrls);
    const metadata = {
      editorialArea: form.area,
    };
    if (form.researcherMemberId && !form.researcherMemberId.startsWith("name:")) metadata.researcherMemberId = form.researcherMemberId;

    if (isCinemaShow) {
      const slug = showSlugFromTitle(form.title);
      const year = selectedEventYear(form);
      const showNumber = extractShowNumber(form.title);
      metadata.editorialArea = form.createCinemaPage ? "CINEMA_DITADURA" : "EVENTOS_ATIVIDADES";
      metadata.editorialAreas = form.createCinemaPage ? cinemaShowAreas : ["EVENTOS_ATIVIDADES"];
      metadata.createCinemaPage = form.createCinemaPage;
      metadata.showNumber = showNumber;
      metadata.showSlug = slug;
      metadata.eventYear = year;
      metadata.showYear = year;
      metadata.year = year;
      metadata.cinemaPath = form.createCinemaPage && slug ? `/cinema-e-ditadura/${slug}` : null;
      metadata.eventPath = year ? `/eventos/${year}` : null;
      metadata.imageUrl = imageUrls[0] || null;
      metadata.imageUrls = imageUrls;
      metadata.playlistUrl = playlistUrls[0] || null;
      metadata.playlistUrls = playlistUrls;
      metadata.sessions = form.sessions
        .map((session) => ({
          date: session.date.trim(),
          title: session.title.trim(),
          direction: session.direction.trim() || null,
          sessionUrl: cleanUrlList(session.sessionUrls)[0] || null,
          sessionUrls: cleanUrlList(session.sessionUrls),
          archiveFilmUrl: cleanUrlList(session.archiveFilmUrls)[0] || null,
          archiveFilmUrls: cleanUrlList(session.archiveFilmUrls),
        }))
        .filter((session) => session.date || session.title || session.sessionUrl || session.archiveFilmUrl);
    } else {
      if (isEvent) {
        const year = selectedEventYear(form);
        metadata.eventYear = year;
        metadata.year = year;
        metadata.eventPath = year ? `/eventos/${year}` : null;
      }
      metadata.imageUrl = imageUrls[0] || null;
      metadata.imageUrls = imageUrls;
      metadata.fileUrls = fileUrls;
    }

    return {
      title: form.title,
      researcherName: form.researcherName,
      researcherMemberId: form.researcherMemberId && !form.researcherMemberId.startsWith("name:") ? form.researcherMemberId : null,
      type: form.type,
      description: form.description,
      externalUrl: isCinemaShow ? playlistUrls[0] || "" : fileUrls[0] || "",
      fileUrl: fileUrls[0] || "",
      metadata,
    };
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    if (isCinemaShow && !extractShowNumber(form.title)) {
      setStatus({ ok: false, message: "Comece o titulo com a numeracao da mostra, como VIII Mostra Cinema e Ditadura." });
      setLoading(false);
      return;
    }
    if ((isCinemaShow || isEvent) && !selectedEventYear(form)) {
      setStatus({ ok: false, message: "Informe o ano do evento ou da mostra." });
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await api.patch(`/contents/${content.id}`, buildPayload());
      } else {
        await api.post("/contents", buildPayload());
      }
      setForm(createInitialForm(initialArea, initialType));
      setStatus({ ok: true, message: isEditing ? "Conteudo atualizado." : "Conteudo enviado para revisao da coordenacao." });
      onCreated();
      onClose?.();
    } catch (error) {
      setStatus({ ok: false, message: apiError(error) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 md:p-9">
      <div className="flex items-center gap-3 text-primary"><Upload aria-hidden="true" /><h2 className="font-title text-3xl text-text">{isEditing ? "Editar conteudo" : "Novo conteudo"}</h2></div>
      <p className="mt-3 text-muted">{isEditing ? "Revise as informacoes antes de publicar ou manter em revisao." : "O nome informado abaixo sera exibido como autoria do material."}</p>
      <form className="mt-7 grid gap-5 md:grid-cols-2" onSubmit={submit}>
        <label className="font-semibold">Area editorial *
          <select className={fieldClass} required value={form.area} onChange={updateArea}>{contentAreas.map((area) => <option key={area.value} value={area.value}>{area.label}</option>)}</select>
        </label>
        <label className="font-semibold">Tipo de conteudo *
          <select className={fieldClass} required value={form.type} onChange={updateType}>{contentTypes.filter(([value]) => contentAreas.find((area) => area.value === form.area)?.types.includes(value)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </label>
        {(isCinemaShow || isEvent) && (
          <EventYearField
            value={form.eventYear}
            customValue={form.customEventYear}
            onYearChange={update("eventYear")}
            onCustomYearChange={update("customEventYear")}
            label={isCinemaShow ? "Ano da mostra *" : "Ano do evento *"}
          />
        )}
        {isCinemaShow && (
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 font-semibold transition hover:border-primary">
            <input
              className="mt-1 size-5 accent-primary"
              type="checkbox"
              checked={form.createCinemaPage}
              onChange={updateCheckbox("createCinemaPage")}
            />
            <span>
              Criar pagina tambem em Cinema e Ditadura
              <span className="mt-1 block text-sm font-normal leading-6 text-muted">A mostra ficara acessivel no ano de Eventos e tambem no submenu Cinema e Ditadura.</span>
            </span>
          </label>
        )}
        <label className="font-semibold">Titulo *<input className={fieldClass} required maxLength={200} placeholder={isCinemaShow ? "VIII Mostra Cinema e Ditadura" : ""} value={form.title} onChange={update("title")} /></label>
        <label className="font-semibold">Nome do pesquisador *
          <select className={fieldClass} required value={form.researcherMemberId} onChange={updateResearcher}>
            <option value="">Selecione uma pessoa da Equipe LACE</option>
            {teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
            {form.researcherMemberId.startsWith("name:") && <option value={form.researcherMemberId}>{form.researcherName}</option>}
          </select>
        </label>

        {isCinemaShow ? (
          <CinemaShowFields
            form={form}
            updateImageFile={updateImageFile}
            updateSession={updateSession}
            updateSessionUrlList={updateSessionUrlList}
            addSessionUrl={addSessionUrl}
            removeSessionUrl={removeSessionUrl}
            addSession={addSession}
            removeSession={removeSession}
            updateUrlList={updateUrlList}
            addUrl={addUrl}
            removeUrl={removeUrl}
          />
        ) : (
          <>
            <MultiUrlField
              className="md:col-span-2"
              label={isEvent ? "URL do evento" : "URL do conteudo, arquivo ou midia"}
              values={form.fileUrls}
              onChange={(index, value) => updateUrlList("fileUrls", index, value)}
              onAdd={() => addUrl("fileUrls")}
              onRemove={(index) => removeUrl("fileUrls", index)}
            />
            <ImageSourceField
              className="md:col-span-2"
              label="Imagem"
              values={form.imageUrls}
              onUrlChange={(index, value) => updateUrlList("imageUrls", index, value)}
              onUrlAdd={() => addUrl("imageUrls")}
              onUrlRemove={(index) => removeUrl("imageUrls", index)}
              onFileChange={updateImageFile}
            />
          </>
        )}

        <label className="font-semibold md:col-span-2">Descricao<textarea className={`${fieldClass} min-h-36 resize-y`} maxLength={5000} value={form.description} onChange={update("description")} /></label>
        <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center">
          <Button type="submit" disabled={loading} className="disabled:cursor-wait disabled:opacity-60">{loading ? "Salvando..." : isEditing ? "Salvar alteracoes" : "Enviar para revisao"}</Button>
          {status && <p className={status.ok ? "text-sm font-semibold text-green-700 dark:text-green-300" : "text-sm font-semibold text-red-700 dark:text-red-300"} role="status">{status.message}</p>}
        </div>
      </form>
    </section>
  );
}

function MultiUrlField({ label, values, onChange, onAdd, onRemove, className = "", inputType = "url" }) {
  return (
    <div className={`font-semibold ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-primary/60 px-3 py-1 text-xs font-bold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary"
          onClick={onAdd}
        >
          <Plus size={14} aria-hidden="true" /> URL
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              className={fieldClass}
              type={value?.startsWith("data:image/") ? "text" : inputType}
              placeholder="https://..."
              value={value}
              onChange={(event) => onChange(index, event.target.value)}
            />
            <button
              type="button"
              className="mt-2 grid size-12 shrink-0 cursor-pointer place-items-center rounded-xl border border-red-500/40 text-red-700 transition hover:border-red-500 hover:bg-red-600 hover:text-white dark:text-red-300"
              onClick={() => onRemove(index)}
              aria-label={`Remover URL ${index + 1}`}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageSourceField({ label, values, onUrlChange, onUrlAdd, onUrlRemove, onFileChange, className = "" }) {

  return (
    <div className={`font-semibold ${className}`}>
      <MultiUrlField
        label={`${label} por URL`}
        values={values}
        onChange={onUrlChange}
        onAdd={onUrlAdd}
        onRemove={onUrlRemove}
      />

      <label className="mt-3 block">
        Ou selecionar imagem do PC
        <span className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/50 bg-primary/5 px-5 py-7 text-center transition hover:border-primary hover:bg-primary/10 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <FolderUp className="text-primary" size={34} aria-hidden="true" />
          <span className="mt-3 text-base font-semibold text-text">
            Escolher imagem do computador
          </span>
          <span className="mt-2 max-w-xl text-sm font-normal leading-6 text-muted">
            Use JPG, PNG ou WEBP. Para imagens muito grandes, prefira uma URL publica.
          </span>
          <input
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
          />
        </span>
      </label>
    </div>
  );
}

function EventYearField({ value, customValue, onYearChange, onCustomYearChange, label }) {
  return (
    <div className="font-semibold">
      {label}
      <select className={fieldClass} required value={value} onChange={onYearChange}>
        {eventYearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
        <option value="__new__">Adicionar ano</option>
      </select>
      {value === "__new__" && (
        <input
          className={fieldClass}
          required
          inputMode="numeric"
          maxLength={4}
          placeholder="2027"
          value={customValue}
          onChange={onCustomYearChange}
        />
      )}
    </div>
  );
}

function CinemaShowFields({
  form,
  updateImageFile,
  updateSession,
  updateSessionUrlList,
  addSessionUrl,
  removeSessionUrl,
  addSession,
  removeSession,
  updateUrlList,
  addUrl,
  removeUrl,
}) {
  return (
    <section className="md:col-span-2 rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <MultiUrlField
          label="Link da playlist"
          values={form.playlistUrls}
          onChange={(index, value) => updateUrlList("playlistUrls", index, value)}
          onAdd={() => addUrl("playlistUrls")}
          onRemove={(index) => removeUrl("playlistUrls", index)}
        />
        <ImageSourceField
          label="Imagem da mostra"
          values={form.imageUrls}
          onUrlChange={(index, value) => updateUrlList("imageUrls", index, value)}
          onUrlAdd={() => addUrl("imageUrls")}
          onUrlRemove={(index) => removeUrl("imageUrls", index)}
          onFileChange={updateImageFile}
        />
      </div>

      <div className="mt-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-title text-2xl text-text">Calendario com sessoes</h3>
          <p className="mt-1 text-sm text-muted">Adicione cada sessao com data, filme, link da sessao e URL publica do filme para o acervo.</p>
        </div>
        <Button type="button" variant="outline" className="self-start" onClick={addSession}><Plus size={16} aria-hidden="true" /> Adicionar sessao</Button>
      </div>

      <div className="mt-5 space-y-5">
        {form.sessions.map((session, index) => (
          <article key={index} className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="font-semibold text-text">Sessao {index + 1}</h4>
              <button
                type="button"
                className="rounded-xl border border-red-500/40 p-2 text-red-700 transition hover:bg-red-500/10 dark:text-red-300"
                onClick={() => removeSession(index)}
                aria-label={`Remover sessao ${index + 1}`}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="font-semibold">Data<input className={fieldClass} placeholder="20/09/2026" value={session.date} onChange={(event) => updateSession(index, "date", event.target.value)} /></label>
              <label className="font-semibold">Titulo do filme/sessao<input className={fieldClass} value={session.title} onChange={(event) => updateSession(index, "title", event.target.value)} /></label>
              <label className="font-semibold md:col-span-2">Direcao/debate<input className={fieldClass} value={session.direction} onChange={(event) => updateSession(index, "direction", event.target.value)} /></label>
              <MultiUrlField
                className="md:col-span-2"
                label="Link da sessao"
                values={session.sessionUrls}
                onChange={(urlIndex, value) => updateSessionUrlList(index, "sessionUrls", urlIndex, value)}
                onAdd={() => addSessionUrl(index, "sessionUrls")}
                onRemove={(urlIndex) => removeSessionUrl(index, "sessionUrls", urlIndex)}
              />
              <MultiUrlField
                className="md:col-span-2"
                label="URL do filme para o acervo"
                values={session.archiveFilmUrls}
                onChange={(urlIndex, value) => updateSessionUrlList(index, "archiveFilmUrls", urlIndex, value)}
                onAdd={() => addSessionUrl(index, "archiveFilmUrls")}
                onRemove={(urlIndex) => removeSessionUrl(index, "archiveFilmUrls", urlIndex)}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Modal({ children, onClose, size = "max-w-6xl" }) {
  useEffect(() => {
    const close = (event) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`relative max-h-[92vh] w-full overflow-y-auto rounded-3xl border border-border bg-background p-5 shadow-2xl md:p-8 ${size}`}>
        <button
          type="button"
          className="absolute right-4 top-4 z-10 rounded-full border border-border bg-card p-3 text-text transition hover:border-primary hover:text-primary"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={22} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}

function contentBelongsToArea(content, area) {
  const editorialAreas = content.metadata?.editorialAreas;
  if (Array.isArray(editorialAreas) && editorialAreas.includes(area.value)) return true;
  if (content.metadata?.editorialArea === area.value) return true;
  if (content.type === "CINEMA_SHOW") return area.types.includes("CINEMA_SHOW");
  return area.types.includes(content.type) && areaForType(content.type)?.value === area.value;
}

function ContentPreviewModal({ content, onClose, onEdit, user }) {
  const isCoordinator = user.role === "COORDINATOR";
  const canEdit = isCoordinator || !content.readOnly;
  const sessions = Array.isArray(content.metadata?.sessions) ? content.metadata.sessions : [];
  const fileUrls = uniqueUrls(content.metadata?.fileUrls, content.fileUrl, content.externalUrl);
  const playlistUrls = uniqueUrls(content.metadata?.playlistUrls, content.metadata?.playlistUrl);
  const imageUrls = uniqueUrls(content.metadata?.imageUrls, content.metadata?.imageUrl);
  const imageUrl = imageUrls[0];

  return (
    <Modal onClose={onClose} size="max-w-5xl">
      <article className="pr-14">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">{contentAreaLabel(content)} - {typeLabel(content.type)}</p>
        <h2 className="mt-3 font-title text-4xl md:text-5xl">{content.title}</h2>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
          <span>Pesquisador(a): <strong className="text-text">{content.researcherName}</strong></span>
          <span>Enviado por {content.createdBy?.name || "usuario do LACE"}</span>
          <span className={content.published ? "font-bold text-green-700 dark:text-green-300" : "font-bold text-primary"}>{content.published ? "Publicado" : "Em revisao"}</span>
        </div>
      </article>

      {imageUrl && (
        <figure className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <img className="max-h-[420px] w-full object-cover" src={imageUrl} alt="" loading="lazy" />
        </figure>
      )}

      {content.description && (
        <section className="mt-8 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-title text-2xl">Descricao</h3>
          <div className="mt-3 whitespace-pre-line leading-7 text-muted">{content.description}</div>
        </section>
      )}

      {(fileUrls.length > 0 || playlistUrls.length > 0 || imageUrls.length > 0) && (
        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-title text-2xl">Links publicos</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {fileUrls.map((url, index) => <a key={`file-${url}`} className="cursor-pointer rounded-xl border border-primary/60 px-4 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary" href={url} target="_blank" rel="noreferrer">Abrir URL {fileUrls.length > 1 ? index + 1 : ""}</a>)}
            {playlistUrls.map((url, index) => <a key={`playlist-${url}`} className="cursor-pointer rounded-xl border border-primary/60 px-4 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary" href={url} target="_blank" rel="noreferrer">Abrir playlist {playlistUrls.length > 1 ? index + 1 : ""}</a>)}
            {imageUrls.map((url, index) => <a key={`image-${url}`} className="cursor-pointer rounded-xl border border-primary/60 px-4 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary" href={url} target="_blank" rel="noreferrer">Abrir imagem {imageUrls.length > 1 ? index + 1 : ""}</a>)}
          </div>
        </section>
      )}

      {content.type === "CINEMA_SHOW" && (
        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-title text-2xl">Mostra Cinema e Ditadura</h3>
          <p className="mt-2 text-muted">Numeracao: <strong className="text-text">{content.metadata?.showNumber || "Sem numeracao"}</strong></p>
          <div className="mt-5 space-y-4">
            {sessions.length === 0 ? (
              <p className="text-muted">Nenhuma sessao cadastrada.</p>
            ) : sessions.map((session, index) => (
              <article key={`${session.title}-${index}`} className="rounded-2xl border border-border bg-background p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Sessao {index + 1}</p>
                <h4 className="mt-1 font-title text-2xl">{session.title || "Sem titulo"}</h4>
                <p className="mt-2 text-sm text-muted">{session.date || "Sem data"}{session.direction ? ` - ${session.direction}` : ""}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {uniqueUrls(session.sessionUrls, session.sessionUrl).map((url, urlIndex) => <a key={`session-${url}`} className="cursor-pointer rounded-xl border border-primary/60 px-3 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary" href={url} target="_blank" rel="noreferrer">Abrir sessao {urlIndex + 1}</a>)}
                  {uniqueUrls(session.archiveFilmUrls, session.archiveFilmUrl).map((url, urlIndex) => <a key={`archive-${url}`} className="cursor-pointer rounded-xl border border-primary/60 px-3 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary" href={url} target="_blank" rel="noreferrer">Abrir filme no acervo {urlIndex + 1}</a>)}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {canEdit && (
        <div className="mt-7">
          <Button variant="outline" type="button" onClick={() => onEdit(content)}><Pencil className="inline" size={16} /> Editar conteudo</Button>
        </div>
      )}
    </Modal>
  );
}

function ContentCard({ content, user, refresh, onEdit, onOpen }) {
  const isCoordinator = user.role === "COORDINATOR";
  const isReadOnly = content.readOnly;
  const canEdit = !isReadOnly;

  async function publish() {
    await api.patch(`/contents/${content.id}`, { published: !content.published });
    refresh();
  }

  async function remove() {
    if (!window.confirm(`Excluir "${content.title}"?`)) return;
    await api.delete(`/contents/${content.id}`);
    refresh();
  }

  return (
    <article className="rounded-2xl border border-border bg-background p-5 transition hover:border-primary/50">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">{contentAreaLabel(content)} - {typeLabel(content.type)}</p>
          <h3 className="mt-2 line-clamp-2 max-w-[78ch] overflow-hidden text-ellipsis font-title text-[clamp(1.35rem,1.7vw,1.6rem)] leading-tight">{content.title}</h3>
          {content.type === "CINEMA_SHOW" && (
            <p className="mt-2 text-sm text-muted">
              Mostra: <strong className="text-text">{content.metadata?.showNumber || "Sem numeracao"}</strong>
              {content.metadata?.sessions?.length ? ` - ${content.metadata.sessions.length} sessoes cadastradas` : ""}
            </p>
          )}
          <p className="mt-2 text-sm text-muted">Pesquisador(a): <strong className="text-text">{content.researcherName}</strong></p>
          <p className="mt-1 text-xs text-muted">Enviado por {content.createdBy?.name || "usuario do LACE"}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${content.published ? "bg-green-600/15 text-green-700 dark:text-green-300" : "bg-primary/10 text-primary"}`}>
            <span className={`size-2 rounded-full ${content.published ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.85)]" : "bg-primary"}`} aria-hidden="true" />
            {isReadOnly ? "No site" : content.published ? "Publicado" : "Em revisao"}
          </span>
          <button className="cursor-pointer rounded-xl border border-primary/60 px-3 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-fill hover:text-on-primary" type="button" onClick={() => onOpen(content)}>Abrir pagina</button>
          {canEdit && <Button variant="outline" className="px-3 py-2 text-sm" type="button" onClick={() => onEdit(content)}><Pencil className="inline" size={15} /> Editar</Button>}
          {isCoordinator && !isReadOnly && !content.published && (
            <Button variant="outline" className="px-3 py-2 text-sm" type="button" onClick={publish}>
              <CheckCircle2 className="inline" size={15} /> Publicar
            </Button>
          )}
          {isCoordinator && !isReadOnly && (
            <button
              className="grid size-10 cursor-pointer place-items-center rounded-xl border border-red-500/50 text-red-700 transition hover:border-red-500 hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:text-red-300 dark:hover:text-white"
              type="button"
              aria-label={`Excluir ${content.title}`}
              title="Excluir conteudo"
              onClick={remove}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function AreaModal({ area, contents, user, refresh, onClose, onAddContent, onEditContent, onOpenContent }) {
  const [selectedType, setSelectedType] = useState(area.types[0]);

  const areaContents = useMemo(
    () => contents.filter((content) => contentBelongsToArea(content, area)),
    [area, contents],
  );
  const visibleContents = useMemo(
    () => areaContents.filter((content) => content.type === selectedType),
    [areaContents, selectedType],
  );

  return (
    <Modal onClose={onClose}>
      <div className="pr-14">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Area editorial</p>
        <h2 className="mt-2 font-title text-4xl md:text-5xl">{area.label}</h2>
        <p className="mt-3 text-muted">{areaContents.length} conteudos cadastrados nesta area.</p>
      </div>

      <div className="mt-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {area.types.map((type) => (
            <button
              key={type}
              type="button"
              className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${selectedType === type ? "border-primary bg-primary-fill text-on-primary" : "border-border bg-card text-text hover:border-primary hover:text-primary"}`}
              onClick={() => setSelectedType(type)}
            >
              {typeLabel(type)}
            </button>
          ))}
        </div>
        <Button type="button" className="inline-flex min-w-56 flex-nowrap items-center justify-center gap-2 whitespace-nowrap" onClick={() => onAddContent(area.value, selectedType)}><Plus className="shrink-0" size={17} aria-hidden="true" /> <span>Adicionar conteudo</span></Button>
      </div>

      <div className="mt-7 space-y-4">
        {visibleContents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8">
            <Database className="text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-title text-2xl">Nenhum conteudo deste tipo</h3>
            <p className="mt-2 text-muted">Use o botao acima para cadastrar o primeiro item.</p>
          </div>
        ) : (
          visibleContents.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              user={user}
              refresh={refresh}
              onEdit={onEditContent}
              onOpen={onOpenContent}
            />
          ))
        )}
      </div>
    </Modal>
  );
}

function PendingApprovals({ contents, refresh, onEdit, onOpen }) {
  const pending = useMemo(() => contents.filter((content) => !content.published), [contents]);
  if (pending.length === 0) return null;

  async function approve(content) {
    await api.patch(`/contents/${content.id}`, { published: true });
    refresh();
  }

  return (
    <section className="mb-6 rounded-3xl border border-primary/40 bg-primary/10 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <Bell className="mt-1 text-primary" aria-hidden="true" />
          <div>
            <h2 className="font-title text-3xl text-text">Aguardando autorizacao</h2>
            <p className="mt-1 text-muted">{pending.length} {pending.length === 1 ? "conteudo precisa" : "conteudos precisam"} de revisao da coordenacao antes de entrar no site.</p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {pending.slice(0, 6).map((content) => (
          <article key={content.id} className="grid gap-4 rounded-2xl border border-border bg-background p-4 transition hover:border-primary/50 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{contentAreaLabel(content)} - {typeLabel(content.type)}</p>
              <h3 className="mt-1 line-clamp-2 max-w-[78ch] overflow-hidden text-ellipsis font-title text-[clamp(1.35rem,1.7vw,1.6rem)] leading-tight">{content.title}</h3>
              <p className="mt-1 text-sm text-muted">Enviado por {content.createdBy?.name || "usuario do LACE"} - Pesquisador(a): <strong className="text-text">{content.researcherName}</strong></p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
              <Button variant="outline" className="px-3 py-2 text-sm" type="button" onClick={() => onOpen(content)}>Abrir pagina</Button>
              <Button variant="outline" className="px-3 py-2 text-sm" type="button" onClick={() => onEdit(content)}><Pencil className="inline" size={15} /> Editar</Button>
              <Button className="px-3 py-2 text-sm" type="button" onClick={() => approve(content)}><CheckCircle2 className="inline" size={15} /> Publicar</Button>
            </div>
          </article>
        ))}
        {pending.length > 6 && <p className="text-sm text-muted">Mais {pending.length - 6} conteudos em revisao aparecem nas areas editoriais abaixo.</p>}
      </div>
    </section>
  );
}

function EditorialDashboard({ user, contents, refresh, teamMembers, ensureTeamMembers }) {
  const [activeArea, setActiveArea] = useState(null);
  const [addDefaults, setAddDefaults] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [loadingContentId, setLoadingContentId] = useState("");
  const areaCounts = useMemo(
    () => Object.fromEntries(contentAreas.map((area) => [
      area.value,
      contents.filter((content) => contentBelongsToArea(content, area)).length,
    ])),
    [contents],
  );

  const getFullContent = useCallback(async (content) => {
    if (!content?.summaryOnly) return content;
    setLoadingContentId(content.id);
    try {
      const { data } = await api.get(`/contents/${content.id}`);
      return data.content || content;
    } finally {
      setLoadingContentId("");
    }
  }, []);

  const addContent = useCallback(async (defaults = createInitialForm()) => {
    await ensureTeamMembers();
    setAddDefaults(defaults);
  }, [ensureTeamMembers]);

  const editContent = useCallback(async (content) => {
    await ensureTeamMembers();
    setEditingContent(await getFullContent(content));
  }, [ensureTeamMembers, getFullContent]);

  const openContent = useCallback(async (content) => {
    setPreviewContent(await getFullContent(content));
  }, [getFullContent]);

  return (
    <>
      {user.role === "COORDINATOR" && <PendingApprovals contents={contents} refresh={refresh} onEdit={editContent} onOpen={openContent} />}

      <section className="rounded-3xl border border-border bg-card p-6 md:p-9">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Database className="text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-title text-3xl">Conteudos cadastrados</h2>
              <p className="mt-1 text-muted">Escolha uma area editorial para ver os tipos de conteudo.</p>
            </div>
          </div>
          <Button type="button" className="inline-flex min-w-56 flex-nowrap items-center justify-center gap-2 whitespace-nowrap" onClick={() => addContent(createInitialForm())}><Plus className="shrink-0" size={17} aria-hidden="true" /> <span>Adicionar conteudo</span></Button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {contentAreas.map((area) => {
            const count = areaCounts[area.value] || 0;
            return (
              <button
                key={area.value}
                type="button"
                className="group flex cursor-pointer flex-col items-start rounded-2xl border-2 border-dashed border-primary/40 bg-background px-6 py-8 text-left transition hover:-translate-y-1 hover:border-primary hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setActiveArea(area)}
              >
                <FolderUp className="text-primary" size={38} aria-hidden="true" />
                <span className="mt-4 font-title text-3xl text-text">{area.label}</span>
                <span className="mt-2 text-sm text-muted">{count} {count === 1 ? "conteudo" : "conteudos"}</span>
                <span className="mt-4 flex flex-wrap gap-2">
                  {area.types.map((type) => <span key={type} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted group-hover:border-primary/60">{typeLabel(type)}</span>)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {activeArea && (
        <AreaModal
          area={activeArea}
          contents={contents}
          user={user}
          refresh={refresh}
          onClose={() => setActiveArea(null)}
          onAddContent={(areaValue, typeValue) => addContent(createInitialForm(areaValue, typeValue))}
          onEditContent={editContent}
          onOpenContent={openContent}
        />
      )}

      {loadingContentId && (
        <div className="fixed inset-x-0 bottom-5 z-[80] mx-auto w-fit rounded-full border border-primary/40 bg-card px-4 py-2 text-sm font-semibold text-primary shadow-xl">
          Carregando conteudo...
        </div>
      )}

      {addDefaults && (
        <Modal onClose={() => setAddDefaults(null)} size="max-w-7xl">
          <ContentForm
            onCreated={refresh}
            initialArea={addDefaults.area}
            initialType={addDefaults.type}
            onClose={() => setAddDefaults(null)}
            teamMembers={teamMembers}
          />
        </Modal>
      )}

      {editingContent && (
        <Modal onClose={() => setEditingContent(null)} size="max-w-7xl">
          <ContentForm
            content={editingContent}
            onCreated={refresh}
            onClose={() => setEditingContent(null)}
            teamMembers={teamMembers}
          />
        </Modal>
      )}

      {previewContent && (
        <ContentPreviewModal
          content={previewContent}
          user={user}
          onClose={() => setPreviewContent(null)}
          onEdit={(content) => {
            setPreviewContent(null);
            setEditingContent(content);
          }}
        />
      )}
    </>
  );
}

export default function AccessPage() {
  const [user, setUser] = useState(null);
  const [contents, setContents] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [dashboardError, setDashboardError] = useState("");
  const [checking, setChecking] = useState(true);

  const loadContents = useCallback(async () => {
    try {
      setDashboardError("");
      let data;
      try {
        ({ data } = await api.get("/contents/manage", { params: { summary: "1" } }));
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        ({ data } = await api.get("/contents/manage", { params: { summary: "1" } }));
      }
      setContents(data.contents || []);
    } catch (error) {
      setDashboardError(apiError(error));
      const { data } = await api.get("/contents");
      setContents(data.contents || []);
    }
  }, []);

  const loadTeamMembers = useCallback(async () => {
    try {
      const { data } = await api.get("/team");
      setTeamMembers(data.members || []);
      return data.members || [];
    } catch {
      setTeamMembers([]);
      return [];
    }
  }, []);

  const ensureTeamMembers = useCallback(async () => {
    if (teamMembers.length) return teamMembers;
    return loadTeamMembers();
  }, [loadTeamMembers, teamMembers]);

  useEffect(() => {
    api.get("/auth/me")
      .then(async ({ data }) => {
        setUser(data.user);
        await loadContents();
      })
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, [loadContents]);

  function handleLogin(authenticatedUser) {
    setUser(authenticatedUser);
    loadContents();
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
    setContents([]);
    setTeamMembers([]);
  }

  if (checking) return <main className="grid min-h-[70vh] place-items-center"><p className="text-muted">Verificando acesso...</p></main>;

  return (
    <main className="bg-surface py-16 lg:py-24">
      <Container>
        {!user ? <Login onLogin={handleLogin} /> : <>
          <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Painel LACE</p><h1 className="mt-2 font-title text-4xl md:text-5xl">Ola, {user.name}</h1><p className="mt-2 text-muted">{user.role === "COORDINATOR" ? "Acesso de coordenacao" : "Acesso da Equipe LACE"}</p></div>
            <Button variant="dark" type="button" onClick={logout}><LogOut className="inline" size={17} /> Sair</Button>
          </header>
          {dashboardError && (
            <p className="mb-6 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-sm font-semibold text-primary" role="status">
              A sessao administrativa nao foi confirmada agora. Entre novamente se esta mensagem continuar aparecendo.
            </p>
          )}
          <EditorialDashboard user={user} contents={contents} refresh={loadContents} teamMembers={teamMembers} ensureTeamMembers={ensureTeamMembers} />
        </>}
      </Container>
    </main>
  );
}
