import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

/** Requires an access token; redirects anonymous users to login. */
export function ProtectedRoute() {
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  if (!accessToken) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
