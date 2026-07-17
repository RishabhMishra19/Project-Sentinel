import { useEffect } from "react";

import authApi from "../api/authApi";
import { authenticate, finishLoading, logout } from "../authSlice";

import LocalStorageService from "@/storage/LocalStorageService";
import { useAppDispatch } from "@/reduxStore/hooks";

export default function useRestoreSession() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function restoreSession() {
      try {
        const accessToken = LocalStorageService.getAccessToken();
        if (accessToken === null) {
          dispatch(finishLoading());
          return;
        }
        const { data: currentUser } = await authApi.me();
        dispatch(authenticate({ currentUser }));
      } catch {
        LocalStorageService.clearAuth();
        dispatch(logout());
      }
    }

    restoreSession();
  }, [dispatch]);
}
