import { Outlet } from 'react-router-dom'
import { UnauthorizedPage } from '../features/auth/pages/UnauthorizedPage'
import { useAppSelector } from '../redux/hooks'

/** Requires Sentinel admin (not impersonating); shows UnauthorizedPage otherwise. */
export function AdminOnlyRoute() {
  const user = useAppSelector((state) => state.session.user)!
  const activeTenant = useAppSelector((state) => state.session.activeTenant)

  const isSentinelAdmin = user.sentinelAdmin
  const isImpersonating = isSentinelAdmin && activeTenant != null

  if (!user.sentinelAdmin || isImpersonating) {
    return <UnauthorizedPage />
  }

  return <Outlet />
}
