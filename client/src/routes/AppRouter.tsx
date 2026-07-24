import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { useLoadCurrentUser } from '../features/auth/hooks/useLoadCurrentUser'
import { useRestoreSession } from '../features/auth/hooks/useRestoreSession'
import { OverviewPage } from '../features/auth/pages/OverviewPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { ProfilePage } from '../features/auth/pages/ProfilePage'
import { SettingsPage } from '../features/auth/pages/SettingsPage'
import { ProtectedLayout } from '../shared/layout/ProtectedLayout'
import { UnprotectedLayout } from '../shared/layout/UnprotectedLayout'
import { ROUTES } from './paths'
import { ProtectedRoute } from './ProtectedRoute'
import { UnprotectedRoute } from './UnprotectedRoute'

function FallbackNavigate() {
  const accessToken = useAppSelector((state) => state.auth.accessToken)
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
        ],
      },
    ],
  },
  { path: '*', element: <FallbackNavigate /> },
])

export function AppRouter() {
  const ready = useRestoreSession()
  useLoadCurrentUser()

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Restoring session…
      </div>
    )
  }

  return <RouterProvider router={router} />
}
