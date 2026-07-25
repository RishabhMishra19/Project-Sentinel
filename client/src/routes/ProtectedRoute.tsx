import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { ROUTES } from './paths'

/** Requires an access token; redirects anonymous users to login. */
export function ProtectedRoute() {
  const accessToken = useAppSelector((state) => state.session.accessToken)
  if (!accessToken) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  return <Outlet />
}
