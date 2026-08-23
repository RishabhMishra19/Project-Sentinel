import type { RouteObject } from "react-router-dom";
import { TenantsPage } from "../../../features/tenants/pages/TenantsPage";
import { ROUTE_PATHS } from "../../constants";
import SystemMonitorPage from "../../../features/serverHealthDashboard/pages/SystemMonitorPage";

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
  {
    id: "system-monitor",
    path: ROUTE_PATHS.systemMonitor,
    Component: SystemMonitorPage,
    handle: {
      crumb: "System Monitor",
      description: "Monitor the system",
    },
  },
];
