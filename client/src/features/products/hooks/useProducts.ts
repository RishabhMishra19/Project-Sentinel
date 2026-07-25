import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ProductsApi } from '../api/ProductsApi'
import type { ProductListParams, CreateProductRequest, UpdateProductRequest } from '../dto/request/product.request'

export const productsQueryKey = ['products'] as const

export function useProductsQuery(params: ProductListParams | null) {
  return useQuery({
    queryKey: [...productsQueryKey, 'list', params],
    queryFn: () => ProductsApi.list(params!),
    enabled: params != null,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProductRequest) => ProductsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsQueryKey })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateProductRequest
    }) => ProductsApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsQueryKey })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ProductsApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsQueryKey })
    },
  })
}
