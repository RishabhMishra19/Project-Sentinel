import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import { canReadCatalog } from '../shared/permissions/canReadCatalog'
import { ROUTES } from './paths'

/** Requires product/service read access after session is ready; redirects others to Profile. */
export function CatalogReadRoute() {
  const user = useAppSelector((state) => state.session.user)

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted">
        Loading account…
      </div>
    )
  }

  if (!canReadCatalog(user.sentinelAdmin, user.roles)) {
    return <Navigate to={ROUTES.PROFILE} replace />
  }

  return <Outlet />
}
