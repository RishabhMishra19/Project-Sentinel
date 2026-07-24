import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { ROUTES } from './paths'

/** Requires Sentinel admin after /me is ready; redirects others to Overview. */
export function SentinelAdminRoute() {
  const meStatus = useAppSelector((state) => state.auth.meStatus)
  const isSentinelAdmin = useAppSelector((state) => state.auth.user?.sentinelAdmin === true)

  if (meStatus !== 'ready') {
    return (
      <div className="flex flex-1 items-center justify-center text-muted">
        Loading account…
      </div>
    )
  }

  if (!isSentinelAdmin) {
    return <Navigate to={ROUTES.OVERVIEW} replace />
  }

  return <Outlet />
}
