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
