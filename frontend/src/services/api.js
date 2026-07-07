import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function apiError(error) {
  return error.response?.data?.error || "Não foi possível concluir a operação.";
}

export default api;
