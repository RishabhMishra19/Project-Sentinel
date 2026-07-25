import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { ROUTES } from './paths'

/** Requires Sentinel admin after session is ready; redirects others to Profile. */
export function SentinelAdminRoute() {
  const user = useAppSelector((state) => state.session.user)

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted">
        Loading account…
      </div>
    )
  }

  if (!user.sentinelAdmin) {
    return <Navigate to={ROUTES.PROFILE} replace />
  }

  return <Outlet />
}
