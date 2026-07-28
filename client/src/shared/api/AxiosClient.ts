import axios from "axios";
import { store } from "../../redux/store";
import { API_BASE, TENANT_ID_HEADER } from "./api.routes";
import { AuthUtils } from "../../features/auth/AuthUtils";

export const axiosClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//add jwt auth header and tenant id header interceptor
// refresh access token if needed
axiosClient.interceptors.request.use(async (config) => {
  if (AuthUtils.isRefreshAccessTokenRequest(config)) {
    return config;
  }

  if (
    AuthUtils.isAccessTokenExpiredOrAboutToExpire() ||
    store.getState().session.state === "RESTORING_AUTH"
  ) {
    await AuthUtils.refreshAccessToken();
  }
  const session = store.getState().session;
  if (session.state === "LOGGED_IN") {
    config.headers.Authorization = `Bearer ${session.auth.accessToken}`;
    if (session.activeTenant) {
      config.headers[TENANT_ID_HEADER] = session.activeTenant.id;
    }
  }
  return config;
});
