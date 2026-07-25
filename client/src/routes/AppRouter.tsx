import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { SessionBootstrapScreen } from '../features/auth/components/SessionBootstrapScreen'
import { useAppInit } from '../features/auth/hooks/useAppInit'
import { OverviewPage } from '../features/auth/pages/OverviewPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { ProfilePage } from '../features/auth/pages/ProfilePage'
import { SettingsPage } from '../features/auth/pages/SettingsPage'
import { TenantsPage } from '../features/tenants/pages/TenantsPage'
import { ProductServicesPage } from '../features/products/pages/ProductServicesPage'
import { ProductsPage } from '../features/products/pages/ProductsPage'
import { ServicesPage } from '../features/services/pages/ServicesPage'
import { ProtectedLayout } from '../shared/layout/ProtectedLayout'
import { UnprotectedLayout } from '../shared/layout/UnprotectedLayout'
import { CatalogReadRoute } from './CatalogReadRoute'
import { ROUTES } from './paths'
import { ProtectedRoute } from './ProtectedRoute'
import { SentinelAdminRoute } from './SentinelAdminRoute'
import { UnprotectedRoute } from './UnprotectedRoute'

function FallbackNavigate() {
  const accessToken = useAppSelector((state) => state.session.accessToken)
  return <Navigate to={accessToken ? ROUTES.OVERVIEW : ROUTES.LOGIN} replace />
}

const router = createBrowserRouter([
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
          { path: ROUTES.OVERVIEW, handle: { crumb: 'Overview' }, element: <OverviewPage /> },
          { path: ROUTES.PROFILE, handle: { crumb: 'Profile' }, element: <ProfilePage /> },
          { path: ROUTES.SETTINGS, handle: { crumb: 'Settings' }, element: <SettingsPage /> },
          {
            element: <SentinelAdminRoute />,
            children: [
              { path: ROUTES.TENANTS, handle: { crumb: 'Tenants' }, element: <TenantsPage /> },
            ],
          },
          {
            element: <CatalogReadRoute />,
            children: [
              {
                path: ROUTES.PRODUCTS,
                handle: { crumb: 'Products' },
                element: <ProductsPage />,
              },
              {
                path: ROUTES.SERVICES,
                handle: { crumb: 'Services' },
                element: <ServicesPage />,
              },
              {
                path: '/products/:productId/services',
                handle: { crumb: 'Services' },
                element: <ProductServicesPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <FallbackNavigate /> },
])

export function AppRouter() {
  const { checkingSession } = useAppInit()

  if (checkingSession) {
    return <SessionBootstrapScreen />
  }

  return <RouterProvider router={router} />
}
