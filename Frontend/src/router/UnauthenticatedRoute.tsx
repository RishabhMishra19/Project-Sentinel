import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "./routes";
import { useAppSelector } from "@/reduxStore/hooks";
import { Loader } from "lucide-react";

export const UnauthenticatedRoute = () => {
  const { currentUser, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <Loader />;
  }

  if (currentUser !== null) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};
