import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { appRouteTree } from "./routes";

export function AppRouter() {
  return <RouterProvider router={createBrowserRouter(appRouteTree)} />;
}
