import { useQuery } from '@tanstack/react-query'
import { RequestLogsApi } from '../api/RequestLogsApi'
import type { RequestLogListParams } from '../dto/request/requestLog.request'

export const requestLogsQueryKey = ['logs', 'requests'] as const

export function useRequestLogsQuery(params: RequestLogListParams | null) {
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
