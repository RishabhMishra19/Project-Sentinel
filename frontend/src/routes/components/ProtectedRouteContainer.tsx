import { Navigate, Outlet, useMatches } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { NAVIGATION_PATHS, ROUTE_PATHS } from "../constants";
import { AppSidebar } from "../../shared/layout/AppSidebar";
import { AppNavbar } from "../../shared/layout/AppNavbar";
import { RoutesUtils } from "../RoutesUtils";
import { ActiveTenantBanner } from "../../shared/layout/ActiveTenantBanner";
import type { Crumb } from "../types";

export const ProtectedRouteContainer = () => {
  const { auth, activeTenant, state } = useAppSelector((state) => state.session);
  const matches = useMatches();

  if (state !== "LOGGED_IN") {
    return <Navigate to={`/${ROUTE_PATHS.login}`} replace />;
  }

  const navItems = NAVIGATION_PATHS.filter((path) => {
    if (path.isAdminOnly) {
      if (!RoutesUtils.isUserSentinelAdmin(auth)) return false;
    }
    if (path.isTenantRequired) {
      if (!RoutesUtils.isActiveTenantSet(activeTenant)) return false;
    }
    return true;
  });

  const crumbs = matches
    .filter((match) => !!(match.handle as { crumb: string }["crumb"]))
    .map((match) => {
      const { crumb } = match.handle as { crumb: string };
      return {
        label: crumb,
        to: match.pathname,
      } as Crumb;
    });

  const description = (matches[matches.length - 1]?.handle as { description: string })?.description;

  return (
    <div className="flex h-dvh gap-3 overflow-hidden bg-chrome p-3">
      <AppSidebar navItems={navItems} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-surface shadow-sm">
        {RoutesUtils.isSentinelAdminTenantLoggedIn(auth, activeTenant) ? (
          <ActiveTenantBanner />
        ) : null}
        <AppNavbar crumbs={crumbs} description={description} />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
