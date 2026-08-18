import { NotFoundPage } from "../../features/auth/pages/NotFoundPage";
import { unprotectedPageRoutes } from "./unprotected/unprotected.routes";
import { protectedPageRoutes } from "./protected/protected.routes";
import { SessionRestoreContainer } from "../components/SessionRestoreContainer";
import { ProtectedRouteContainer } from "../components/ProtectedRouteContainer";
import { UnprotectedRouteContainer } from "../components/UnprotectedRouteContainer";
import type { RouteObject } from "react-router-dom";
import { RedirectAfterLoginRoute } from "../components/RedirectAfterLoginRoute";

export const appRouteTree: RouteObject[] = [
  {
    id: "session-restore-container",
    Component: SessionRestoreContainer,
    children: [
      {
        id: "root-route",
        index: true,
        Component: RedirectAfterLoginRoute,
      },
      {
        id: "unprotected-routes",
        Component: UnprotectedRouteContainer,
        children: unprotectedPageRoutes,
      },
      {
        id: "protected-routes",
        path: "",
        Component: ProtectedRouteContainer,
        children: protectedPageRoutes,
      },
      {
        id: "not-found-route",
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
];
