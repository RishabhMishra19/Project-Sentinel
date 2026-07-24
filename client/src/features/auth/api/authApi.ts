import { AUTH_API_ROUTES } from '../../../shared/api/apiRoutes'
import { apiManager } from '../../../shared/api/ApiManager'
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  MeResponse,
  ProfileResponse,
  TokenResponse,
} from '../dto/auth.dto'

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return apiManager.post<LoginResponse>(AUTH_API_ROUTES.LOGIN, payload)
}

export function refresh(): Promise<TokenResponse> {
  return apiManager.post<TokenResponse>(AUTH_API_ROUTES.REFRESH_TOKEN)
}

export function logout(): Promise<void> {
  return apiManager.post<void>(AUTH_API_ROUTES.LOGOUT)
}

export function me(): Promise<MeResponse> {
  return apiManager.get<MeResponse>(AUTH_API_ROUTES.ME)
}

export function getProfile(): Promise<ProfileResponse> {
  return apiManager.get<ProfileResponse>(AUTH_API_ROUTES.PROFILE)
}

export function changePassword(payload: ChangePasswordRequest): Promise<TokenResponse> {
  return apiManager.post<TokenResponse>(AUTH_API_ROUTES.CHANGE_PASSWORD, payload)
}
