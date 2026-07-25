import { Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { UnauthorizedPage } from "../features/auth/pages/UnauthorizedPage";

/** Requires Sentinel admin (impersonating) or tenant user; shows UnauthorizedPage otherwise. */
export function TenantOnlyRoute() {
  const user = useAppSelector((state) => state.session.user)!;
  const activeTenant = useAppSelector((state) => state.session.activeTenant);

  const isSentinelAdmin = user.sentinelAdmin;
  const isImpersonating = isSentinelAdmin && activeTenant != null;

  if (isSentinelAdmin && !isImpersonating) {
    return <UnauthorizedPage />;
  }

  return <Outlet />;
}
