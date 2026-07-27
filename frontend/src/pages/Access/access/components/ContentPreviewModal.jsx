import { Pencil } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { contentImageUrls } from "../../../../utils/contentMetadata";
import { contentAreaLabel, typeLabel } from "../utils";
import ContentPreviewDetails from "./ContentPreviewDetails";
import Modal from "./Modal";

export default function ContentPreviewModal({ content, onClose, onEdit, user }) {
  const canEdit = user.role === "COORDINATOR" || !content.readOnly;
  const imageUrl = contentImageUrls(content)[0];
  return (
    <Modal onClose={onClose} size="max-w-5xl">
      <article className="pr-14"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">{contentAreaLabel(content)} - {typeLabel(content.type)}</p><h2 className="mt-3 font-title text-4xl md:text-5xl">{content.title}</h2><div className="mt-4 flex flex-wrap gap-2 text-sm text-muted"><span>Responsável: <strong className="text-text">{content.researcherName || "Equipe LACE"}</strong></span><span className={content.published ? "font-bold text-green-700 dark:text-green-300" : "font-bold text-primary"}>{content.published ? "Publicado" : "Em revisão"}</span></div></article>
      {imageUrl && <figure className="mt-8 overflow-hidden rounded-2xl border border-border bg-card"><img className="max-h-[420px] w-full object-cover" src={imageUrl} alt="" loading="lazy" decoding="async" /></figure>}
      <ContentPreviewDetails content={content} />
      {canEdit && <div className="mt-7"><Button variant="outline" type="button" onClick={() => onEdit(content)}><Pencil className="inline" size={16} /> Editar conteúdo</Button></div>}
    </Modal>
  );
}
