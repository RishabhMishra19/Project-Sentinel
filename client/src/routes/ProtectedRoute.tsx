import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { SHARED_ROUTES } from './paths'

/** Requires a signed-in user; redirects anonymous users to login. */
export function ProtectedRoute() {
  const user = useAppSelector((state) => state.session.user)
  if (!user) {
    return <Navigate to={SHARED_ROUTES.LOGIN} replace />
  }
  return <Outlet />
}
