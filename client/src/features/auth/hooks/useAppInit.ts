import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  clearSession,
  setAuthSession,
} from "../../../redux/session/sessionSlice";
import { AuthApi } from "../api/AuthApi";

export function useAppInit() {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isLoading, accessToken } = useAppSelector(
    (state) => state.session,
  );

  const refreshSession = async () => {
    console.log("refreshSession", isLoggedIn, isLoading, accessToken);
    try {
      const data = await AuthApi.refresh();
      dispatch(setAuthSession(data));
    } catch {
      dispatch(clearSession());
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(clearSession());
      return;
    }
    if (!accessToken) {
      refreshSession();
    }
  }, [isLoggedIn]);

  return { checkingSession: isLoading };
}
