export const API_BASE = '/api'

export const TENANT_ID_HEADER = 'X-Tenant-Id'

export const AUTH_API_ROUTES = {
  LOGIN: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
} as const
