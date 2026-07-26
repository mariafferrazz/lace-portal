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
  maxEmbeddedImageSize,
} from "../constants";
import { buildContentPayload, createInitialForm, formFromContent } from "../formState";
import { ensureUrlList, extractShowNumber, selectedEventYear } from "../utils";

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
    if (file.size > maxEmbeddedImageSize) return setStatus({ ok: false, message: "Esta imagem esta muito pesada. Use uma URL publica ou escolha uma imagem com ate 2 MB." });
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setForm((current) => ({ ...current, imageUrl: reader.result, imageUrls: ensureUrlList(reader.result, current.imageUrls.slice(1)) }));
    };
    reader.onerror = () => setStatus({ ok: false, message: "Nao foi possivel carregar esta imagem. Tente usar uma URL publica." });
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
        researcherName: form.researcherName.trim(),
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

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    if (!form.title.trim()) {
      setStatus({ ok: false, message: "Informe o titulo." });
      setLoading(false);
      return;
    }
    if (form.type === "CINEMA_SHOW" && !extractShowNumber(form.title)) {
      setStatus({ ok: false, message: "Comece o titulo com a numeracao da mostra, como VIII Mostra Cinema e Ditadura." });
      setLoading(false);
      return;
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
          if (!session.addFilmToDatabase || session.filmId) return session;
          if (!session.title.trim() || !session.filmUrl.trim()) {
            throw new Error("Para adicionar um filme ao banco, informe o titulo alternativo e a URL do filme.");
          }

          const { data: filmData } = await api.post("/contents", {
            title: session.title.trim(),
            researcherName: form.researcherName.trim(),
            researcherMemberId: form.researcherMemberId && !form.researcherMemberId.startsWith("name:")
              ? form.researcherMemberId
              : null,
            type: "FILM",
            description: "",
            externalUrl: session.filmUrl.trim(),
            metadata: {
              editorialArea: "CINEMA_DITADURA",
              direction: session.direction.trim() || null,
              videoUrl: session.filmUrl.trim(),
              cardExcerptWords: 45,
            },
          });
          return { ...session, filmId: filmData.content.id, addFilmToDatabase: false };
        }));
        formToSave = { ...form, sessions };
        await onReferenceCreated?.();
      }

      const payload = buildContentPayload(formToSave);
      const { data } = isEditing ? await api.patch(`/contents/${content.id}`, payload) : await api.post("/contents", payload);
      setForm(createInitialForm(initialArea, initialType));
      const publicationMessage = data.content?.published
        ? "Conteudo publicado e conectado ao site."
        : "Conteudo salvo e enviado para revisao da coordenacao.";
      setStatus({ ok: true, message: isEditing ? `Conteudo atualizado. ${publicationMessage}` : publicationMessage });
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
    updateNestedUrlList,
    addNestedUrl,
    removeNestedUrl,
    toggleId,
    updateImageFile,
    createArticleAuthor,
    emptyEpisode,
    emptyPerson,
    emptyCredit,
    emptyInfo,
    emptyResource,
    emptySession,
    submit,
  };
}
