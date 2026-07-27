const API_BASE_URL = (import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000/api`)
  .replace(/\/+$/, "");
const REQUEST_TIMEOUT_MS = 15000;

function requestUrl(path, params) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`, window.location.origin);

  Object.entries(params || {}).forEach(([name, value]) => {
    if (value === undefined || value === null || value === "") return;
    const values = Array.isArray(value) ? value : [value];
    values.forEach((item) => url.searchParams.append(name, String(item)));
  });

  return url.toString();
}

async function parseResponse(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();

  const text = await response.text();
  return text || null;
}

async function request(method, path, data, config = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const hasBody = data !== undefined;
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

  try {
    const response = await fetch(requestUrl(path, config.params), {
      method,
      credentials: "include",
      signal: controller.signal,
      headers: {
        ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...(config.headers || {}),
      },
      ...(hasBody ? { body: isFormData ? data : JSON.stringify(data) } : {}),
    });
    const responseData = await parseResponse(response);

    if (!response.ok) {
      const error = new Error(responseData?.error || `Falha na requisiÃ§Ã£o (${response.status}).`);
      error.response = { data: responseData, status: response.status, headers: response.headers };
      throw error;
    }

    return { data: responseData, status: response.status, headers: response.headers };
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("Tempo limite da requisiÃ§Ã£o excedido.");
      timeoutError.code = "ECONNABORTED";
      throw timeoutError;
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

const api = {
  get(path, config) {
    return request("GET", path, undefined, config);
  },
  post(path, data, config) {
    return request("POST", path, data, config);
  },
  patch(path, data, config) {
    return request("PATCH", path, data, config);
  },
  delete(path, config) {
    return request("DELETE", path, undefined, config);
  },
};

export function apiError(error) {
  if (error.code === "ECONNABORTED") return "A operação demorou demais. Tente novamente em instantes.";
  return error.response?.data?.error || "Não foi possível concluir a operação.";
}

export default api;
