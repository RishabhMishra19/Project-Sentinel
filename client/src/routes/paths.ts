export const ROUTES = {
  OVERVIEW: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  TENANTS: '/tenants',
  PRODUCTS: '/products',
  SERVICES: '/services',
  PRODUCT_SERVICES: (productId: string) => `/products/${productId}/services`,
} as const
