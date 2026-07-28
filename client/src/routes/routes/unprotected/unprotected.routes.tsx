import type { RouteObject } from "react-router-dom";
import { LoginPage } from "../../../features/auth/pages/LoginPage";
import { ROUTE_PATHS } from "../../constants";

export const unprotectedPageRoutes: RouteObject[] = [
  {
    id: "login",
    path: ROUTE_PATHS.login,
    Component: LoginPage,
  },
];
