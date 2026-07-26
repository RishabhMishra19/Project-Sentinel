import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import { appRouteTree } from "./routes";
import { useAppSelector } from "../redux/hooks";
import type { SentinelRouteObject } from "./types";
import type { AuthSessionUser, TenantSummary } from "../features/auth/dto/response/auth.response";

const filterAccessibleRoutes = ({
  routes,
  isLoggedIn,
  user,
  activeTenant,
}: {
  routes: SentinelRouteObject[];
  isLoggedIn: boolean;
  user: AuthSessionUser | null;
  activeTenant: TenantSummary | null;
}): SentinelRouteObject[] => {
  return routes
    .filter(
      (route) => !route.isAccessibleTo || route.isAccessibleTo?.(isLoggedIn, user, activeTenant),
    )
    .map((route) => ({
      ...route,
      children: route.children?.length
        ? filterAccessibleRoutes({ routes: route.children, isLoggedIn, user, activeTenant })
        : undefined,
    }));
};

export const AppRouter = () => {
  const isLoggedIn = useAppSelector((state) => state.session.isLoggedIn);
  const user = useAppSelector((state) => state.session.user);
  const activeTenant = useAppSelector((state) => state.session.activeTenant);

  const accessibleRoutes = filterAccessibleRoutes({
    routes: appRouteTree,
    isLoggedIn,
    user,
    activeTenant,
  });
  return <RouterProvider router={createBrowserRouter(accessibleRoutes as RouteObject[])} />;
};
