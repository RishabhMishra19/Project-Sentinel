import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import { appRouteTree } from "./routes";

export const AppRouter = () => {
  return <RouterProvider router={createBrowserRouter(appRouteTree as RouteObject[])} />;
};
