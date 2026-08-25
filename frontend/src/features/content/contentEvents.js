export const CONTENT_UPDATED_EVENT = "lace:content-updated";

export function notifyContentUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
  }
}
