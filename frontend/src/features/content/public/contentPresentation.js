export function publicDetailPath(content) {
  const metadata = content.metadata || {};
  if (content.type === "CINEMA_SHOW") return metadata.cinemaPath || metadata.detailPath || null;
  return metadata.pagePath || metadata.detailPath || null;
}

export function eventInteraction(content) {
  const path = publicDetailPath(content);
  if (content.type === "CINEMA_SHOW" && path) return { mode: "PAGE", path, label: "Ver detalhes da mostra" };
  return { mode: "MODAL", path: null, label: "Ver detalhes" };
}

export function visibleSections(content) {
  const metadata = content.metadata || {};
  return {
    imageUrls: (metadata.imageUrls || []).filter(Boolean),
    episodes: (metadata.episodes || []).filter((item) => item.title || item.url || item.description),
    people: (metadata.people || metadata.team || []).filter((item) => item.name || item.description || item.role),
    credits: (metadata.credits || metadata.additionalInfo || []).filter((item) => item.title || item.value || item.description),
    resources: (metadata.resources || []).filter((item) => item.title || item.url),
    references: (metadata.references || []).filter(Boolean),
  };
}
