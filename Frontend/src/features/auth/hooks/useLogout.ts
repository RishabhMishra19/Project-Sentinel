import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import authApi from "../api/authApi";
import { logout } from "../authSlice";

import { ROUTES } from "@/router/routes";
import LocalStorageService from "@/storage/LocalStorageService";
import { useAppDispatch } from "@/reduxStore/hooks";

export default function useLogut() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const _logoutClient = () => {
    LocalStorageService.clearAuth();
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const { mutate } = useMutation({
    mutationFn: authApi.logout,
    onSuccess() {
      _logoutClient();
    },
  });

  const handleLogout = () => {
    const refreshToken = LocalStorageService.getRefreshToken();
    if (refreshToken === null) {
      _logoutClient();
      return;
    }
    mutate({ refreshToken });
  };

  return { handleLogout };
}
