import ApiService from "@/common/api/ApiService";

import type {LoginRequest} from "../dto/LoginRequest";
import type {RefreshTokenRequest} from "../dto/RefreshTokenRequest";
import type {SetPasswordRequest} from "../dto/SetPasswordRequest";

import type {AuthResponse} from "../dto/AuthResponse";
import {API_ENDPOINTS} from "@/common/constants/ApiEndpoints.ts";

const BASE_URL = "/auth";

class AuthApi {

    login(request: LoginRequest) {

        return ApiService.post<LoginRequest, AuthResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            request
        );

    }

    refreshToken(request: RefreshTokenRequest) {

        return ApiService.post<RefreshTokenRequest, AuthResponse>(
            API_ENDPOINTS.AUTH.REFRESH_ACCESS_TOKEN,
            request
        );

    }

    logout(request: LoginRequest) {

        return ApiService.post(
            API_ENDPOINTS.AUTH.LOGOUT,
            request
        );

    }

    setPassword(request: SetPasswordRequest) {

        return ApiService.post<SetPasswordRequest, AuthResponse>(
            API_ENDPOINTS.AUTH.SET_PASSWORD,
            request
        );

    }

}

export default new AuthApi();