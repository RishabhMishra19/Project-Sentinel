import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { ROUTES } from './paths'

/** Guest-only routes; redirects authenticated users to Profile. */
export function UnprotectedRoute() {
  const accessToken = useAppSelector((state) => state.session.accessToken)
  if (accessToken) {
    return <Navigate to={ROUTES.PROFILE} replace />
  }
  return <Outlet />
}
