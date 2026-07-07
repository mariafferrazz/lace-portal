import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Database, LogOut, ShieldCheck, Trash2, Upload } from "lucide-react";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import api, { apiError } from "../../services/api";

const contentTypes = [
  ["FILM", "Filme"],
  ["GLOSSARY", "Verbete"],
  ["ARTICLE", "Artigo"],
  ["RESEARCH", "Pesquisa"],
  ["TRANSLATION", "Tradução"],
  ["VIRAL_ESCAPE_LINES", "Linhas de Fugas Virais"],
  ["INTERVIEW", "Entrevista"],
  ["PODCAST", "Podcast"],
  ["EVENT", "Evento"],
  ["OTHER", "Outro"],
];

const contentAreas = [
  { value: "CINEMA_DITADURA", label: "Cinema e Ditadura", types: ["FILM", "GLOSSARY"] },
  { value: "PRODUCAO_AUDIOVISUAL", label: "Produção Audiovisual", types: ["INTERVIEW", "PODCAST"] },
  { value: "PRODUCAO_ACADEMICA", label: "Produção Acadêmica", types: ["ARTICLE", "RESEARCH", "TRANSLATION"] },
  { value: "EVENTOS_ATIVIDADES", label: "Eventos e Atividades", types: ["EVENT", "VIRAL_ESCAPE_LINES"] },
  { value: "OUTROS", label: "Outros", types: ["OTHER"] },
];

const areaForType = (type) => contentAreas.find((area) => area.types.includes(type));

const initialForm = {
  title: "",
  researcherName: "",
  area: "CINEMA_DITADURA",
  type: "FILM",
  description: "",
  externalUrl: "",
  fileUrl: "",
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
      <p className="mt-3 leading-7 text-muted">Área exclusiva da coordenação, pesquisadores e estudantes do LACE.</p>
      <form className="mt-8 space-y-5" onSubmit={submit}>
        <label className="block font-semibold">E-mail
          <input className={fieldClass} type="email" autoComplete="username" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label className="block font-semibold">Senha
          <input className={fieldClass} type="password" autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>
        {error && <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>}
        <Button className="w-full disabled:cursor-wait disabled:opacity-60" type="submit" disabled={loading}>{loading ? "Entrando…" : "Entrar"}</Button>
      </form>
    </div>
  );
}

function ContentForm({ onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function updateArea(event) {
    const area = contentAreas.find((item) => item.value === event.target.value);
    setForm((current) => ({ ...current, area: area.value, type: area.types[0] }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await api.post("/contents", form);
      setForm(initialForm);
      setStatus({ ok: true, message: "Conteúdo enviado para revisão da coordenação." });
      onCreated();
    } catch (error) {
      setStatus({ ok: false, message: apiError(error) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 md:p-9">
      <div className="flex items-center gap-3 text-primary"><Upload aria-hidden="true" /><h2 className="font-title text-3xl text-text">Novo conteúdo</h2></div>
      <p className="mt-3 text-muted">O nome informado abaixo será exibido como autoria do material.</p>
      <form className="mt-7 grid gap-5 md:grid-cols-2" onSubmit={submit}>
        <label className="font-semibold">Título *<input className={fieldClass} required maxLength={200} value={form.title} onChange={update("title")} /></label>
        <label className="font-semibold">Nome do pesquisador *<input className={fieldClass} required maxLength={160} value={form.researcherName} onChange={update("researcherName")} /></label>
        <label className="font-semibold">Área editorial *
          <select className={fieldClass} required value={form.area} onChange={updateArea}>{contentAreas.map((area) => <option key={area.value} value={area.value}>{area.label}</option>)}</select>
        </label>
        <label className="font-semibold">Tipo de conteúdo *
          <select className={fieldClass} required value={form.type} onChange={update("type")}>{contentTypes.filter(([value]) => contentAreas.find((area) => area.value === form.area)?.types.includes(value)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </label>
        <label className="font-semibold">Link externo<input className={fieldClass} type="url" placeholder="https://…" value={form.externalUrl} onChange={update("externalUrl")} /></label>
        <label className="font-semibold md:col-span-2">URL do arquivo ou mídia<input className={fieldClass} type="url" placeholder="https://…" value={form.fileUrl} onChange={update("fileUrl")} /></label>
        <label className="font-semibold md:col-span-2">Descrição<textarea className={`${fieldClass} min-h-36 resize-y`} maxLength={5000} value={form.description} onChange={update("description")} /></label>
        <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center">
          <Button type="submit" disabled={loading} className="disabled:cursor-wait disabled:opacity-60">{loading ? "Enviando…" : "Enviar para revisão"}</Button>
          {status && <p className={status.ok ? "text-sm font-semibold text-green-700 dark:text-green-300" : "text-sm font-semibold text-red-700 dark:text-red-300"} role="status">{status.message}</p>}
        </div>
      </form>
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
    if (!window.confirm(`Excluir “${content.title}”?`)) return;
    await api.delete(`/contents/${content.id}`);
    refresh();
  }

  return (
    <section className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-9">
      <div className="flex items-center gap-3"><Database className="text-primary" aria-hidden="true" /><h2 className="font-title text-3xl">Conteúdos cadastrados</h2></div>
      {contents.length === 0 ? <p className="mt-6 text-muted">Nenhum conteúdo cadastrado ainda.</p> : (
        <div className="mt-6 space-y-4">
          {contents.map((content) => (
            <article className="rounded-2xl border border-border bg-background p-5" key={content.id}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">{areaForType(content.type)?.label} · {contentTypes.find(([value]) => value === content.type)?.[1] || content.type}</p>
                  <h3 className="mt-2 font-title text-2xl">{content.title}</h3>
                  <p className="mt-2 text-sm text-muted">Pesquisador(a): <strong className="text-text">{content.researcherName}</strong></p>
                  <p className="mt-1 text-xs text-muted">Enviado por {content.createdBy.name}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${content.published ? "bg-green-600/15 text-green-700 dark:text-green-300" : "bg-primary/10 text-primary"}`}>{content.published ? "Publicado" : "Em revisão"}</span>
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

  if (checking) return <main className="grid min-h-[70vh] place-items-center"><p className="text-muted">Verificando acesso…</p></main>;

  return (
    <main className="bg-surface py-16 lg:py-24">
      <Container>
        {!user ? <Login onLogin={handleLogin} /> : <>
          <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Painel LACE</p><h1 className="mt-2 font-title text-4xl md:text-5xl">Olá, {user.name}</h1><p className="mt-2 text-muted">{user.role === "COORDINATOR" ? "Acesso de coordenação" : "Acesso de pesquisadores e estudantes"}</p></div>
            <Button variant="dark" type="button" onClick={logout}><LogOut className="inline" size={17} /> Sair</Button>
          </header>
          <ContentForm onCreated={loadContents} />
          <ContentList user={user} contents={contents} refresh={loadContents} />
        </>}
      </Container>
    </main>
  );
}
