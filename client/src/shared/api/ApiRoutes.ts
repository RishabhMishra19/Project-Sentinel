export const API_BASE = '/api'

export const TENANT_ID_HEADER = 'X-Tenant-Id'

export const AUTH_API_ROUTES = {
  LOGIN: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
} as const

export const TENANTS_API_ROUTES = {
  LIST: '/tenants',
  BY_ID: (id: string) => `/tenants/${id}`,
} as const

export const PRODUCTS_API_ROUTES = {
  LIST: '/products',
  BY_ID: (id: string) => `/products/${id}`,
} as const

export const SERVICES_API_ROUTES = {
  LIST_ALL: '/services',
  LIST: (productId: string) => `/products/${productId}/services`,
  BY_ID: (productId: string, id: string) =>
    `/products/${productId}/services/${id}`,
} as const

export const SERVICE_API_KEYS_API_ROUTES = {
  LIST: (productId: string, serviceId: string) =>
    `/products/${productId}/services/${serviceId}/api-keys`,
  BY_ID: (productId: string, serviceId: string, id: string) =>
    `/products/${productId}/services/${serviceId}/api-keys/${id}`,
  REVOKE: (productId: string, serviceId: string, id: string) =>
    `/products/${productId}/services/${serviceId}/api-keys/${id}/revoke`,
} as const

export const USERS_API_ROUTES = {
  LIST: '/users',
  BY_ID: (id: string) => `/users/${id}`,
  ASSIGN_ROLE: (id: string) => `/users/${id}/roles`,
  MARK_INACTIVE: (id: string) => `/users/${id}/mark-inactive`,
} as const

export const ROLES_API_ROUTES = {
  LIST: '/roles',
  BY_ID: (id: string) => `/roles/${id}`,
  MARK_INACTIVE: (id: string) => `/roles/${id}/mark-inactive`,
  SCOPES: (id: string) => `/roles/${id}/scopes`,
  SCOPE_BY_ID: (roleId: string, scopeId: string) =>
    `/roles/${roleId}/scopes/${scopeId}`,
  DEACTIVATE_SCOPE: (roleId: string, scopeId: string) =>
    `/roles/${roleId}/scopes/${scopeId}/deactivate`,
} as const
