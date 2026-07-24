import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { useLoadCurrentUser } from '../features/auth/hooks/useLoadCurrentUser'
import { useRestoreSession } from '../features/auth/hooks/useRestoreSession'
import { HomePage } from '../features/auth/pages/HomePage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { ProfilePage } from '../features/auth/pages/ProfilePage'
import { ROUTES } from './paths'
import { ProtectedRoute } from './ProtectedRoute'
import { UnprotectedRoute } from './UnprotectedRoute'

export function AppRouter() {
  const ready = useRestoreSession()
  useLoadCurrentUser()
  const accessToken = useAppSelector((state) => state.auth.accessToken)

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
        Restoring session…
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UnprotectedRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to={accessToken ? ROUTES.HOME : ROUTES.LOGIN} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}
