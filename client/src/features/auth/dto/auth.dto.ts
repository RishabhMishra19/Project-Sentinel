export interface UserSummary {
  id: string
  email: string
  displayName: string
}

export interface PermissionSummary {
  id: string
  name: string
}

export interface RoleSummary {
  id: string
  name: string
  permissions: PermissionSummary[]
}

export interface MeResponse {
  user: UserSummary
  roles: RoleSummary[]
}

export type UserStatus = 'ACTIVE' | 'INACTIVE'

export interface UserProfile {
  id: string
  email: string
  displayName: string
  status: UserStatus
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
}

export interface ProfileResponse {
  user: UserProfile
  roles: RoleSummary[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface LoginResponse {
  accessToken: string
  expiresIn: number
  user: UserSummary
}

export interface TokenResponse {
  accessToken: string
  expiresIn: number
}
