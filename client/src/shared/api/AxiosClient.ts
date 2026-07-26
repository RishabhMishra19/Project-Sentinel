import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { store } from "../../redux/store";
import { clearSession, setAuthSession } from "../../redux/session/sessionSlice";
import type { AuthSessionResponse } from "../../features/auth/dto/response/auth.response";
import type { ApiError } from "../dto/response";
import { API_BASE, AUTH_API_ROUTES, TENANT_ID_HEADER } from "./api.routes";

export const axiosClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//add jwt auth header and tenant id header interceptor
axiosClient.interceptors.request.use((config) => {
  const { accessToken, activeTenant } = store.getState().session;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (activeTenant) {
    config.headers[TENANT_ID_HEADER] = activeTenant.id;
  }
  return config;
});

let refreshPromise: Promise<AxiosResponse<AuthSessionResponse>> | null = null;

//add refresh token interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const original = error.config as InternalAxiosRequestConfig;

    if (isAccessTokenExpired(error)) {
      const data = await refreshAccessToken();
      if (data) {
        store.dispatch(setAuthSession(data));
        return axiosClient(original);
      } else {
        store.dispatch(clearSession());
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

const refreshAccessToken = async () => {
  try {
    if (!refreshPromise) {
      //for multiple requests, we only need to create one promise
      refreshPromise = axios.post<AuthSessionResponse>(
        `${API_BASE}${AUTH_API_ROUTES.REFRESH_TOKEN}`,
        {},
        { withCredentials: true },
      );
      refreshPromise.finally(() => {
        refreshPromise = null;
      });
    }
    const { data } = await refreshPromise;
    return data;
  } catch {
    store.dispatch(clearSession());
    return null;
  }
};

const isAccessTokenExpired = (error: AxiosError<ApiError>) => {
  return (
    error.response?.status === 401 &&
    error.response?.data?.errorCode === "ACCESS_TOKEN_EXPIRED"
  );
};
