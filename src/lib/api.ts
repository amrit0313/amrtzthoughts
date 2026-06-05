import axios from "axios";

export function getApiBaseUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const trimmedUrl = rawUrl.trim().replace(/\/+$/, "");

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return trimmedUrl.startsWith("localhost") ||
    trimmedUrl.startsWith("127.0.0.1")
    ? `http://${trimmedUrl}`
    : `https://${trimmedUrl}`;
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      // Document cookie clearing as well if we are using middleware
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
