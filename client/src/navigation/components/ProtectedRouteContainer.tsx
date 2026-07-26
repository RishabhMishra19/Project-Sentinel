import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { AuthenticatedLayout } from "../../shared/layout/AuthenticatedLayout";
import { ROUTE_PATHS } from "../constants";

export const ProtectedRouteContainer = () => {
  const user = useAppSelector((state) => state.session.user);

  if (!user) {
    return <Navigate to={`/${ROUTE_PATHS.login}`} replace />;
  }

  return <AuthenticatedLayout />;
};
