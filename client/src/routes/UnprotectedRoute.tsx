import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { ROUTES } from './paths'

/** Guest-only routes; redirects authenticated users home. */
export function UnprotectedRoute() {
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  if (accessToken) {
    return <Navigate to={ROUTES.HOME} replace />
  }
  return <Outlet />
}
