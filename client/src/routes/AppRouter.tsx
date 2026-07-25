import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { ProfilePage } from "../features/auth/pages/ProfilePage";
import { TenantsPage } from "../features/tenants/pages/TenantsPage";
import { ProductServicesPage } from "../features/products/pages/ProductServicesPage";
import { ProductsPage } from "../features/products/pages/ProductsPage";
import { ServicesPage } from "../features/services/pages/ServicesPage";
import { ProtectedLayout } from "../shared/layout/ProtectedLayout";
import { UnprotectedLayout } from "../shared/layout/UnprotectedLayout";
import { TenantOnlyRoute } from "./TenantOnlyRoute";
import { ROUTES } from "./paths";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminOnlyRoute } from "./AdminOnlyRoute";
import { SessionRestoreContainer } from "./SessionRestoreContainer";
import { UnprotectedRoute } from "./UnprotectedRoute";

function FallbackNavigate() {
  const user = useAppSelector((state) => state.session.user);
  return <Navigate to={user ? ROUTES.PROFILE : ROUTES.LOGIN} replace />;
}

const router = createBrowserRouter([
  {
    element: <SessionRestoreContainer />,
    children: [
      {
        element: <UnprotectedRoute />,
        children: [
          {
            element: <UnprotectedLayout />,
            children: [{ path: ROUTES.LOGIN, element: <LoginPage /> }],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <ProtectedLayout />,
            children: [
              { path: "/", element: <Navigate to={ROUTES.PROFILE} replace /> },
              {
                path: ROUTES.PROFILE,
                handle: { crumb: "Profile" },
                element: <ProfilePage />,
              },
              {
                element: <AdminOnlyRoute />,
                children: [
                  {
                    path: ROUTES.TENANTS,
                    handle: { crumb: "Tenants" },
                    element: <TenantsPage />,
                  },
                ],
              },
              {
                element: <TenantOnlyRoute />,
                children: [
                  {
                    path: ROUTES.PRODUCTS,
                    handle: { crumb: "Products" },
                    element: <ProductsPage />,
                  },
                  {
                    path: ROUTES.SERVICES,
                    handle: { crumb: "Services" },
                    element: <ServicesPage />,
                  },
                  {
                    path: "/products/:productId/services",
                    handle: { crumb: "Services" },
                    element: <ProductServicesPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: "*", element: <FallbackNavigate /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
