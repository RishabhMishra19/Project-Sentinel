export interface RoleSummary {
  id: string
  name: string
  scopes: RoleSummaryScope[]
}

export interface RoleSummaryScope {
  id: string
  scopeType: string
  scopeId: string | null
  permission: string
}

export interface TenantSummary {
  id: string
  name: string
}

export interface AuthSessionUser {
  id: string
  email: string
  name: string
  sentinelAdmin: boolean
  roles: RoleSummary[]
  tenant: TenantSummary | null
}

export interface AuthSessionResponse {
  accessToken: string
  expiresIn: number
  user: AuthSessionUser
}

export type UserStatus = 'ACTIVE' | 'INACTIVE'

/** Session user fields plus account metadata. */
export interface ProfileResponse extends AuthSessionUser {
  status: UserStatus
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
}
