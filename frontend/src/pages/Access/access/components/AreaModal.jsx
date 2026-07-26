import { useMemo, useState } from "react";
import { Database, Plus } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { contentBelongsToArea, typeLabel } from "../utils";
import ContentCard from "./ContentCard";
import Modal from "./Modal";

export default function AreaModal({
  area,
  contents,
  user,
  refresh,
  onClose,
  onAddContent,
  onEditContent,
  onOpenContent,
}) {
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
        <Button type="button" className="inline-flex min-w-56 flex-nowrap items-center justify-center gap-2 whitespace-nowrap" onClick={() => onAddContent(area.value, selectedType)}>
          <Plus className="shrink-0" size={17} aria-hidden="true" /> <span>Adicionar conteudo</span>
        </Button>
      </div>

      <div className="mt-7 space-y-4">
        {visibleContents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8">
            <Database className="text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-title text-2xl">Nenhum conteudo deste tipo</h3>
            <p className="mt-2 text-muted">Use o botao acima para cadastrar o primeiro item.</p>
          </div>
        ) : visibleContents.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            user={user}
            refresh={refresh}
            onEdit={onEditContent}
            onOpen={onOpenContent}
          />
        ))}
      </div>
    </Modal>
  );
}
