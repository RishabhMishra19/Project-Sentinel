import ApiService from "@/api/ApiService";

import type { LoginRequest } from "../dto/request/LoginRequest";
import type { RefreshTokenRequest } from "../dto/request/RefreshTokenRequest";
import type { SetPasswordRequest } from "../dto/request/SetPasswordRequest";

import type { AuthResponse } from "../dto/response/AuthResponse";
import { API_ENDPOINTS } from "@/api/ApiEndpoints";

class AuthApi {
  login(request: LoginRequest) {
    return ApiService.post<LoginRequest, AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, request);
  }

  refreshToken(request: RefreshTokenRequest) {
    return ApiService.post<RefreshTokenRequest, AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH_ACCESS_TOKEN,
      request,
    );
  }

  logout(request: LoginRequest) {
    return ApiService.post(API_ENDPOINTS.AUTH.LOGOUT, request);
  }

  setPassword(request: SetPasswordRequest) {
    return ApiService.post<SetPasswordRequest, AuthResponse>(
      API_ENDPOINTS.AUTH.SET_PASSWORD,
      request,
    );
  }
}

export default new AuthApi();
