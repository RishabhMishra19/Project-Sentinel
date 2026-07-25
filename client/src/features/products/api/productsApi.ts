import { PRODUCTS_API_ROUTES } from '../../../shared/api/apiRoutes'
import { apiManager } from '../../../shared/api/ApiManager'
import type { ProductListParams, CreateProductRequest, UpdateProductRequest } from '../dto/request/product.request'
import type { PageResponse } from '../../../shared/dto/response'
import type { ProductResponse } from '../dto/response/product.response'

export function listProducts(
  params: ProductListParams,
): Promise<PageResponse<ProductResponse>> {
  return apiManager.get<PageResponse<ProductResponse>>(PRODUCTS_API_ROUTES.LIST, {
    params,
  })
}

export function getProduct(id: string): Promise<ProductResponse> {
  return apiManager.get<ProductResponse>(PRODUCTS_API_ROUTES.BY_ID(id))
}

export function createProduct(
  payload: CreateProductRequest,
): Promise<ProductResponse> {
  return apiManager.post<ProductResponse>(PRODUCTS_API_ROUTES.LIST, payload)
}

export function updateProduct(
  id: string,
  payload: UpdateProductRequest,
): Promise<ProductResponse> {
  return apiManager.put<ProductResponse>(PRODUCTS_API_ROUTES.BY_ID(id), payload)
}

export function deleteProduct(id: string): Promise<void> {
  return apiManager.delete<void>(PRODUCTS_API_ROUTES.BY_ID(id))
}
