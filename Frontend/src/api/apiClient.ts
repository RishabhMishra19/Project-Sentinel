import LocalStorageService from "@/storage/LocalStorageService";
import axios, { type InternalAxiosRequestConfig, AxiosError } from "axios";
import { API_ENDPOINTS } from "./ApiEndpoints";
import authApi from "@/features/auth/api/authApi";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = LocalStorageService.getAccessToken();
  if (accessToken !== null) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (
      !error.config ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH_ACCESS_TOKEN)
    ) {
      return Promise.reject(error);
    }

    const refreshToken = LocalStorageService.getRefreshToken();

    if (!refreshToken) {
      LocalStorageService.clearAuth();
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      const { accessToken } = await authApi.refreshToken({ refreshToken });

      LocalStorageService.saveAccessToken(accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch {
      LocalStorageService.clearAuth();
      return Promise.reject(error);
    }
  },
);

export { apiClient };
