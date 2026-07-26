import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { isImpersonating } from "../session/sessionUtils";
import { ActiveTenantBanner } from "./ActiveTenantBanner";
import { AppNavbar } from "./AppNavbar";
import { AppSidebar } from "./AppSidebar";

/** Chrome for signed-in pages: sidebar, banner, navbar, and page outlet. */
export function AuthenticatedLayout() {
  const user = useAppSelector((state) => state.session.user)!;
  const activeTenant = useAppSelector((state) => state.session.activeTenant);

  return (
    <div className="flex h-dvh gap-3 overflow-hidden bg-chrome p-3">
      <AppSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-surface shadow-sm">
        {isImpersonating(user, activeTenant) ? <ActiveTenantBanner /> : null}
        <AppNavbar />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
