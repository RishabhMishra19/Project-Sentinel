import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "../../../redux/hooks";
import { setAuthSession } from "../../../redux/session/sessionSlice";
import { getApiErrorMessage } from "../../../shared/forms/getApiErrorMessage";
import { AuthApi } from "../api/AuthApi";
import type { ChangePasswordRequest } from "../dto/request/auth.request";

export function useChangePassword() {
  const dispatch = useAppDispatch();

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
      dispatch(setAuthSession(data));
    },
  });
}
