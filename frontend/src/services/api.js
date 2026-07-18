import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000/api`,
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export function apiError(error) {
  if (error.code === "ECONNABORTED") return "A operação demorou demais. Tente novamente em instantes.";
  return error.response?.data?.error || "Não foi possível concluir a operação.";
}

export default api;
