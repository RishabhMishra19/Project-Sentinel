import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../../routes/constants";
import { AuthApi } from "../api/AuthApi";
import { AuthUtils } from "../AuthUtils";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthApi.logout(),
    meta: { silent: true },
    onSettled: () => {
      AuthUtils.setNoAuth();
      queryClient.clear();
      navigate(`/${ROUTE_PATHS.login}`, { replace: true });
    },
  });
};
