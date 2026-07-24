import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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

export function AppRouter() {
  const ready = useRestoreSession()
  useLoadCurrentUser()
  const accessToken = useAppSelector((state) => state.auth.accessToken)

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Restoring session…
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UnprotectedRoute />}>
          <Route element={<UnprotectedLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path={ROUTES.OVERVIEW} element={<OverviewPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={<Navigate to={accessToken ? ROUTES.OVERVIEW : ROUTES.LOGIN} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}
