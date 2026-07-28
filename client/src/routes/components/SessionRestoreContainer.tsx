import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { SessionBootstrapScreen } from "../../features/auth/components/SessionBootstrapScreen";
import { useAppSelector } from "../../redux/hooks";
import { AuthUtils } from "../../features/auth/AuthUtils";

export const SessionRestoreContainer = () => {
  const state = useAppSelector((state) => state.session.state);

  useEffect(() => {
    if (!AuthUtils.isRefreshTokenFlagSet()) {
      AuthUtils.setNoAuth();
      return;
    }
    AuthUtils.refreshAccessToken();
  }, []);

  if (state === "PENDING" || state === "RESTORING_AUTH") {
    return <SessionBootstrapScreen />;
  }

  return <Outlet />;
};
