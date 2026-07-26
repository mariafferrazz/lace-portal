import { useMemo, useState } from "react";
import { Database, Plus, Search, X } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { compareDashboardContents, contentBelongsToArea, typeLabel } from "../utils";
import ContentCard from "./ContentCard";
import Modal from "./Modal";

function normalizeSearch(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function searchableText(content) {
  const metadata = content.metadata || {};
  return normalizeSearch([
    content.title,
    content.description,
    typeLabel(content.type),
    content.researcherName,
    content.createdBy?.name,
    metadata.shortTitle,
    metadata.showNumber,
    metadata.eventYear,
    metadata.period,
    metadata.alphabetLetter,
  ].filter(Boolean).join(" "));
}

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
  const [searchQuery, setSearchQuery] = useState("");

  const areaContents = useMemo(
    () => contents
      .filter((content) => contentBelongsToArea(content, area))
      .sort(compareDashboardContents),
    [area, contents],
  );

  const indexedContents = useMemo(
    () => areaContents.map((content) => ({ content, searchText: searchableText(content) })),
    [areaContents],
  );

  const normalizedQuery = normalizeSearch(searchQuery);
  const contentsOfSelectedType = useMemo(
    () => indexedContents.filter(({ content }) => content.type === selectedType),
    [indexedContents, selectedType],
  );
  const visibleContents = useMemo(
    () => contentsOfSelectedType
      .filter(({ searchText }) => !normalizedQuery || searchText.includes(normalizedQuery))
      .map(({ content }) => content),
    [contentsOfSelectedType, normalizedQuery],
  );

  return (
    <Modal onClose={onClose}>
      <div className="pr-14">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Área editorial</p>
        <h2 className="mt-2 font-title text-4xl md:text-5xl">{area.label}</h2>
        <p className="mt-3 text-muted">{areaContents.length} conteúdos cadastrados nesta área.</p>
      </div>

      <div className="mt-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {area.types.map((type) => (
            <button
              key={type}
              type="button"
              className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${selectedType === type ? "border-primary bg-primary-fill text-on-primary" : "border-border bg-card text-text hover:border-primary hover:text-primary"}`}
              onClick={() => {
                setSelectedType(type);
                setSearchQuery("");
              }}
            >
              {typeLabel(type)}
            </button>
          ))}
        </div>
        <Button type="button" className="inline-flex min-w-56 flex-nowrap items-center justify-center gap-2 whitespace-nowrap" onClick={() => onAddContent(area.value, selectedType)}>
          <Plus className="shrink-0" size={17} aria-hidden="true" /> <span>Adicionar conteúdo</span>
        </Button>
      </div>

      <div className="mt-7">
        <label className="block text-sm font-semibold text-text" htmlFor="dashboard-content-search">
          Pesquisar em {typeLabel(selectedType)}
        </label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={19} aria-hidden="true" />
          <input
            id="dashboard-content-search"
            className="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-12 text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
            type="search"
            autoComplete="off"
            placeholder="Digite o título, responsável ou uma palavra-chave"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted transition hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              type="button"
              aria-label="Limpar pesquisa"
              title="Limpar pesquisa"
              onClick={() => setSearchQuery("")}
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-muted" aria-live="polite">
          {normalizedQuery
            ? `${visibleContents.length} ${visibleContents.length === 1 ? "resultado encontrado" : "resultados encontrados"}`
            : `${contentsOfSelectedType.length} ${contentsOfSelectedType.length === 1 ? "conteúdo neste tipo" : "conteúdos neste tipo"}`}
        </p>
      </div>

      <div className="mt-7 space-y-4">
        {contentsOfSelectedType.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8">
            <Database className="text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-title text-2xl">Nenhum conteúdo deste tipo</h3>
            <p className="mt-2 text-muted">Use o botão acima para cadastrar o primeiro item.</p>
          </div>
        ) : visibleContents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8">
            <Search className="text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-title text-2xl">Nenhum resultado encontrado</h3>
            <p className="mt-2 text-muted">Tente pesquisar outra palavra ou limpe o campo de busca.</p>
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
