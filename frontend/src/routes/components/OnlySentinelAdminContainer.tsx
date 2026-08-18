import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { AccessDeniedPage } from "../../features/auth/pages/AccessDeniedPage";
import { RoutesUtils } from "../RoutesUtils";

export const OnlySentinelAdminContainer = () => {
  const auth = useAppSelector((state) => state.session.auth!);

  if (!RoutesUtils.isUserSentinelAdmin(auth)) {
    return <AccessDeniedPage />;
  }

  return <Outlet />;
};
