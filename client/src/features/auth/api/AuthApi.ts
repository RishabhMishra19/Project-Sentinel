import { AUTH_API_ROUTES } from "../../../shared/api/api.routes";
import { apiManager } from "../../../shared/api/ApiManager";
import type { ChangePasswordRequest, LoginRequest } from "../dto/request/auth.request";
import type { AuthSessionResponse, ProfileResponse } from "../dto/response/auth.response";

export class AuthApi {
  static login(payload: LoginRequest): Promise<AuthSessionResponse> {
    return apiManager.post<AuthSessionResponse>(AUTH_API_ROUTES.LOGIN, payload);
  }

  static refresh(): Promise<AuthSessionResponse> {
    return apiManager.post<AuthSessionResponse>(AUTH_API_ROUTES.REFRESH_TOKEN);
  }

  static logout(): Promise<void> {
    return apiManager.post<void>(AUTH_API_ROUTES.LOGOUT);
  }

  static getProfile(): Promise<ProfileResponse> {
    return apiManager.get<ProfileResponse>(AUTH_API_ROUTES.PROFILE);
  }

  static changePassword(payload: ChangePasswordRequest): Promise<AuthSessionResponse> {
    return apiManager.post<AuthSessionResponse>(AUTH_API_ROUTES.CHANGE_PASSWORD, payload);
  }
}
