export function limitCharacters(value, limit) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;

  const shortened = text.slice(0, Math.max(0, limit - 1));
  const lastSpace = shortened.lastIndexOf(" ");
  const cutAt = lastSpace > limit * 0.7 ? lastSpace : Math.max(0, limit - 1);
  return `${shortened.slice(0, cutAt).trim()}…`;
}
