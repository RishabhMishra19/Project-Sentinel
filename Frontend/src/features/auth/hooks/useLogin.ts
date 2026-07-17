import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import authApi from "../api/authApi";
import { authenticate } from "../authSlice";

import { ROUTES } from "@/router/routes";
import LocalStorageService from "@/storage/LocalStorageService";
import { useAppDispatch } from "@/reduxStore/hooks";

export default function useLogin() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess(response) {
      LocalStorageService.saveRefreshToken(response.data.refreshToken);
      LocalStorageService.saveAccessToken(response.data.accessToken);
      dispatch(authenticate({ currentUser: response.data.user }));
      navigate(ROUTES.DASHBOARD);
    },
  });
}
