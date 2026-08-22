export const API_BASE = "/api";

export const TENANT_ID_HEADER = "X-Tenant-Id";

export const AUTH_API_ROUTES = {
  LOGIN: "/auth/login",
  REFRESH_TOKEN: "/auth/refresh-token",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/profile",
  CHANGE_PASSWORD: "/auth/change-password",
} as const;

export const TENANTS_API_ROUTES = {
  LIST: "/tenants",
  SEARCH: "/tenants/search",
  BY_ID: (id: string) => `/tenants/${id}`,
} as const;

export const PRODUCTS_API_ROUTES = {
  LIST: "/products",
  SEARCH: "/products/search",
  BY_ID: (id: string) => `/products/${id}`,
} as const;

export const SERVICES_API_ROUTES = {
  LIST_ALL: "/services",
  SEARCH_ALL: "/services/search",
  LIST: (productId: string) => `/products/${productId}/services`,
  SEARCH: (productId: string) => `/products/${productId}/services/search`,
  BY_ID: (productId: string, id: string) => `/products/${productId}/services/${id}`,
  ENDPOINTS: (serviceId: string) => `/services/${serviceId}/endpoints`,
} as const;

export const SERVICE_API_KEYS_API_ROUTES = {
  LIST: (productId: string, serviceId: string) =>
    `/products/${productId}/services/${serviceId}/api-keys`,
  SEARCH: (productId: string, serviceId: string) =>
    `/products/${productId}/services/${serviceId}/api-keys/search`,
  BY_ID: (productId: string, serviceId: string, id: string) =>
    `/products/${productId}/services/${serviceId}/api-keys/${id}`,
  REVOKE: (productId: string, serviceId: string, id: string) =>
    `/products/${productId}/services/${serviceId}/api-keys/${id}/revoke`,
} as const;

export const USERS_API_ROUTES = {
  LIST: "/users",
  SEARCH: "/users/search",
  BY_ID: (id: string) => `/users/${id}`,
  ASSIGN_ROLE: (id: string) => `/users/${id}/roles`,
  MARK_INACTIVE: (id: string) => `/users/${id}/mark-inactive`,
} as const;

export const ROLES_API_ROUTES = {
  LIST: "/roles",
  BY_ID: (id: string) => `/roles/${id}`,
  MARK_INACTIVE: (id: string) => `/roles/${id}/mark-inactive`,
  SCOPES: (id: string) => `/roles/${id}/scopes`,
  SCOPE_BY_ID: (roleId: string, scopeId: string) => `/roles/${roleId}/scopes/${scopeId}`,
  DEACTIVATE_SCOPE: (roleId: string, scopeId: string) =>
    `/roles/${roleId}/scopes/${scopeId}/deactivate`,
} as const;

export const ANALYTICS_API_ROUTES = {
  SUMMARY: "/analytics/summary",
  TIMESERIES: "/analytics/timeseries",
  ENTITY_AGGREGATED: "/analytics/entityAggregated",
} as const;

export const LOGS_API_ROUTES = {
  LIST: (serviceId: string) => `/services/${serviceId}/logs/requests`,
  BY_ID: (serviceId: string, id: string) => `/services/${serviceId}/logs/requests/${id}`,
} as const;
