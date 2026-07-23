import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { useLoadCurrentUser } from '../features/auth/hooks/useLoadCurrentUser'
import { useRestoreSession } from '../features/auth/hooks/useRestoreSession'
import { HomePage } from '../features/auth/pages/HomePage'
import { LoginPage } from '../features/auth/pages/LoginPage'
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
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="*" element={<Navigate to={accessToken ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
