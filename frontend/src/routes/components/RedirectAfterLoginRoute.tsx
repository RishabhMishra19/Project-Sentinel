import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { RoutesUtils } from "../RoutesUtils";
import { ROUTE_PATHS } from "../constants";

export const RedirectAfterLoginRoute = () => {
  const auth = useAppSelector((state) => state.session.auth);
  if (!auth) {
    return <Navigate to={`/${ROUTE_PATHS.login}`} />;
  }
  if (RoutesUtils.isUserSentinelAdmin(auth)) {
    return <Navigate to={`/admin/${ROUTE_PATHS.tenants}`} />;
  }
  return <Navigate to={`/${ROUTE_PATHS.analytics}`} />;
};
