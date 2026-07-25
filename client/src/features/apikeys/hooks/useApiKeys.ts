import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiKeysApi } from '../api/ApiKeysApi'
import type {
  CreateServiceApiKeyRequest,
  ServiceApiKeyListParams,
} from '../dto/request/apikey.request'

export const apiKeysQueryKey = (productId: string, serviceId: string) =>
  ['api-keys', productId, serviceId] as const

export function useServiceApiKeysQuery(
  productId: string | undefined,
  serviceId: string | undefined,
  params: ServiceApiKeyListParams | null,
) {
  return useQuery({
    queryKey: [
      ...apiKeysQueryKey(productId ?? '', serviceId ?? ''),
      'list',
      params,
    ],
    queryFn: () => ApiKeysApi.list(productId!, serviceId!, params!),
    enabled: productId != null && serviceId != null && params != null,
  })
}

export function useCreateServiceApiKey(productId: string, serviceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateServiceApiKeyRequest) =>
      ApiKeysApi.create(productId, serviceId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: apiKeysQueryKey(productId, serviceId),
      })
    },
  })
}

export function useRevokeServiceApiKey(productId: string, serviceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ApiKeysApi.revoke(productId, serviceId, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: apiKeysQueryKey(productId, serviceId),
      })
    },
  })
}
