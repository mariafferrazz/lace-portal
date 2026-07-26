import api from "../../../services/api";

export async function loadContentNavigation() {
  const { data } = await api.get("/contents/navigation");
  return data.contents || [];
}

export async function loadEventsByYear(year) {
  const { data } = await api.get(`/contents/events/year/${year}`);
  return data.contents || [];
}

export async function loadCinemaShow(slug) {
  const { data } = await api.get(`/contents/cinema-shows/${slug}`);
  return data.content;
}
