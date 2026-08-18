import {
  setActiveTenant,
  setAuth,
  setNoAuth,
  setRestoringAuth,
  clearActiveTenant,
} from "../../redux/session/sessionSlice";
import { store } from "../../redux/store";
import { localStorageManager } from "../../shared/storage/LocalStorageManager";
import type { AuthSessionResponse } from "./dto/response/auth.response";
import { AuthApi } from "./api/AuthApi";
import type { TenantSummary } from "../tenants/dto/response/tenant.response";
import type { InternalAxiosRequestConfig } from "axios";
import { AUTH_API_ROUTES } from "../../shared/api/api.routes";

export class AuthUtils {
  private static readonly REFRESH_TOKEN_FLAG = "sentinel.refreshTokenFlag";
  private static readonly ACTIVE_TENANT = "sentinel.activeTenant";
  private static readonly ACCESS_TOKEN_EXPIRATION_TIME = 1000 * 60 * 1; //1 minutes before expiration or after expiration

  static isRefreshAccessTokenRequest = (config: InternalAxiosRequestConfig<any>) => {
    return config.url?.includes(AUTH_API_ROUTES.REFRESH_TOKEN);
  };

  static isAccessTokenExpiredOrAboutToExpire = () => {
    const session = store.getState().session;
    if (session.state === "LOGGED_IN") {
      const expiresAt = new Date(session.auth.expiresAt).getTime();
      const now = Date.now();
      return expiresAt - now < AuthUtils.ACCESS_TOKEN_EXPIRATION_TIME; //1 minutes before expiration or after expiration
    }
    return false;
  };

  static getActiveTenant = () => {
    const activeTenant = localStorageManager.get(AuthUtils.ACTIVE_TENANT);
    return activeTenant ? (JSON.parse(activeTenant) as TenantSummary) : null;
  };

  static setActiveTenant = (tenant: TenantSummary) => {
    localStorageManager.set(AuthUtils.ACTIVE_TENANT, JSON.stringify(tenant));
    store.dispatch(setActiveTenant(tenant));
  };

  static clearActiveTenant = () => {
    localStorageManager.remove(AuthUtils.ACTIVE_TENANT);
    store.dispatch(clearActiveTenant());
  };

  static isRefreshTokenFlagSet = () => {
    return !!localStorageManager.get(AuthUtils.REFRESH_TOKEN_FLAG);
  };

  static setAuth = (auth: AuthSessionResponse) => {
    store.dispatch(setAuth(auth));
    localStorageManager.set(AuthUtils.REFRESH_TOKEN_FLAG, "TRUE");
  };

  static setNoAuth = () => {
    store.dispatch(setNoAuth());
    localStorageManager.remove(AuthUtils.REFRESH_TOKEN_FLAG);
    localStorageManager.remove(AuthUtils.ACTIVE_TENANT);
  };

  static refreshAccessToken = (() => {
    let refreshPromise: Promise<AuthSessionResponse | null> | null = null;
    return async () => {
      if (refreshPromise) {
        return refreshPromise;
      }
      store.dispatch(setRestoringAuth());
      refreshPromise = AuthApi.refresh()
        .then((result) => {
          store.dispatch(setAuth(result));
          if (!result.user.sentinelAdmin) {
            AuthUtils.setActiveTenant(result.user.tenant);
          } else {
            const activeTenant = AuthUtils.getActiveTenant();
            if (activeTenant != null) {
              store.dispatch(setActiveTenant(activeTenant));
            }
          }
          return result;
        })
        .catch(() => {
          store.dispatch(setNoAuth());
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });
      return refreshPromise;
    };
  })();
}
