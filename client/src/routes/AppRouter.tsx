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
import {
  ADMIN_ONLY_ROUTES,
  SHARED_ROUTES,
  TENANT_CONTEXT_ROUTES,
} from "./paths";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminOnlyRoute } from "./AdminOnlyRoute";
import { SessionRestoreContainer } from "./SessionRestoreContainer";
import { UnprotectedRoute } from "./UnprotectedRoute";

function FallbackNavigate() {
  const user = useAppSelector((state) => state.session.user);
  return (
    <Navigate
      to={user ? SHARED_ROUTES.PROFILE : SHARED_ROUTES.LOGIN}
      replace
    />
  );
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
            children: [
              { path: SHARED_ROUTES.LOGIN, element: <LoginPage /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <ProtectedLayout />,
            children: [
              {
                path: "/",
                element: <Navigate to={SHARED_ROUTES.PROFILE} replace />,
              },
              {
                path: SHARED_ROUTES.PROFILE,
                handle: { crumb: "Profile" },
                element: <ProfilePage />,
              },
              {
                element: <AdminOnlyRoute />,
                children: [
                  {
                    path: ADMIN_ONLY_ROUTES.TENANTS,
                    handle: { crumb: "Tenants" },
                    element: <TenantsPage />,
                  },
                ],
              },
              {
                element: <TenantOnlyRoute />,
                children: [
                  {
                    path: TENANT_CONTEXT_ROUTES.PRODUCTS,
                    handle: { crumb: "Products" },
                    element: <ProductsPage />,
                  },
                  {
                    path: TENANT_CONTEXT_ROUTES.SERVICES,
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
