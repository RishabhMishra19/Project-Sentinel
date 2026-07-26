import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthApi } from "../../features/auth/api/AuthApi";
import { SessionBootstrapScreen } from "../../features/auth/components/SessionBootstrapScreen";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearSession, setAuthSession } from "../../redux/session/sessionSlice";

export const SessionRestoreContainer = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isLoading, accessToken, user } = useAppSelector((state) => state.session);

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(clearSession());
      return;
    }
    if (!accessToken) {
      void AuthApi.refresh()
        .then((data) => dispatch(setAuthSession(data)))
        .catch(() => dispatch(clearSession()));
    }
  }, [accessToken, dispatch, isLoggedIn]);

  const restoring = isLoading || (isLoggedIn && !user);

  if (restoring) {
    return <SessionBootstrapScreen />;
  }

  return <Outlet />;
};
