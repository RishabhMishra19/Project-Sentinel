import { useMutation } from "@tanstack/react-query";
import authApi from "../api/authApi";
import { useAppDispatch } from "@/reduxStore/hooks";
import { ROUTES } from "@/router/routes";
import { useNavigate } from "react-router-dom";
import { logout } from "../authSlice";
import type { ChangePasswordForm } from "../validation/changePasswordSchems";

type useChangePasswordProps = {
  onSuccess: () => void;
};

export default function useChangePassword({ onSuccess }: useChangePasswordProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess() {
      console.log("password changed successfully");
    },
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    mutate({ password: data.password });
    dispatch(logout());
    navigate(ROUTES.LOGIN);
    onSuccess();
  };

  return {
    onSubmit,
    isLoading: isPending,
  };
}
