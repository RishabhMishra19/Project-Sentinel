import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { ActiveTenantBanner } from "./ActiveTenantBanner";
import { AppNavbar } from "./AppNavbar";
import { AppSidebar } from "./AppSidebar";

export function ProtectedLayout() {
  const activeTenant = useAppSelector((state) => state.session.activeTenant);
  const sentinelAdmin = useAppSelector(
    (state) => state.session.user?.sentinelAdmin,
  );

  return (
    <div className="flex h-dvh gap-3 overflow-hidden bg-chrome p-3">
      <AppSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-surface shadow-sm">
        {sentinelAdmin && activeTenant ? <ActiveTenantBanner /> : null}
        <AppNavbar />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
