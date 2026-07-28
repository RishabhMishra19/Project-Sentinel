import { Outlet, type RouteObject } from "react-router-dom";
import { OnlySentinelAdminContainer } from "../../components/OnlySentinelAdminContainer";
import { RequireTenantContainer } from "../../components/RequireTenantContainer";
import { protectedSentinelAdminOnlyRoutes } from "./protected.sentinelAdminOnly.routes";
import { protectedRequireTenantRoutes } from "./protected.requireTenant.routes";
import { protectedSharedRoutes } from "./protected.shared.routes";

export const protectedPageRoutes: RouteObject[] = [
  {
    id: "sentinel-admin-only-routes",
    path: "admin",
    Component: OnlySentinelAdminContainer,
    children: protectedSentinelAdminOnlyRoutes,
  },
  {
    id: "require-tenant-container",
    path: "",
    Component: RequireTenantContainer,
    children: protectedRequireTenantRoutes,
  },
  {
    id: "shared-routes",
    path: "",
    Component: Outlet,
    children: protectedSharedRoutes,
  },
];
