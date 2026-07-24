import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { ROUTES } from './paths'

/** Requires an access token; redirects anonymous users to login. */
export function ProtectedRoute() {
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  if (!accessToken) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  return <Outlet />
}
