import { Outlet, type RouteObject } from "react-router-dom";
import { ROUTE_PATHS } from "../../constants";
import { AnalyticsPage } from "../../../features/analytics/pages/AnalyticsPage";
import { ApiKeysPage } from "../../../features/apikeys/pages/ApiKeysPage";
import { RequestLogsPage } from "../../../features/logs/pages/RequestLogsPage";
import { ProductsPage } from "../../../features/products/pages/ProductsPage";
import { RolesPage } from "../../../features/roles/pages/RolesPage";
import { ServicesPage } from "../../../features/services/pages/ServicesPage";
import { SettingsPage } from "../../../features/settings/pages/SettingsPage";
import { UsersPage } from "../../../features/users/pages/UsersPage";

export const protectedRequireTenantRoutes: RouteObject[] = [
  {
    id: "analytics",
    path: ROUTE_PATHS.analytics,
    handle: {
      crumb: "Analytics",
      description: "Request volume, latency, and error rates across your APIs",
    },
    Component: AnalyticsPage,
  },
  {
    id: "logs",
    path: ROUTE_PATHS.logs,
    handle: {
      crumb: "Logs",
      description: "Raw request events from the last 7 days.",
    },
    Component: RequestLogsPage,
  },
  {
    id: "products",
    path: ROUTE_PATHS.products,
    handle: {
      crumb: "Products",
      description: "Organize APIs and services under products",
    },
    Component: ProductsPage,
  },
  {
    id: "services",
    path: ROUTE_PATHS.services,
    handle: {
      crumb: "Services",
      description: "Register and configure services for this tenant",
    },
    Component: ServicesPage,
  },
  {
    id: "users",
    path: ROUTE_PATHS.users,
    handle: {
      crumb: "Users",
      description: "Invite teammates and manage tenant access",
    },
    Component: UsersPage,
  },
  {
    id: "apiKeys",
    path: ROUTE_PATHS.apiKeys,
    handle: {
      crumb: "API keys",
      description: "Issue and revoke keys for your services",
    },
    Component: ApiKeysPage,
  },
  {
    id: "settings",
    path: ROUTE_PATHS.settings,
    handle: {
      crumb: "Settings",
      description: "Tenant preferences and access control",
    },
    Component: Outlet,
    children: [
      {
        id: "settingsHome",
        path: ROUTE_PATHS.settingsHome,
        handle: {
          crumb: "",
          description: "Tenant preferences and access control",
        },
        Component: SettingsPage,
      },
      {
        id: "settingsRoles",
        path: ROUTE_PATHS.settingsRoles,
        handle: {
          crumb: "Manage Roles",
          description: "Define roles and permissions for this tenant",
        },
        Component: RolesPage,
      },
    ],
  },
];
