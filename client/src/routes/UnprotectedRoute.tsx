import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { ROUTES } from './paths'

/** Guest-only routes; redirects authenticated users to overview. */
export function UnprotectedRoute() {
  const accessToken = useAppSelector((state) => state.session.accessToken)
  if (accessToken) {
    return <Navigate to={ROUTES.OVERVIEW} replace />
  }
  return <Outlet />
}
