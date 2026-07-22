const knownShowSlugs = new Set(["iii-mostra", "iv-mostra", "v-mostra", "vi-mostra", "vii-mostra"]);
const knownEventYears = new Set(["2021", "2022", "2023", "2024", "2025"]);

export function normalizeSlug(value = "") {
  return String(value)
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function showSlug(showNumber = "") {
  const slug = normalizeSlug(showNumber);
  return slug ? `${slug}-mostra` : "";
}

export function showPath(content) {
  if (content?.metadata?.cinemaPath) return content.metadata.cinemaPath;
  const slug = content?.metadata?.showSlug || showSlug(content?.metadata?.showNumber);
  return slug ? `/cinema-e-ditadura/${slug}` : "";
}

export function showLabel(content) {
  const number = content?.metadata?.showNumber || "";
  return number ? `${number} Mostra Cinema e Ditadura` : content?.title || "Mostra Cinema e Ditadura";
}

export function eventYear(content) {
  const value = content?.metadata?.eventYear || content?.metadata?.year || content?.metadata?.showYear;
  return value ? String(value).trim() : "";
}

export function eventYearPath(year) {
  return `/eventos/${year}`;
}

export function contentEventPath(content) {
  const year = eventYear(content);
  return content?.metadata?.eventPath || (year ? eventYearPath(year) : "");
}

export function isKnownShowSlug(slug) {
  return knownShowSlugs.has(slug);
}

export function isKnownEventYear(year) {
  return knownEventYears.has(String(year));
}
