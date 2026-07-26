import { Navigate, useLocation, useMatches } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { AuthenticatedLayout } from "../../shared/layout/AuthenticatedLayout";
import { resolvePageHeader, type PageMatch } from "../../shared/layout/pageHeader";
import { ROUTE_PATHS } from "../constants";

export const ProtectedRouteContainer = () => {
  const user = useAppSelector((state) => state.session.user);
  const matches = useMatches() as PageMatch[];
  const { state } = useLocation();

  if (!user) {
    return <Navigate to={`/${ROUTE_PATHS.login}`} replace />;
  }

  const { crumbs, description } = resolvePageHeader(matches, state);

  return <AuthenticatedLayout crumbs={crumbs} description={description} />;
};
