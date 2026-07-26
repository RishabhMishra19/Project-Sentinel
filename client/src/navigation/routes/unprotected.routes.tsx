import { LoginPage } from "../../features/auth/pages/LoginPage";
import { ROUTE_PATHS } from "../constants";
import type { SentinelRouteObject } from "../types";

export const unprotectedPageRoutes: SentinelRouteObject[] = [
  {
    id: "login",
    path: ROUTE_PATHS.login,
    Component: LoginPage,
    isAccessibleTo: () => true,
    handle: {
      crumb: "Login",
      description: "Log in to your account",
    },
  },
];
