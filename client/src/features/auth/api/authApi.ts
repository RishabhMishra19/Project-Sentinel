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
  return apiManager.post<LoginResponse>('/auth/login', payload)
}

export function refresh(): Promise<TokenResponse> {
  return apiManager.post<TokenResponse>('/auth/refresh-token')
}

export function logout(): Promise<void> {
  return apiManager.post<void>('/auth/logout')
}

export function me(): Promise<MeResponse> {
  return apiManager.get<MeResponse>('/auth/me')
}

export function getProfile(): Promise<ProfileResponse> {
  return apiManager.get<ProfileResponse>('/auth/profile')
}

export function changePassword(payload: ChangePasswordRequest): Promise<TokenResponse> {
  return apiManager.post<TokenResponse>('/auth/change-password', payload)
}
