export const ROUTES = {
  LOGIN: '/login',
  PROFILE: '/profile',
  TENANTS: '/tenants',
  PRODUCTS: '/products',
  SERVICES: '/services',
  PRODUCT_SERVICES: (productId: string) => `/products/${productId}/services`,
} as const
