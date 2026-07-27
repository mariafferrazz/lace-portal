import { useCallback, useMemo, useState } from "react";
import { CheckCircle2, Clock3, ExternalLink, Link2, Pencil, Plus, Search, Trash2, Users, X } from "lucide-react";
import Button from "../../../../components/ui/Button";
import api, { apiError } from "../../../../services/api";
import { fieldClass } from "../constants";
import Modal from "./Modal";

const emptyLink = { name: "", url: "" };
const emptyMember = {
  name: "",
  role: "Equipe LACE",
  bio: "",
  links: [{ ...emptyLink }],
};

function memberForm(member = null) {
  if (!member) return { ...emptyMember, links: [{ ...emptyLink }] };
  return {
    name: member.name || "",
    role: member.role || "Equipe LACE",
    bio: member.bio || "",
    links: Array.isArray(member.links) && member.links.length > 0
      ? member.links.map((link) => ({ name: link.name || "", url: link.url || "" }))
      : [{ ...emptyLink }],
  };
}

function normalizeSearch(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function TeamMemberEditor({ member, canPublish, onSaved, onCancel }) {
  const [form, setForm] = useState(() => memberForm(member));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function updateLink(index, field, value) {
    setForm((current) => ({
      ...current,
      links: current.links.map((link, linkIndex) => (linkIndex === index ? { ...link, [field]: value } : link)),
    }));
  }

  function addLink() {
    setForm((current) => ({ ...current, links: [...current.links, { ...emptyLink }] }));
  }

  function removeLink(index) {
    setForm((current) => ({
      ...current,
      links: current.links.length === 1
        ? [{ ...emptyLink }]
        : current.links.filter((_, linkIndex) => linkIndex !== index),
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const payload = {
        ...form,
        links: form.links.filter((link) => link.name.trim() || link.url.trim()),
      };
      if (canPublish) {
        if (member?.id) await api.patch(`/team/${member.id}`, payload);
        else await api.post("/team", payload);
      } else {
        await api.post("/team/changes", { ...payload, teamMemberId: member.id });
      }
      await onSaved({ pending: !canPublish });
    } catch (error) {
      setStatus(apiError(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="mt-7 grid gap-5" onSubmit={submit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="font-semibold">
          Nome *
          <input className={fieldClass} required maxLength={160} value={form.name} onChange={update("name")} />
        </label>
        <label className="font-semibold">
          Função ou vínculo *
          <input className={fieldClass} required maxLength={120} value={form.role} onChange={update("role")} />
        </label>
      </div>

      <label className="font-semibold">
        Minibio *
        <textarea className={`${fieldClass} min-h-52 resize-y`} required value={form.bio} onChange={update("bio")} />
      </label>

      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-title text-2xl">Links do pesquisador</h3>
            <p className="mt-1 text-sm leading-6 text-muted">Informe o nome que aparecerá no botão e sua URL.</p>
          </div>
          <Button className="inline-flex min-w-48 flex-nowrap items-center justify-center gap-2 whitespace-nowrap" type="button" variant="outline" onClick={addLink}>
            <Plus className="shrink-0" size={16} aria-hidden="true" /> <span>Adicionar link</span>
          </Button>
        </div>

        <div className="mt-5 grid gap-4">
          {form.links.map((link, index) => (
            <div key={`${index}-${form.links.length}`} className="grid gap-3 rounded-2xl border border-border bg-background p-4 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)_auto] md:items-end">
              <label className="font-semibold">
                Nome do link
                <input className={fieldClass} maxLength={60} placeholder="Lattes, LinkedIn, Site..." value={link.name} onChange={(event) => updateLink(index, "name", event.target.value)} />
              </label>
              <label className="font-semibold">
                URL
                <input className={fieldClass} type="url" placeholder="https://..." value={link.url} onChange={(event) => updateLink(index, "url", event.target.value)} />
              </label>
              <button
                className="mb-0.5 grid size-12 cursor-pointer place-items-center rounded-xl border border-red-500/50 text-red-700 transition hover:border-red-500 hover:bg-red-600 hover:text-white dark:text-red-300 dark:hover:text-white"
                type="button"
                aria-label={`Remover link ${index + 1}`}
                title="Remover link"
                onClick={() => removeLink(index)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={saving} className="disabled:cursor-wait disabled:opacity-60">
          {saving
            ? "Salvando..."
            : !canPublish
              ? "Enviar para aprovação"
              : member?.id
                ? "Salvar alterações"
                : "Adicionar integrante"}
        </Button>
        <Button type="button" variant="dark" onClick={onCancel}>Cancelar</Button>
        {status && <p className="text-sm font-semibold text-red-700 dark:text-red-300" role="status">{status}</p>}
      </div>
    </form>
  );
}

export default function TeamManagement({ members, refresh, user }) {
  const isCoordinator = user.role === "COORDINATOR";
  const [open, setOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(undefined);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [removingId, setRemovingId] = useState("");
  const [changes, setChanges] = useState([]);
  const [reviewingId, setReviewingId] = useState("");

  const loadChanges = useCallback(async () => {
    try {
      const { data } = await api.get("/team/changes");
      setChanges(data.changes || []);
      return data.changes || [];
    } catch {
      setChanges([]);
      return [];
    }
  }, []);

  const visibleMembers = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    return [...members]
      .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"))
      .filter((member) => !normalizedQuery || normalizeSearch([member.name, member.role, member.bio].join(" ")).includes(normalizedQuery));
  }, [members, query]);

  function editMember(member) {
    const pendingChange = isCoordinator ? null : changes.find((change) => change.teamMemberId === member.id);
    setEditingMember(pendingChange ? { ...member, ...pendingChange.payload, id: member.id } : member);
  }

  async function saved({ pending }) {
    if (!pending) await refresh();
    await loadChanges();
    setEditingMember(undefined);
    setStatus(pending
      ? "Alteração enviada. A home será atualizada após a aprovação da coordenação."
      : "Cadastro salvo e conectado à equipe da home.");
  }

  async function openManagement() {
    setOpen(true);
    await loadChanges();
  }

  async function remove(member) {
    if (!window.confirm(`Remover "${member.name}" da equipe?\n\nA pessoa deixará de aparecer na home. Os conteúdos já enviados em seu nome serão preservados.`)) return;
    setRemovingId(member.id);
    setStatus("");
    try {
      await api.delete(`/team/${member.id}`);
      await refresh();
      setStatus(`${member.name} foi removido(a) da equipe.`);
    } catch (error) {
      setStatus(apiError(error));
    } finally {
      setRemovingId("");
    }
  }

  async function review(change, approved) {
    setReviewingId(change.id);
    setStatus("");
    try {
      await api.patch(`/team/changes/${change.id}/${approved ? "approve" : "reject"}`);
      if (approved) await refresh();
      await loadChanges();
      setStatus(approved
        ? `Alterações de ${change.teamMember?.name || "integrante"} aprovadas e publicadas.`
        : `Alterações de ${change.teamMember?.name || "integrante"} rejeitadas.`);
    } catch (error) {
      setStatus(apiError(error));
    } finally {
      setReviewingId("");
    }
  }

  return (
    <>
      <section className="mb-7 rounded-3xl border border-border bg-card p-6 md:p-9">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Users className="text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-title text-3xl">Equipe LACE</h2>
              <p className="mt-1 text-muted">{members.length} {members.length === 1 ? "integrante conectado" : "integrantes conectados"} à home.</p>
            </div>
          </div>
          <Button type="button" className="inline-flex min-w-56 flex-nowrap items-center justify-center gap-2 whitespace-nowrap" onClick={openManagement}>
            <Users className="shrink-0" size={17} aria-hidden="true" /> <span>{isCoordinator ? "Gerenciar equipe" : "Editar informações"}</span>
          </Button>
        </div>
      </section>

      {open && (
        <Modal onClose={() => { setOpen(false); setEditingMember(undefined); }} size="max-w-7xl">
          <div className="pr-14">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Dashboard administrativo</p>
            <h2 className="mt-2 font-title text-4xl md:text-5xl">Equipe LACE</h2>
            <p className="mt-3 text-muted">
              {isCoordinator
                ? "Edite os cadastros diretamente ou analise as propostas enviadas pela equipe."
                : "Escolha seu cadastro e envie as alterações para aprovação da coordenação."}
            </p>
          </div>

          {editingMember !== undefined ? (
            <TeamMemberEditor member={editingMember} canPublish={isCoordinator} onSaved={saved} onCancel={() => setEditingMember(undefined)} />
          ) : (
            <>
              <div className="mt-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <label className="min-w-0 flex-1 font-semibold">
                  Pesquisar integrante
                  <span className="relative mt-2 block">
                    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} aria-hidden="true" />
                    <input className={`${fieldClass} mt-0 pl-12`} type="search" placeholder="Digite o nome, função ou uma palavra da minibio" value={query} onChange={(event) => setQuery(event.target.value)} />
                  </span>
                </label>
                {isCoordinator && (
                  <Button className="inline-flex min-w-56 flex-nowrap items-center justify-center gap-2 whitespace-nowrap" type="button" onClick={() => setEditingMember(null)}>
                    <Plus className="shrink-0" size={17} aria-hidden="true" /> <span>Adicionar integrante</span>
                  </Button>
                )}
              </div>

              {status && <p className="mt-5 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm font-semibold text-primary" role="status">{status}</p>}

              {changes.length > 0 && (
                <section className="mt-7 rounded-2xl border border-primary/40 bg-primary/5 p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <Clock3 className="shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <h3 className="font-title text-2xl">Alterações aguardando aprovação</h3>
                      <p className="mt-1 text-sm text-muted">
                        {isCoordinator
                          ? "Revise as informações antes de publicá-las na home."
                          : "A coordenação precisa aprovar estas alterações antes da publicação."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {changes.map((change) => (
                      <article key={change.id} className="rounded-2xl border border-border bg-background p-4">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div className="min-w-0">
                            <p className="font-title text-xl">{change.teamMember?.name || change.payload?.name}</p>
                            <p className="mt-1 text-sm text-muted">
                              Nome proposto: <strong className="text-text">{change.payload?.name}</strong>
                            </p>
                            <p className="mt-1 text-sm text-muted">
                              {change.payload?.links?.length || 0} {change.payload?.links?.length === 1 ? "link informado" : "links informados"}
                              {isCoordinator && change.submittedBy?.name ? ` · Enviado por ${change.submittedBy.name}` : ""}
                            </p>
                          </div>
                          {isCoordinator && (
                            <div className="flex flex-wrap gap-2">
                              <Button className="inline-flex h-11 items-center justify-center gap-2 px-4 py-0 text-sm" type="button" disabled={reviewingId === change.id} onClick={() => review(change, true)}>
                                <CheckCircle2 size={16} aria-hidden="true" /> Aprovar
                              </Button>
                              <Button className="inline-flex h-11 items-center justify-center px-4 py-0 text-sm" type="button" variant="dark" disabled={reviewingId === change.id} onClick={() => review(change, false)}>
                                Rejeitar
                              </Button>
                            </div>
                          )}
                        </div>
                        <details className="mt-4 rounded-xl border border-border bg-card p-4">
                          <summary className="cursor-pointer font-semibold text-primary">Ver informações propostas</summary>
                          <div className="mt-4 grid gap-3">
                            <p className="text-sm text-muted">Função ou vínculo: <strong className="text-text">{change.payload?.role}</strong></p>
                            <div>
                              <p className="text-sm font-semibold text-text">Minibio</p>
                              <p className="mt-2 max-h-56 overflow-y-auto whitespace-pre-line leading-7 text-muted">{change.payload?.bio}</p>
                            </div>
                            {change.payload?.links?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {change.payload.links.map((link) => (
                                  <a key={link.url} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold text-primary transition hover:border-primary" href={link.url} target="_blank" rel="noreferrer">
                                    <Link2 size={13} aria-hidden="true" /> {link.name}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </details>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-7 grid gap-4 lg:grid-cols-2">
                {visibleMembers.map((member) => (
                  <article key={member.id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
                    <div className="min-w-0">
                      <h3 className="font-title text-2xl">{member.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-primary">{member.role}</p>
                      <p className="mt-3 line-clamp-3 leading-7 text-muted">{member.bio}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(member.links || []).map((link) => (
                          <span key={link.url} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted">
                            <Link2 size={13} aria-hidden="true" /> {link.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      <Button className="inline-flex h-11 w-40 items-center justify-center gap-2 px-3 py-0 text-sm" type="button" variant="outline" onClick={() => editMember(member)}>
                        <Pencil size={15} aria-hidden="true" /> {!isCoordinator && changes.some((change) => change.teamMemberId === member.id) ? "Editar proposta" : "Editar"}
                      </Button>
                      {isCoordinator && (
                        <button
                          className="grid size-11 cursor-pointer place-items-center rounded-xl border border-red-500/50 text-red-700 transition hover:border-red-500 hover:bg-red-600 hover:text-white disabled:cursor-wait disabled:opacity-50 dark:text-red-300 dark:hover:text-white"
                          type="button"
                          disabled={removingId === member.id}
                          aria-label={`Remover ${member.name}`}
                          title="Remover integrante"
                          onClick={() => remove(member)}
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      )}
                      {(member.links || []).length > 0 && (
                        <a className="grid size-11 place-items-center rounded-xl border border-border text-muted transition hover:border-primary hover:text-primary" href={member.links[0].url} target="_blank" rel="noreferrer" aria-label={`Abrir primeiro link de ${member.name}`} title="Abrir primeiro link">
                          <ExternalLink size={17} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
