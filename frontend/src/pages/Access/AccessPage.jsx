import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Database, LogOut, Plus, ShieldCheck, Trash2, Upload } from "lucide-react";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import api, { apiError } from "../../services/api";

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
  ["OTHER", "Outro"],
];

const contentAreas = [
  { value: "CINEMA_DITADURA", label: "Cinema e Ditadura", types: ["FILM", "GLOSSARY", "CINEMA_SHOW"] },
  { value: "PRODUCAO_AUDIOVISUAL", label: "Producao Audiovisual", types: ["INTERVIEW", "PODCAST"] },
  { value: "PRODUCAO_ACADEMICA", label: "Producao Academica", types: ["ARTICLE", "RESEARCH"] },
  { value: "EVENTOS_ATIVIDADES", label: "Eventos e Atividades", types: ["EVENT", "CINEMA_SHOW", "VIRAL_ESCAPE_LINES"] },
  { value: "OUTROS", label: "Outros", types: ["OTHER"] },
];

const areaForType = (type) => contentAreas.find((area) => area.types.includes(type));
const typeLabel = (type) => contentTypes.find(([value]) => value === type)?.[1] || type;

const emptySession = {
  date: "",
  title: "",
  direction: "",
  sessionUrl: "",
  filmUrl: "",
  archiveDownloadUrl: "",
};

const initialForm = {
  title: "",
  researcherName: "",
  area: "CINEMA_DITADURA",
  type: "FILM",
  description: "",
  externalUrl: "",
  fileUrl: "",
  showNumber: "",
  playlistUrl: "",
  sessions: [{ ...emptySession }],
};

const fieldClass = "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

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
      <p className="mt-3 leading-7 text-muted">Area exclusiva da coordenacao, pesquisadores e estudantes do LACE.</p>
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

function ContentForm({ onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const isCinemaShow = form.type === "CINEMA_SHOW";

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function updateArea(event) {
    const area = contentAreas.find((item) => item.value === event.target.value);
    setForm((current) => ({ ...current, area: area.value, type: area.types[0] }));
  }

  function updateType(event) {
    setForm((current) => ({ ...current, type: event.target.value }));
  }

  function updateSession(index, field, value) {
    setForm((current) => ({
      ...current,
      sessions: current.sessions.map((session, sessionIndex) =>
        sessionIndex === index ? { ...session, [field]: value } : session,
      ),
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
    const metadata = {
      editorialArea: form.area,
    };

    if (isCinemaShow) {
      metadata.showNumber = form.showNumber.trim();
      metadata.playlistUrl = form.playlistUrl.trim() || null;
      metadata.sessions = form.sessions
        .map((session) => ({
          date: session.date.trim(),
          title: session.title.trim(),
          direction: session.direction.trim() || null,
          sessionUrl: session.sessionUrl.trim() || null,
          filmUrl: session.filmUrl.trim() || null,
          archiveDownloadUrl: session.archiveDownloadUrl.trim() || null,
        }))
        .filter((session) => session.date || session.title || session.sessionUrl || session.filmUrl || session.archiveDownloadUrl);
    }

    return {
      title: form.title,
      researcherName: form.researcherName,
      type: form.type,
      description: form.description,
      externalUrl: isCinemaShow ? form.playlistUrl || form.externalUrl : form.externalUrl,
      fileUrl: form.fileUrl,
      metadata,
    };
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    if (isCinemaShow && !form.showNumber.trim()) {
      setStatus({ ok: false, message: "Informe a numeracao da mostra, como VIII, IX ou X." });
      setLoading(false);
      return;
    }

    try {
      await api.post("/contents", buildPayload());
      setForm(initialForm);
      setStatus({ ok: true, message: "Conteudo enviado para revisao da coordenacao." });
      onCreated();
    } catch (error) {
      setStatus({ ok: false, message: apiError(error) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 md:p-9">
      <div className="flex items-center gap-3 text-primary"><Upload aria-hidden="true" /><h2 className="font-title text-3xl text-text">Novo conteudo</h2></div>
      <p className="mt-3 text-muted">O nome informado abaixo sera exibido como autoria do material.</p>
      <form className="mt-7 grid gap-5 md:grid-cols-2" onSubmit={submit}>
        <label className="font-semibold">Titulo *<input className={fieldClass} required maxLength={200} value={form.title} onChange={update("title")} /></label>
        <label className="font-semibold">Nome do pesquisador *<input className={fieldClass} required maxLength={160} value={form.researcherName} onChange={update("researcherName")} /></label>
        <label className="font-semibold">Area editorial *
          <select className={fieldClass} required value={form.area} onChange={updateArea}>{contentAreas.map((area) => <option key={area.value} value={area.value}>{area.label}</option>)}</select>
        </label>
        <label className="font-semibold">Tipo de conteudo *
          <select className={fieldClass} required value={form.type} onChange={updateType}>{contentTypes.filter(([value]) => contentAreas.find((area) => area.value === form.area)?.types.includes(value)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </label>

        {isCinemaShow ? (
          <CinemaShowFields
            form={form}
            update={update}
            updateSession={updateSession}
            addSession={addSession}
            removeSession={removeSession}
          />
        ) : (
          <>
            <label className="font-semibold">Link externo<input className={fieldClass} type="url" placeholder="https://..." value={form.externalUrl} onChange={update("externalUrl")} /></label>
            <label className="font-semibold md:col-span-2">URL do arquivo ou midia<input className={fieldClass} type="url" placeholder="https://..." value={form.fileUrl} onChange={update("fileUrl")} /></label>
          </>
        )}

        <label className="font-semibold md:col-span-2">Descricao<textarea className={`${fieldClass} min-h-36 resize-y`} maxLength={5000} value={form.description} onChange={update("description")} /></label>
        <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center">
          <Button type="submit" disabled={loading} className="disabled:cursor-wait disabled:opacity-60">{loading ? "Enviando..." : "Enviar para revisao"}</Button>
          {status && <p className={status.ok ? "text-sm font-semibold text-green-700 dark:text-green-300" : "text-sm font-semibold text-red-700 dark:text-red-300"} role="status">{status.message}</p>}
        </div>
      </form>
    </section>
  );
}

function CinemaShowFields({ form, update, updateSession, addSession, removeSession }) {
  return (
    <section className="md:col-span-2 rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="font-semibold">
          Numeracao da mostra *
          <input className={fieldClass} required maxLength={20} placeholder="VIII, IX ou X" value={form.showNumber} onChange={update("showNumber")} />
        </label>
        <label className="font-semibold">
          Link da playlist
          <input className={fieldClass} type="url" placeholder="https://youtube.com/playlist?list=..." value={form.playlistUrl} onChange={update("playlistUrl")} />
        </label>
        <label className="font-semibold md:col-span-2">
          Link geral para download/acervo da mostra
          <input className={fieldClass} type="url" placeholder="https://..." value={form.fileUrl} onChange={update("fileUrl")} />
        </label>
      </div>

      <div className="mt-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-title text-2xl text-text">Calendario com sessoes</h3>
          <p className="mt-1 text-sm text-muted">Adicione cada sessao com data, filme, link da sessao, link do filme e download para o acervo.</p>
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
              <label className="font-semibold">Link da sessao<input className={fieldClass} type="url" placeholder="https://..." value={session.sessionUrl} onChange={(event) => updateSession(index, "sessionUrl", event.target.value)} /></label>
              <label className="font-semibold">Link do filme<input className={fieldClass} type="url" placeholder="https://..." value={session.filmUrl} onChange={(event) => updateSession(index, "filmUrl", event.target.value)} /></label>
              <label className="font-semibold md:col-span-2">Download do filme para o acervo<input className={fieldClass} type="url" placeholder="https://..." value={session.archiveDownloadUrl} onChange={(event) => updateSession(index, "archiveDownloadUrl", event.target.value)} /></label>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContentList({ user, contents, refresh }) {
  const isCoordinator = user.role === "COORDINATOR";

  async function publish(content) {
    await api.patch(`/contents/${content.id}`, { published: !content.published });
    refresh();
  }

  async function remove(content) {
    if (!window.confirm(`Excluir "${content.title}"?`)) return;
    await api.delete(`/contents/${content.id}`);
    refresh();
  }

  return (
    <section className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-9">
      <div className="flex items-center gap-3"><Database className="text-primary" aria-hidden="true" /><h2 className="font-title text-3xl">Conteudos cadastrados</h2></div>
      {contents.length === 0 ? <p className="mt-6 text-muted">Nenhum conteudo cadastrado ainda.</p> : (
        <div className="mt-6 space-y-4">
          {contents.map((content) => (
            <article className="rounded-2xl border border-border bg-background p-5" key={content.id}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">{areaForType(content.type)?.label} - {typeLabel(content.type)}</p>
                  <h3 className="mt-2 font-title text-2xl">{content.title}</h3>
                  {content.type === "CINEMA_SHOW" && (
                    <p className="mt-2 text-sm text-muted">
                      Mostra: <strong className="text-text">{content.metadata?.showNumber || "Sem numeracao"}</strong>
                      {content.metadata?.sessions?.length ? ` - ${content.metadata.sessions.length} sessoes cadastradas` : ""}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-muted">Pesquisador(a): <strong className="text-text">{content.researcherName}</strong></p>
                  <p className="mt-1 text-xs text-muted">Enviado por {content.createdBy.name}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${content.published ? "bg-green-600/15 text-green-700 dark:text-green-300" : "bg-primary/10 text-primary"}`}>{content.published ? "Publicado" : "Em revisao"}</span>
                  {isCoordinator && <Button variant="outline" className="px-3 py-2 text-sm" type="button" onClick={() => publish(content)}>{content.published ? "Retirar" : <><CheckCircle2 className="inline" size={15} /> Publicar</>}</Button>}
                  {isCoordinator && <button className="cursor-pointer rounded-xl border border-red-500/40 p-2 text-red-700 transition hover:bg-red-500/10 dark:text-red-300" type="button" aria-label={`Excluir ${content.title}`} onClick={() => remove(content)}><Trash2 size={18} /></button>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AccessPage() {
  const [user, setUser] = useState(null);
  const [contents, setContents] = useState([]);
  const [checking, setChecking] = useState(true);

  const loadContents = useCallback(async () => {
    const { data } = await api.get("/contents/manage");
    setContents(data.contents);
  }, []);

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
    loadContents().catch(() => setContents([]));
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
    setContents([]);
  }

  if (checking) return <main className="grid min-h-[70vh] place-items-center"><p className="text-muted">Verificando acesso...</p></main>;

  return (
    <main className="bg-surface py-16 lg:py-24">
      <Container>
        {!user ? <Login onLogin={handleLogin} /> : <>
          <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Painel LACE</p><h1 className="mt-2 font-title text-4xl md:text-5xl">Ola, {user.name}</h1><p className="mt-2 text-muted">{user.role === "COORDINATOR" ? "Acesso de coordenacao" : "Acesso de pesquisadores e estudantes"}</p></div>
            <Button variant="dark" type="button" onClick={logout}><LogOut className="inline" size={17} /> Sair</Button>
          </header>
          <ContentForm onCreated={loadContents} />
          <ContentList user={user} contents={contents} refresh={loadContents} />
        </>}
      </Container>
    </main>
  );
}
