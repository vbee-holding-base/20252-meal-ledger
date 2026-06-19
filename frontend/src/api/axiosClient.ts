import axios from "axios";

// API Base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api/v1";

// In-memory token storage
let inMemoryToken: string | null = null;

export const getAccessToken = () => inMemoryToken;
export const setAccessToken = (token: string | null) => {
  inMemoryToken = token;
};

// Create axios instance for authenticated requests
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for sending cookies (refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

// Create axios instance for public requests
export const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach access token if available
axiosClient.interceptors.request.use(
  (config) => {
    if (inMemoryToken) {
      config.headers["Authorization"] = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Handle 401 and refresh token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      const limit = error.response.headers["x-ratelimit-limit"] || "Unknown";
      const remaining = error.response.headers["x-ratelimit-remaining"] || "0";
      const retryAfter = error.response.headers["retry-after"] || "60";

      window.dispatchEvent(
        new CustomEvent("rateLimitExceeded", {
          detail: { limit, remaining, retryAfter: parseInt(retryAfter, 10) },
        }),
      );

      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token using HttpOnly cookie
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = refreshResponse.data.access_token;
        setAccessToken(newAccessToken);

        // Update the authorization header for the original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear token and redirect to login
        setAccessToken(null);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
