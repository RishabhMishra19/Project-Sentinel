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

export interface LoginRequest {
  email: string
  password: string
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
