import { useState } from "react";
import api, { apiError } from "../../../../services/api";
import {
  contentAreas,
  emptyCredit,
  emptyEpisode,
  emptyInfo,
  emptyPerson,
  emptyResource,
  emptySession,
  emptySessionFilm,
  maxEmbeddedImageSize,
} from "../constants";
import { buildContentPayload, createInitialForm, formFromContent } from "../formState";
import { ensureUrlList, extractShowNumber, selectedEventYear } from "../utils";

function validRelatedLinkUrl(value) {
  const url = String(value || "").trim();
  if (/^\/(?!\/)/.test(url)) return true;

  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

export default function useContentForm({ content, initialArea, initialType, onCreated, onClose, teamMembers, onReferenceCreated }) {
  const isEditing = Boolean(content);
  const [form, setForm] = useState(() => (content ? formFromContent(content) : createInitialForm(initialArea, initialType)));
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function updateCheckbox(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.checked }));
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
      const urls = current[field].length === 1 ? [""] : current[field].filter((_, itemIndex) => itemIndex !== index);
      return { ...current, [field]: urls, [field.replace(/s$/, "")]: urls[0] || "" };
    });
  }

  function updateTextList(field, index, value) {
    setForm((current) => ({ ...current, [field]: current[field].map((item, itemIndex) => itemIndex === index ? value : item) }));
  }

  function addText(field) {
    setForm((current) => ({ ...current, [field]: [...current[field], ""] }));
  }

  function removeText(field, index) {
    setForm((current) => ({ ...current, [field]: current[field].length === 1 ? [""] : current[field].filter((_, itemIndex) => itemIndex !== index) }));
  }

  function updateObject(field, index, key, value) {
    setForm((current) => ({ ...current, [field]: current[field].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) }));
  }

  function updateNestedObject(field, index, nestedField, nestedIndex, key, value) {
    setForm((current) => ({ ...current, [field]: current[field].map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      return {
        ...item,
        [nestedField]: item[nestedField].map((nestedItem, currentNestedIndex) => (
          currentNestedIndex === nestedIndex ? { ...nestedItem, [key]: value } : nestedItem
        )),
      };
    }) }));
  }

  function addNestedObject(field, index, nestedField, emptyValue) {
    setForm((current) => ({ ...current, [field]: current[field].map((item, itemIndex) => (
      itemIndex === index
        ? { ...item, [nestedField]: [...item[nestedField], { ...emptyValue }] }
        : item
    )) }));
  }

  function removeNestedObject(field, index, nestedField, nestedIndex, emptyValue) {
    setForm((current) => ({ ...current, [field]: current[field].map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      const nestedItems = item[nestedField].length === 1
        ? [{ ...emptyValue }]
        : item[nestedField].filter((_, currentNestedIndex) => currentNestedIndex !== nestedIndex);
      return { ...item, [nestedField]: nestedItems };
    }) }));
  }

  function addObject(field, emptyValue) {
    setForm((current) => ({ ...current, [field]: [...current[field], { ...emptyValue }] }));
  }

  function removeObject(field, index, emptyValue) {
    setForm((current) => ({ ...current, [field]: current[field].length === 1 ? [{ ...emptyValue }] : current[field].filter((_, itemIndex) => itemIndex !== index) }));
  }

  function updateNestedUrlList(field, index, nestedField, urlIndex, value) {
    setForm((current) => ({ ...current, [field]: current[field].map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      const urls = [...item[nestedField]];
      urls[urlIndex] = value;
      return { ...item, [nestedField]: urls, [nestedField.replace(/s$/, "")]: urls[0] || "" };
    }) }));
  }

  function addNestedUrl(field, index, nestedField) {
    setForm((current) => ({ ...current, [field]: current[field].map((item, itemIndex) => itemIndex === index ? { ...item, [nestedField]: [...item[nestedField], ""] } : item) }));
  }

  function removeNestedUrl(field, index, nestedField, urlIndex) {
    setForm((current) => ({ ...current, [field]: current[field].map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      const urls = item[nestedField].length === 1 ? [""] : item[nestedField].filter((_, nestedIndex) => nestedIndex !== urlIndex);
      return { ...item, [nestedField]: urls, [nestedField.replace(/s$/, "")]: urls[0] || "" };
    }) }));
  }

  function toggleId(field, id) {
    setForm((current) => ({ ...current, [field]: current[field].includes(id) ? current[field].filter((item) => item !== id) : [...current[field], id] }));
  }

  function updateImageFile(file) {
    setStatus(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) return setStatus({ ok: false, message: "Selecione apenas arquivos de imagem." });
    if (file.size > maxEmbeddedImageSize) return setStatus({ ok: false, message: "Esta imagem está muito pesada. Use uma URL pública ou escolha uma imagem com até 2 MB." });
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setForm((current) => ({ ...current, imageUrl: reader.result, imageUrls: ensureUrlList(reader.result, current.imageUrls.slice(1)) }));
    };
    reader.onerror = () => setStatus({ ok: false, message: "Não foi possível carregar esta imagem. Tente usar uma URL pública." });
    reader.readAsDataURL(file);
  }

  function updateArea(event) {
    const area = contentAreas.find((item) => item.value === event.target.value);
    if (area) setForm(createInitialForm(area.value, area.types[0]));
  }

  function updateType(event) {
    setForm((current) => ({ ...createInitialForm(current.area, event.target.value), researcherName: current.researcherName, researcherMemberId: current.researcherMemberId }));
  }

  function updateResearcher(event) {
    if (event.target.value.startsWith("name:")) return setForm((current) => ({ ...current, researcherMemberId: event.target.value, researcherName: event.target.value.replace(/^name:/, "") }));
    const member = teamMembers.find((item) => item.id === event.target.value);
    setForm((current) => ({ ...current, researcherMemberId: member?.id || "", researcherName: member?.name || "" }));
  }

  async function createArticleAuthor({ name, description }) {
    try {
      setStatus(null);
      const { data } = await api.post("/contents", {
        title: name.trim(),
        researcherName: form.researcherName.trim() || "Equipe LACE",
        type: "ARTICLE_AUTHOR",
        description: description.trim(),
        metadata: { editorialArea: "PRODUCAO_ACADEMICA", pageKind: "ARTICLE_AUTHOR" },
      });
      setForm((current) => ({ ...current, articleAuthorIds: [...new Set([...current.articleAuthorIds, data.content.id])] }));
      await onReferenceCreated?.(data.content);
      return data.content;
    } catch (error) {
      setStatus({ ok: false, message: apiError(error) });
      throw error;
    }
  }

  async function removeArticleAuthor(author) {
    try {
      setStatus(null);
      const { data } = await api.delete(`/contents/${author.id}`);
      setForm((current) => ({
        ...current,
        articleAuthorIds: current.articleAuthorIds.filter((authorId) => authorId !== author.id),
      }));
      await onReferenceCreated?.();
      const deletedWorks = Number(data.deletedWorks || 0);
      const preservedSharedWorks = Number(data.preservedSharedWorks || 0);
      const sharedMessage = preservedSharedWorks > 0
        ? ` ${preservedSharedWorks} ${preservedSharedWorks === 1 ? "artigo em coautoria foi preservado" : "artigos em coautoria foram preservados"}.`
        : "";
      setStatus({
        ok: true,
        message: `${author.title} foi removido(a). ${deletedWorks} ${deletedWorks === 1 ? "artigo exclusivo foi excluído" : "artigos exclusivos foram excluídos"}.${sharedMessage}`,
      });
      return data;
    } catch (error) {
      setStatus({ ok: false, message: apiError(error) });
      throw error;
    }
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    if (!form.title.trim()) {
      setStatus({ ok: false, message: "Informe o título." });
      setLoading(false);
      return;
    }
    if (form.type === "CINEMA_SHOW" && !extractShowNumber(form.title)) {
      setStatus({ ok: false, message: "Comece o título com a numeração da mostra, como VIII Mostra Cinema e Ditadura." });
      setLoading(false);
      return;
    }
    if (form.type === "ARTICLE" && form.articleAuthorIds.length === 0) {
      setStatus({ ok: false, message: "Selecione ou adicione pelo menos um autor para o artigo." });
      setLoading(false);
      return;
    }
    if (form.type === "ARTICLE" && !form.pdfUrl.trim()) {
      setStatus({ ok: false, message: "Informe o link do artigo em PDF." });
      setLoading(false);
      return;
    }
    if (form.type === "EVENT") {
      const relatedLinks = form.relatedLinks.filter((link) => link.name.trim() || link.url.trim());
      if (relatedLinks.some((link) => !link.name.trim() || !link.url.trim())) {
        setStatus({ ok: false, message: "Preencha o nome e a URL de cada link relacionado." });
        setLoading(false);
        return;
      }
      if (relatedLinks.some((link) => !validRelatedLinkUrl(link.url))) {
        setStatus({ ok: false, message: "Use uma URL pública válida ou um caminho interno iniciado por / nos links relacionados." });
        setLoading(false);
        return;
      }
    }
    if (["CINEMA_SHOW", "EVENT"].includes(form.type) && !selectedEventYear(form)) {
      setStatus({ ok: false, message: "Informe o ano do evento ou da mostra." });
      setLoading(false);
      return;
    }

    try {
      let formToSave = form;
      if (form.type === "CINEMA_SHOW") {
        const sessions = await Promise.all(form.sessions.map(async (session) => {
          const films = await Promise.all(session.films.map(async (film) => {
            if (!film.addToDatabase || film.filmId) return film;
            if (!film.title.trim() || !film.filmUrl.trim()) {
              throw new Error("Para cadastrar um novo filme, informe o título e a URL do filme.");
            }

            const { data: filmData } = await api.post("/contents", {
              title: film.title.trim(),
              researcherName: form.researcherName.trim(),
              researcherMemberId: form.researcherMemberId && !form.researcherMemberId.startsWith("name:")
                ? form.researcherMemberId
                : null,
              type: "FILM",
              description: "",
              externalUrl: film.filmUrl.trim(),
              metadata: {
                editorialArea: "CINEMA_DITADURA",
                direction: film.direction.trim() || null,
                year: film.year.trim() || null,
                videoUrl: film.filmUrl.trim(),
                cardExcerptWords: 45,
              },
            });
            return { ...film, filmId: filmData.content.id, addToDatabase: false };
          }));
          return { ...session, films };
        }));
        formToSave = { ...form, sessions };
        await onReferenceCreated?.();
      }

      const payload = buildContentPayload(formToSave, content?.metadata);
      const { data } = isEditing ? await api.patch(`/contents/${content.id}`, payload) : await api.post("/contents", payload);
      setForm(createInitialForm(initialArea, initialType));
      const publicationMessage = data.content?.published
        ? "Conteúdo publicado e conectado ao site."
        : "Conteúdo salvo e enviado para revisão da coordenação.";
      setStatus({ ok: true, message: isEditing ? `Conteúdo atualizado. ${publicationMessage}` : publicationMessage });
      await onCreated(data.content);
      onClose?.();
    } catch (error) {
      setStatus({ ok: false, message: error.response ? apiError(error) : error.message });
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    status,
    loading,
    isEditing,
    update,
    updateCheckbox,
    updateArea,
    updateType,
    updateResearcher,
    updateUrlList,
    addUrl,
    removeUrl,
    updateTextList,
    addText,
    removeText,
    updateObject,
    addObject,
    removeObject,
    updateNestedObject,
    addNestedObject,
    removeNestedObject,
    updateNestedUrlList,
    addNestedUrl,
    removeNestedUrl,
    toggleId,
    updateImageFile,
    createArticleAuthor,
    removeArticleAuthor,
    emptyEpisode,
    emptyPerson,
    emptyCredit,
    emptyInfo,
    emptyResource,
    emptySession,
    emptySessionFilm,
    submit,
  };
}
