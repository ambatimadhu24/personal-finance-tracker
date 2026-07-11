import axios from "axios";

const DEFAULT_BASE = import.meta.env.VITE_API_BASE_URL || "";
const api = axios.create({ baseURL: DEFAULT_BASE });

api.interceptors.request.use((config) => {
  if (typeof config.url === "string") {
    if (config.url.startsWith("/")) {
      if (!config.url.startsWith("/api/")) config.url = `/api${config.url}`;
    } else if (!config.url.startsWith("http")) {
      config.url = `/api/${config.url}`;
    }
  }

  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
