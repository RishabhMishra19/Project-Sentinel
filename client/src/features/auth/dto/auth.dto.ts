export interface UserSummary {
  id: string
  email: string
  displayName: string
  sentinelAdmin: boolean
}

export interface RoleScopeSummary {
  id: string
  scopeType: string
  scopeId: string | null
  permission: string
}

export interface RoleSummary {
  id: string
  name: string
  scopes: RoleScopeSummary[]
}

export interface TenantSummary {
  id: string
  name: string
}

export interface MeResponse {
  user: UserSummary
  roles: RoleSummary[]
  tenant: TenantSummary | null
}

export type UserStatus = 'ACTIVE' | 'INACTIVE'

export interface UserProfile {
  id: string
  email: string
  displayName: string
  status: UserStatus
  sentinelAdmin: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
}

export interface ProfileResponse {
  user: UserProfile
  roles: RoleSummary[]
  tenant: TenantSummary | null
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
