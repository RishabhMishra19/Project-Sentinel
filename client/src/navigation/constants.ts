/** Relative path segments for React Router route `path` props (no leading `/`). */
export const ROUTE_PATHS = {
  login: "login",
  profile: "profile",
  tenants: "tenants",
  products: "products",
  services: "services",
  analytics: "analytics",
  logs: "logs",
  users: "users",
  settings: "settings",
  settingsHome: "",
  settingsRoles: "roles",
  serviceApiKeys: "services/:serviceId/api-keys",
} as const;
