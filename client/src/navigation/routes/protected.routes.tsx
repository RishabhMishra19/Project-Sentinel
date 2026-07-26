import { Outlet } from "react-router-dom";
import {
  AnalyticsIcon,
  LogsIcon,
  ProductsIcon,
  ServicesIcon,
  SettingsIcon,
  TenantsIcon,
  UsersIcon,
} from "../../assets/icons";
import { AnalyticsPage } from "../../features/analytics/pages/AnalyticsPage";
import { ServiceApiKeysPage } from "../../features/apikeys/pages/ServiceApiKeysPage";
import { ProfilePage } from "../../features/auth/pages/ProfilePage";
import { RequestLogsPage } from "../../features/logs/pages/RequestLogsPage";
import { ProductsPage } from "../../features/products/pages/ProductsPage";
import { RolesPage } from "../../features/roles/pages/RolesPage";
import { ServicesPage } from "../../features/services/pages/ServicesPage";
import { SettingsPage } from "../../features/settings/pages/SettingsPage";
import { TenantsPage } from "../../features/tenants/pages/TenantsPage";
import { UsersPage } from "../../features/users/pages/UsersPage";
import {
  isOnlySentinelAdminView,
  isTenantUserOrSentinelAdminView,
} from "../../shared/utils/sessionUtils";
import { ROUTE_PATHS } from "../constants";
import type { SentinelRouteObject } from "../types";

const sharedRoutes: SentinelRouteObject[] = [
  {
    id: "profile",
    path: ROUTE_PATHS.profile,
    handle: {
      crumb: "Profile",
      description: "Your account details and session settings",
    },
    Component: ProfilePage,
  },
];

const sentinelAdminOnlyRoutes: SentinelRouteObject[] = [
  {
    id: "tenants",
    path: ROUTE_PATHS.tenants,
    Component: TenantsPage,
    handle: {
      crumb: "Tenants",
      description: "Create and manage tenants across Sentinel",
    },
    indexOrder: 1,
    navigation: {
      label: "Tenants",
      order: 1,
      icon: TenantsIcon,
    },
  },
];

const tenantUserOrSentinelAdminViewRoutes: SentinelRouteObject[] = [
  {
    id: "analytics",
    path: ROUTE_PATHS.analytics,
    handle: {
      crumb: "Analytics",
      description: "Request volume, latency, and error rates across your APIs",
    },
    Component: AnalyticsPage,
    indexOrder: 1,
    isAccessibleTo: isTenantUserOrSentinelAdminView,
    navigation: {
      label: "Analytics",
      order: 1,
      icon: AnalyticsIcon,
    },
  },
  {
    id: "logs",
    path: ROUTE_PATHS.logs,
    handle: {
      crumb: "Logs",
      description: "Inspect individual gateway requests and responses",
    },
    Component: RequestLogsPage,
    indexOrder: 2,
    isAccessibleTo: isTenantUserOrSentinelAdminView,
    navigation: {
      label: "Logs",
      order: 2,
      icon: LogsIcon,
    },
  },
  {
    id: "products",
    path: ROUTE_PATHS.products,
    handle: {
      crumb: "Products",
      description: "Organize APIs and services under products",
    },
    Component: ProductsPage,
    indexOrder: 3,
    isAccessibleTo: isTenantUserOrSentinelAdminView,
    navigation: {
      label: "Products",
      order: 3,
      icon: ProductsIcon,
    },
  },
  {
    id: "services",
    path: ROUTE_PATHS.services,
    handle: {
      crumb: "Services",
      description: "Register and configure services for this tenant",
    },
    Component: ServicesPage,
    indexOrder: 4,
    isAccessibleTo: isTenantUserOrSentinelAdminView,
    navigation: {
      label: "Services",
      order: 4,
      icon: ServicesIcon,
    },
  },
  {
    id: "users",
    path: ROUTE_PATHS.users,
    handle: {
      crumb: "Users",
      description: "Invite teammates and manage tenant access",
    },
    Component: UsersPage,
    indexOrder: 5,
    isAccessibleTo: isTenantUserOrSentinelAdminView,
    navigation: {
      label: "Users",
      order: 5,
      icon: UsersIcon,
    },
  },
  {
    id: "serviceApiKeys",
    path: ROUTE_PATHS.serviceApiKeys,
    handle: {
      crumb: "API keys",
      description: "Issue and revoke keys for this service",
    },
    Component: ServiceApiKeysPage,
    indexOrder: 6,
    isAccessibleTo: isTenantUserOrSentinelAdminView,
  },
  {
    id: "settings",
    path: ROUTE_PATHS.settings,
    handle: {
      crumb: "Settings",
      description: "Tenant preferences and access control",
    },
    Component: Outlet,
    indexOrder: 7,
    isAccessibleTo: isTenantUserOrSentinelAdminView,
    navigation: {
      label: "Settings",
      order: 6,
      icon: SettingsIcon,
    },
    children: [
      {
        id: "settingsHome",
        path: ROUTE_PATHS.settingsHome,
        handle: {
          crumb: "",
          description: "Tenant preferences and access control",
        },
        Component: SettingsPage,
        indexOrder: 1,
        isAccessibleTo: isTenantUserOrSentinelAdminView,
      },
      {
        id: "settingsRoles",
        path: ROUTE_PATHS.settingsRoles,
        handle: {
          crumb: "Manage Roles",
          description: "Define roles and permissions for this tenant",
        },
        Component: RolesPage,
        indexOrder: 2,
        isAccessibleTo: isTenantUserOrSentinelAdminView,
      },
    ],
  },
];

export const protectedPageRoutes: SentinelRouteObject[] = [
  {
    id: "sentinel-admin-only-routes",
    path: "",
    isWrapperRoute: true,
    Component: Outlet,
    indexOrder: 1,
    isAccessibleTo: isOnlySentinelAdminView,
    children: sentinelAdminOnlyRoutes,
  },
  {
    id: "tenant-user-or-sentinel-admin-view-routes",
    path: "",
    isWrapperRoute: true,
    Component: Outlet,
    indexOrder: 2,
    isAccessibleTo: isTenantUserOrSentinelAdminView,
    children: tenantUserOrSentinelAdminViewRoutes,
  },
  {
    id: "shared-routes",
    path: "",
    isWrapperRoute: true,
    indexOrder: 3,
    Component: Outlet,
    isAccessibleTo: (isLoggedIn: boolean) => isLoggedIn,
    children: sharedRoutes,
  },
];
