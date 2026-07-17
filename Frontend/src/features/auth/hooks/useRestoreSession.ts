import { useEffect } from "react";

import authApi from "../api/authApi";
import { authenticate, finishLoading, logout } from "../authSlice";

import LocalStorageService from "@/storage/LocalStorageService";
import { useAppDispatch } from "@/reduxStore/hooks";

export default function useRestoreSession() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function restoreSession() {
      const refreshToken = LocalStorageService.getRefreshToken();

      if (!refreshToken) {
        dispatch(finishLoading());
        return;
      }

      try {
        const { accessToken, user } = await authApi.refreshToken({ refreshToken });
        LocalStorageService.saveAccessToken(accessToken);
        dispatch(authenticate({ currentUser: user }));
      } catch {
        LocalStorageService.removeRefreshToken();
        dispatch(logout());
      }
    }

    restoreSession();
  }, [dispatch]);
}
