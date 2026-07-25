import { ROUTES } from '../../routes/paths'

export type SidebarItem = {
  id: string
  label: string
  path: string
  requiresCatalogRead?: boolean
}

export const ADMIN_SIDE_BAR_ITEMS: SidebarItem[] = [
  { id: 'tenants', label: 'Tenants', path: ROUTES.TENANTS },
]

export const TENANT_SIDE_BAR_ITEMS: SidebarItem[] = [
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
