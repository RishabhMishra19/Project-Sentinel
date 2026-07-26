import { NotFoundPage } from "../../features/auth/pages/NotFoundPage";
import type { SentinelRouteObject } from "../types";
import { unprotectedPageRoutes } from "./unprotected.routes";
import { protectedPageRoutes } from "./protected.routes";
import { SessionRestoreContainer } from "../components/SessionRestoreContainer";
import { ProtectedRouteContainer } from "../components/ProtectedRouteContainer";
import { UnprotectedRouteContainer } from "../components/UnprotectedRouteContainer";

export const appRouteTree: SentinelRouteObject[] = [
  {
    id: "session-restore-container",
    path: "",
    isWrapperRoute: true,
    Component: SessionRestoreContainer,
    isAccessibleTo: () => true,
    children: [
      {
        id: "unprotected-routes",
        path: "",
        isWrapperRoute: true,
        Component: UnprotectedRouteContainer,
        isAccessibleTo: (isLoggedIn: boolean) => !isLoggedIn,
        children: unprotectedPageRoutes,
      },
      {
        id: "protected-routes",
        path: "",
        isWrapperRoute: true,
        Component: ProtectedRouteContainer,
        isAccessibleTo: (isLoggedIn: boolean) => isLoggedIn,
        children: protectedPageRoutes,
      },
      {
        id: "not-found-route",
        path: "*",
        Component: NotFoundPage,
        isWrapperRoute: true,
        isAccessibleTo: () => true,
      },
    ],
  },
];
