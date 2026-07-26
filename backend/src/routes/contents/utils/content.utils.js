function uniqueValues(...values) {
  return [
    ...new Set(
      values
        .flat(Infinity)
        .filter(Boolean)
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  ];
}

function parseMetadata(value) {
  if (!value) return {};
  if (Buffer.isBuffer(value)) value = value.toString("utf8");

  if (typeof value === "string") {
    try {
      return JSON.parse(value || "{}");
    } catch {
      return {};
    }
  }

  return value;
}

function normalizeSlug(value = "") {
  return String(value)
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function showSlug(showNumber = "") {
  const slug = normalizeSlug(showNumber);
  return slug ? `${slug}-mostra` : "";
}

function extractShowNumber(title = "") {
  const match = String(title || "").trim().match(/^([IVXLCDM]+)\b/i);
  return match ? match[1].toUpperCase() : "";
}

function normalizeTitleForLookup(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\(\d{4}\)/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

module.exports = {
  uniqueValues,
  parseMetadata,
  normalizeSlug,
  showSlug,
  extractShowNumber,
  normalizeTitleForLookup,
};
