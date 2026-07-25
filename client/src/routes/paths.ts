/** shared routes. */
export const SHARED_ROUTES = {
  LOGIN: "/login",
  PROFILE: "/profile",
} as const;

/** Admin only (not impersonating). */
export const ADMIN_ONLY_ROUTES = {
  TENANTS: "/tenants",
} as const;

/** Tenant user, or admin while impersonating. */
export const TENANT_CONTEXT_ROUTES = {
  PRODUCTS: "/products",
  SERVICES: "/services",
  SETTINGS: "/settings",
  SETTINGS_ROLES: "/settings/roles",
  PRODUCT_SERVICES: (productId: string) => `/products/${productId}/services`,
  SERVICE_API_KEYS: (serviceId: string) => `/services/${serviceId}/api-keys`,
} as const;
