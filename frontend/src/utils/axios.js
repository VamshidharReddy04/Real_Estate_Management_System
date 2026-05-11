import axios from "axios";

const getApiBaseUrl = () => {
  const rawBaseUrl = import.meta.env.VITE_API_URL?.trim();

  if (!rawBaseUrl || rawBaseUrl === "/") return "/api";

  const baseUrl = rawBaseUrl.replace(/\/+$/, "");

  if (/^https?:\/\//i.test(baseUrl)) {
    return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
  }

  return baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`;
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default API;
