import { ROUTES } from '../../routes/paths'

export type NavItem = {
  id: string
  label: string
  path: string
  onlySentinelAdmin?: boolean
  requiresCatalogRead?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'tenants', label: 'Tenants', path: ROUTES.TENANTS, onlySentinelAdmin: true },
  {
    id: 'products',
    label: 'Products',
    path: ROUTES.PRODUCTS,
    requiresCatalogRead: true,
  },
  {
    id: 'services',
    label: 'Services',
    path: ROUTES.SERVICES,
    requiresCatalogRead: true,
  },
]
