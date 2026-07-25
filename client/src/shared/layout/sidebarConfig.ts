import { ROUTES } from '../../routes/paths'

export type SidebarItem = {
  id: string
  label: string
  path: string
  onlySentinelAdmin?: boolean
  requiresCatalogRead?: boolean
}

export const SIDE_BAR_ITEMS: SidebarItem[] = [
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
