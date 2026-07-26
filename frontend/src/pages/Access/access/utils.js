import { showSlug } from "../../../utils/contentRoutes";
import { contentAreas, contentTypes } from "./constants";

export const cleanUrlList = (urls = []) => [...new Set(urls.map((url) => String(url || "").trim()).filter(Boolean))];

export const ensureUrlList = (...values) => {
  const urls = cleanUrlList(values.flat().filter(Boolean));
  return urls.length ? urls : [""];
};

export const ensureTextList = (...values) => {
  const items = [...new Set(values.flat().map((value) => String(value || "").trim()).filter(Boolean))];
  return items.length ? items : [""];
};

export const uniqueUrls = (...values) => [...new Set(cleanUrlList(values.flat().filter(Boolean)))];
export const areaForType = (type) => contentAreas.find((area) => area.types.includes(type));
export const typeLabel = (type) => contentTypes.find(([value]) => value === type)?.[1] || type;

export function extractShowNumber(title = "") {
  const match = String(title).trim().match(/^([IVXLCDM]+)\b/i);
  return match ? match[1].toUpperCase() : "";
}

function romanNumberValue(value = "") {
  const roman = String(value).toUpperCase();
  if (!/^[IVXLCDM]+$/.test(roman)) return 0;

  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let previous = 0;

  for (let index = roman.length - 1; index >= 0; index -= 1) {
    const current = values[roman[index]];
    total += current < previous ? -current : current;
    previous = Math.max(previous, current);
  }

  return total;
}

function contentCreatedTime(content) {
  const timestamp = Date.parse(content?.createdAt || "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function contentEventYear(content) {
  const metadata = content?.metadata || {};
  const year = Number(metadata.eventYear || metadata.year || metadata.showYear || 0);
  return Number.isFinite(year) ? year : 0;
}

export function compareDashboardContents(left, right) {
  if (left.type === "CINEMA_SHOW" && right.type === "CINEMA_SHOW") {
    const yearDifference = contentEventYear(right) - contentEventYear(left);
    if (yearDifference !== 0) return yearDifference;

    const rightShowNumber = romanNumberValue(right.metadata?.showNumber || extractShowNumber(right.title));
    const leftShowNumber = romanNumberValue(left.metadata?.showNumber || extractShowNumber(left.title));
    const showDifference = rightShowNumber - leftShowNumber;
    if (showDifference !== 0) return showDifference;
  }

  if (left.type === "EVENT" && right.type === "EVENT") {
    const yearDifference = contentEventYear(right) - contentEventYear(left);
    if (yearDifference !== 0) return yearDifference;
  }

  return contentCreatedTime(right) - contentCreatedTime(left);
}

export function selectedEventYear(form) {
  return String(form.eventYear || "").trim();
}

export function showSlugFromTitle(title = "") {
  const number = extractShowNumber(title);
  return number ? showSlug(number) : showSlug(title);
}

export function contentAreaLabel(content) {
  const areas = content.metadata?.editorialAreas;
  if (Array.isArray(areas) && areas.length > 0) {
    return areas
      .map((areaValue) => contentAreas.find((area) => area.value === areaValue)?.label)
      .filter(Boolean)
      .join(" + ");
  }

  return contentAreas.find((area) => area.value === content.metadata?.editorialArea)?.label
    || areaForType(content.type)?.label;
}

export function contentBelongsToArea(content, area) {
  const editorialAreas = content.metadata?.editorialAreas;
  if (Array.isArray(editorialAreas) && editorialAreas.includes(area.value)) return true;
  if (content.metadata?.editorialArea === area.value) return true;
  if (content.type === "CINEMA_SHOW") return area.types.includes("CINEMA_SHOW");
  return area.types.includes(content.type) && areaForType(content.type)?.value === area.value;
}

export function formatDateInput(value = "") {
  const digits = String(value).replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join("/");
}

export function nonEmptyObjects(items = [], fields = []) {
  return items.filter((item) => fields.some((field) => String(item?.[field] || "").trim()));
}
