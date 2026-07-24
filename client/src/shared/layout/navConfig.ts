import { ROUTES } from '../../routes/paths'

export type NavItem = {
  id: string
  label: string
  path: string
  onlySentinelAdmin?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', path: ROUTES.OVERVIEW },
  { id: 'settings', label: 'Settings', path: ROUTES.SETTINGS },
  { id: 'tenants', label: 'Tenants', path: ROUTES.TENANTS, onlySentinelAdmin: true },
]
