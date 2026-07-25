import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { SHARED_ROUTES } from './paths'

/** Guest-only routes; redirects authenticated users to Profile. */
export function UnprotectedRoute() {
  const user = useAppSelector((state) => state.session.user)
  if (user) {
    return <Navigate to={SHARED_ROUTES.PROFILE} replace />
  }
  return <Outlet />
}
