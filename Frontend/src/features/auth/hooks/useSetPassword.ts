import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import authApi from "../api/authApi";
import { authenticate } from "../authSlice";

import { ROUTES } from "@/router/routes";
import LocalStorageService from "@/storage/LocalStorageService";
import { useAppDispatch } from "@/reduxStore/hooks";

export default function useSetPassword() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.setPassword,
    onSuccess(response) {
      LocalStorageService.saveRefreshToken(response.refreshToken);
      dispatch(authenticate({ currentUser: response.user }));
      navigate(ROUTES.DASHBOARD);
    },
  });
}
