import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "../../../app/hooks";
import { changePassword } from "../api/authApi";
import { setCredentials } from "../slices/authSlice";

export function useChangePassword() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      dispatch(setCredentials({ accessToken: data.accessToken }));
    },
  });
}
