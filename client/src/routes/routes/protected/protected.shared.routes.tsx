import type { RouteObject } from "react-router-dom";
import { ROUTE_PATHS } from "../../constants";
import { ProfilePage } from "../../../features/auth/pages/ProfilePage";

export const protectedSharedRoutes: RouteObject[] = [
  {
    id: "profile",
    path: ROUTE_PATHS.profile,
    handle: {
      crumb: "Profile",
      description: "Your account details and session settings",
    },
    Component: ProfilePage,
  },
];
