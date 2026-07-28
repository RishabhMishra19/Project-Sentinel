import type { RouteObject } from "react-router-dom";
import { TenantsPage } from "../../../features/tenants/pages/TenantsPage";
import { ROUTE_PATHS } from "../../constants";

export const protectedSentinelAdminOnlyRoutes: RouteObject[] = [
  {
    id: "tenants",
    path: ROUTE_PATHS.tenants,
    Component: TenantsPage,
    handle: {
      crumb: "Tenants",
      description: "Create and manage tenants across Sentinel",
    },
  },
];
