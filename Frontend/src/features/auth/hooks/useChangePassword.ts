import { useMutation } from "@tanstack/react-query";
import authApi from "../api/authApi";

export default function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess() {
      console.log("password changed successfully");
    },
  });
}
