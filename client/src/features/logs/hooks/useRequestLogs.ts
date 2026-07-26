import { useQuery } from '@tanstack/react-query'
import type { ListQueryRequest } from '../../../shared/api/listQueryRequest'
import { RequestLogsApi } from '../api/RequestLogsApi'

export const requestLogsQueryKey = ['logs', 'requests'] as const

export function useRequestLogsQuery(params: ListQueryRequest | null) {
  return useQuery({
    queryKey: [...requestLogsQueryKey, 'list', params],
    queryFn: () => RequestLogsApi.list(params!),
    enabled: params != null,
  })
}

export function useRequestLogQuery(id: string | null) {
  return useQuery({
    queryKey: [...requestLogsQueryKey, 'detail', id],
    queryFn: () => RequestLogsApi.get(id!),
    enabled: id != null,
  })
}
