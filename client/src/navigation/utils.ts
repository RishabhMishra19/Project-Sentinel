import type {
  AuthSessionUser,
  TenantSummary,
} from "../features/auth/dto/response/auth.response";
import { ROUTE_PATHS } from "./constants";
import { protectedPageRoutes } from "./routes/protected.routes";
import type { SentinelRouteObject, SidebarItem } from "./types";

type AccessCheck = SentinelRouteObject["isAccessibleTo"];

type IndexableRoute = {
  path: string;
  indexOrder: number;
  isAccessibleTo?: AccessCheck;
};

/** Recursively collect navigable routes, inheriting access from wrapper ancestors. */
function collectNavigableSidebarItems(
  routes: SentinelRouteObject[],
  inheritedAccess?: AccessCheck,
): SidebarItem[] {
  return routes
    .map((route) => {
      const isAccessibleTo = route.isAccessibleTo ?? inheritedAccess;

      if (route.isWrapperRoute) {
        return route.children != null
          ? collectNavigableSidebarItems(route.children, isAccessibleTo)
          : null;
      }

      if (route.navigation == null) {
        return null;
      }

      return {
        id: route.id,
        label: route.navigation.label,
        order: route.navigation.order,
        icon: route.navigation.icon,
        path: toAbsolutePath(route.path),
        isAccessibleTo,
      } satisfies SidebarItem;
    })
    .filter((item) => item != null)
    .flat();
}

/** Recursively collect leaf routes that declare `indexOrder` (landing candidates). */
function collectIndexOrderedRoutes(
  routes: SentinelRouteObject[],
  inheritedAccess?: AccessCheck,
): IndexableRoute[] {
  return routes
    .map((route) => {
      const isAccessibleTo = route.isAccessibleTo ?? inheritedAccess;

      if (route.isWrapperRoute) {
        return route.children != null
          ? collectIndexOrderedRoutes(route.children, isAccessibleTo)
          : null;
      }

      if (route.indexOrder == null || route.path.includes(":")) {
        return null;
      }

      return {
        path: toAbsolutePath(route.path),
        indexOrder: route.indexOrder,
        isAccessibleTo,
      } satisfies IndexableRoute;
    })
    .filter((item) => item != null)
    .flat();
}

function toAbsolutePath(path: string): string {
  if (path === "" || path.startsWith("/")) return path;
  return `/${path}`;
}

/** Flatten route trees into sidebar entries sorted by `navigation.order`. */
export const getSideBarItems = (
  routes: SentinelRouteObject[],
): SidebarItem[] => {
  return collectNavigableSidebarItems(routes).sort((a, b) => a.order - b.order);
};

/**
 * First accessible protected path by ascending `indexOrder`
 * (used after login / when a signed-in user hits a guest route).
 */
export function getFirstAccessiblePath(
  routes: SentinelRouteObject[],
  isLoggedIn: boolean,
  user: AuthSessionUser | null,
  activeTenant: TenantSummary | null,
): string | undefined {
  return collectIndexOrderedRoutes(routes)
    .sort((a, b) => a.indexOrder - b.indexOrder)
    .find((route) =>
      route.isAccessibleTo
        ? route.isAccessibleTo(isLoggedIn, user, activeTenant)
        : true,
    )?.path;
}

/** Default landing path for an authenticated session. */
export function resolvePostLoginPath(
  user: AuthSessionUser,
  activeTenant: TenantSummary | null = null,
): string {
  return (
    getFirstAccessiblePath(protectedPageRoutes, true, user, activeTenant) ??
    `/${ROUTE_PATHS.profile}`
  );
}
