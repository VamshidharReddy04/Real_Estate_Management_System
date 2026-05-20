import axios from "axios";

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();

  // If explicitly set in environment, use it
  if (envUrl) {
    const normalized = envUrl.replace(/\/+$/, "");
    if (/^https?:\/\//i.test(normalized)) {
      return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
    }
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
  }

  // Use Render backend URL for both dev and production
  return "https://real-estate-management-system-rh4j.onrender.com/api";
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
