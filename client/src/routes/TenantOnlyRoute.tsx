import { Outlet } from "react-router-dom";
import { UnauthorizedPage } from "../features/auth/pages/UnauthorizedPage";
import { useAppSelector } from "../redux/hooks";
import { resolveSessionMode } from "../shared/session/sessionUtils";

/** Requires Sentinel admin (impersonating) or tenant user; shows UnauthorizedPage otherwise. */
export function TenantOnlyRoute() {
  const user = useAppSelector((state) => state.session.user)!;
  const activeTenant = useAppSelector((state) => state.session.activeTenant);

  if (resolveSessionMode(user, activeTenant) !== "tenant_context") {
    return <UnauthorizedPage />;
  }

  return <Outlet />;
}
