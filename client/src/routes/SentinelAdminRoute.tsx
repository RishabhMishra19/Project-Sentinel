import { Outlet } from 'react-router-dom'
import { UnauthorizedPage } from '../features/auth/pages/UnauthorizedPage'
import { useAppSelector } from '../redux/hooks'

/** Requires Sentinel admin; shows UnauthorizedPage otherwise. */
export function SentinelAdminRoute() {
  const user = useAppSelector((state) => state.session.user)!

  if (!user.sentinelAdmin) {
    return <UnauthorizedPage />
  }

  return <Outlet />
}
