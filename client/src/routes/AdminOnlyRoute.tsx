import { Outlet } from "react-router-dom";
import { UnauthorizedPage } from "../features/auth/pages/UnauthorizedPage";
import { useAppSelector } from "../redux/hooks";
import { resolveSessionMode } from "../shared/session/sessionUtils";

/** Requires Sentinel admin (not impersonating); shows UnauthorizedPage otherwise. */
export function AdminOnlyRoute() {
  const user = useAppSelector((state) => state.session.user)!;
  const activeTenant = useAppSelector((state) => state.session.activeTenant);

  if (resolveSessionMode(user, activeTenant) !== "only_admin") {
    return <UnauthorizedPage />;
  }

  return <Outlet />;
}
