import ApiService from "@/api/ApiService";

import type { LoginRequest } from "../dto/request/LoginRequest";
import type { RefreshTokenRequest } from "../dto/request/RefreshTokenRequest";
import type { SetPasswordRequest } from "../dto/request/SetPasswordRequest";

import type { AuthResponse, CurrentUser } from "../dto/response/AuthResponse";
import { API_ENDPOINTS } from "@/api/ApiEndpoints";
import type { ApiSuccessResponse } from "@/api/ApiResponse";
import type { LogoutRequest } from "../dto/request/LogoutRequest";

class AuthApi {
  login(request: LoginRequest) {
    return ApiService.post<LoginRequest, ApiSuccessResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      request,
    );
  }

  refreshToken(request: RefreshTokenRequest) {
    return ApiService.post<RefreshTokenRequest, ApiSuccessResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REFRESH_ACCESS_TOKEN,
      request,
    );
  }

  logout(request: LogoutRequest) {
    return ApiService.post<LogoutRequest, ApiSuccessResponse<null>>(
      API_ENDPOINTS.AUTH.LOGOUT,
      request,
    );
  }

  setPassword(request: SetPasswordRequest) {
    return ApiService.post<SetPasswordRequest, ApiSuccessResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.SET_PASSWORD,
      request,
    );
  }

  me() {
    return ApiService.post<Record<string, never>, ApiSuccessResponse<CurrentUser>>(
      API_ENDPOINTS.AUTH.ME,
      {},
    );
  }
}

export default new AuthApi();
