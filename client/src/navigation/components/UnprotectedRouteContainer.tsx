import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { UnauthenticatedLayout } from "../../shared/layout/UnauthenticatedLayout";
import { resolvePostLoginPath } from "../utils";

export const UnprotectedRouteContainer = () => {
  const user = useAppSelector((state) => state.session.user);
  const activeTenant = useAppSelector((state) => state.session.activeTenant);

  if (user) {
    return <Navigate to={resolvePostLoginPath(user, activeTenant)} replace />;
  }

  return <UnauthenticatedLayout />;
};
