import { useMutation } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../shared/forms/getApiErrorMessage";
import { AuthApi } from "../api/AuthApi";
import type { ChangePasswordRequest } from "../dto/request/auth.request";
import { AuthUtils } from "../AuthUtils";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => AuthApi.changePassword(payload),
    meta: {
      toast: {
        loading: "Updating password…",
        success: "Password updated successfully.",
        error: (error) => getApiErrorMessage(error, "Could not change password. Please try again."),
      },
    },
    onSuccess: (data) => {
      AuthUtils.setAuth(data);
    },
  });
};
