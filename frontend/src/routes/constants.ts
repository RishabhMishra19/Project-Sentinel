import {
  AnalyticsIcon,
  LogsIcon,
  ProductsIcon,
  ServicesIcon,
  SettingsIcon,
  TenantsIcon,
  UsersIcon,
} from "../assets/icons";
import { ApiKeysIcon } from "../assets/icons/ApiKeysIcon";
import type { NavigationItem } from "./types";

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
  apiKeys: "api-keys",
} as const;

export const NAVIGATION_PATHS: NavigationItem[] = [
  {
    id: "tenants",
    path: `admin/${ROUTE_PATHS.tenants}`,
    label: "Tenants",
    icon: TenantsIcon,
    isAdminOnly: true,
  },
  {
    id: "analytics",
    path: ROUTE_PATHS.analytics,
    label: "Analytics",
    icon: AnalyticsIcon,
    isTenantRequired: true,
  },
  {
    id: "logs",
    path: ROUTE_PATHS.logs,
    label: "Logs",
    icon: LogsIcon,
    isTenantRequired: true,
  },
  {
    id: "products",
    path: ROUTE_PATHS.products,
    label: "Products",
    icon: ProductsIcon,
    isTenantRequired: true,
  },
  {
    id: "services",
    path: ROUTE_PATHS.services,
    label: "Services",
    icon: ServicesIcon,
    isTenantRequired: true,
  },
  {
    id: "apiKeys",
    path: ROUTE_PATHS.apiKeys,
    label: "Api Keys",
    icon: ApiKeysIcon,
    isTenantRequired: true,
  },
  {
    id: "users",
    path: ROUTE_PATHS.users,
    label: "Users",
    icon: UsersIcon,
    isTenantRequired: true,
  },
  {
    id: "settings",
    path: ROUTE_PATHS.settings,
    label: "Settings",
    icon: SettingsIcon,
    isTenantRequired: true,
  },
] as const;
