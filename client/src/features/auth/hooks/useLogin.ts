import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../../shared/forms/getApiErrorMessage";
import { AuthApi } from "../api/AuthApi";
import type { LoginRequest } from "../dto/request/auth.request";
import { AuthUtils } from "../AuthUtils";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginRequest) => AuthApi.login(payload),
    meta: {
      toast: {
        loading: "Signing in…",
        success: "Signed in successfully.",
        error: (error) => getApiErrorMessage(error, "Invalid email or password"),
      },
    },
    onSuccess: (data) => {
      AuthUtils.setAuth(data);
      if (data.user.tenant) {
        AuthUtils.setActiveTenant(data.user.tenant);
      }
      navigate("/", { replace: true });
    },
  });
};
