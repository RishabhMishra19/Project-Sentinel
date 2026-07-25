import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { resolvePostLoginPath } from '../shared/session/sessionUtils'

/** Guest-only routes; redirects authenticated users to their home page. */
export function UnprotectedRoute() {
  const user = useAppSelector((state) => state.session.user)
  const activeTenant = useAppSelector((state) => state.session.activeTenant)
  if (user) {
    return <Navigate to={resolvePostLoginPath(user, activeTenant)} replace />
  }
  return <Outlet />
}
