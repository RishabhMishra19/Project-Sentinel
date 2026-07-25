import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { ROUTES } from './paths'

/** Guest-only routes; redirects authenticated users to Settings. */
export function UnprotectedRoute() {
  const accessToken = useAppSelector((state) => state.session.accessToken)
  if (accessToken) {
    return <Navigate to={ROUTES.SETTINGS} replace />
  }
  return <Outlet />
}
