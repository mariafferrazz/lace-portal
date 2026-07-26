import { useCallback, useMemo, useState } from "react";
import { Database, FolderUp, Plus } from "lucide-react";
import Button from "../../../../components/ui/Button";
import api from "../../../../services/api";
import { contentAreas } from "../constants";
import { createInitialForm } from "../formState";
import { contentBelongsToArea, typeLabel } from "../utils";
import AreaModal from "./AreaModal";
import ContentForm from "./ContentForm";
import ContentPreviewModal from "./ContentPreviewModal";
import Modal from "./Modal";
import PendingApprovals from "./PendingApprovals";

export default function EditorialDashboard({ user, contents, refresh, teamMembers, referenceOptions, ensureFormData, onReferenceCreated }) {
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
    await ensureFormData();
    setAddDefaults(defaults);
  }, [ensureFormData]);

  const editContent = useCallback(async (content) => {
    await ensureFormData();
    setEditingContent(await getFullContent(content));
  }, [ensureFormData, getFullContent]);

  const openContent = useCallback(async (content) => {
    setPreviewContent(await getFullContent(content));
  }, [getFullContent]);

  return (
    <>
      {user.role === "COORDINATOR" && (
        <PendingApprovals contents={contents} refresh={refresh} onEdit={editContent} onOpen={openContent} />
      )}

      <section className="rounded-3xl border border-border bg-card p-6 md:p-9">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Database className="text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-title text-3xl">Conteúdos cadastrados</h2>
              <p className="mt-1 text-muted">Escolha uma área editorial para ver os tipos de conteúdo.</p>
            </div>
          </div>
          <Button type="button" className="inline-flex min-w-56 flex-nowrap items-center justify-center gap-2 whitespace-nowrap" onClick={() => addContent(createInitialForm())}>
            <Plus className="shrink-0" size={17} aria-hidden="true" /> <span>Adicionar conteúdo</span>
          </Button>
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
                <span className="mt-2 text-sm text-muted">{count} {count === 1 ? "conteúdo" : "conteúdos"}</span>
                <span className="mt-4 flex flex-wrap gap-2">
                  {area.types.map((type) => (
                    <span key={type} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted group-hover:border-primary/60">
                      {typeLabel(type)}
                    </span>
                  ))}
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
          Carregando conteúdo...
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
            referenceOptions={referenceOptions}
            onReferenceCreated={onReferenceCreated}
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
            referenceOptions={referenceOptions}
            onReferenceCreated={onReferenceCreated}
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
