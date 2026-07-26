export type RequestLogListParams = {
  from?: string
  to?: string
  productId?: string
  serviceId?: string
  endpointId?: string
  statusCode?: number
  statusClass?: string
  minDurationMs?: number
  traceId?: string
  requestId?: string
  page?: number
  size?: number
  sort?: string
}
