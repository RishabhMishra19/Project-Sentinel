import { PRODUCTS_API_ROUTES } from '../../../shared/api/api.routes'
import { apiManager } from '../../../shared/api/ApiManager'
import type { ProductListParams, CreateProductRequest, UpdateProductRequest } from '../dto/request/product.request'
import type { PageResponse } from '../../../shared/dto/response'
import type { ProductResponse } from '../dto/response/product.response'

export class ProductsApi {
  static list(params: ProductListParams): Promise<PageResponse<ProductResponse>> {
    return apiManager.get<PageResponse<ProductResponse>>(PRODUCTS_API_ROUTES.LIST, {
      params,
    })
  }

  static get(id: string): Promise<ProductResponse> {
    return apiManager.get<ProductResponse>(PRODUCTS_API_ROUTES.BY_ID(id))
  }

  static create(payload: CreateProductRequest): Promise<ProductResponse> {
    return apiManager.post<ProductResponse>(PRODUCTS_API_ROUTES.LIST, payload)
  }

  static update(id: string, payload: UpdateProductRequest): Promise<ProductResponse> {
    return apiManager.put<ProductResponse>(PRODUCTS_API_ROUTES.BY_ID(id), payload)
  }

  static delete(id: string): Promise<void> {
    return apiManager.delete<void>(PRODUCTS_API_ROUTES.BY_ID(id))
  }
}
