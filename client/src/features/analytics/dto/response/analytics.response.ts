import type { AnalyticsBucket } from '../request/analytics.request'

export type AnalyticsSummaryResponse = {
  bucket: AnalyticsBucket
  scopeId: string
  requestCount: number
  errorCount: number
  errorRate: number
  status2xx: number
  status3xx: number
  status4xx: number
  status5xx: number
  latencyMinMs: number | null
  latencyMaxMs: number | null
  latencyP50Ms: number | null
  latencyP95Ms: number | null
  latencyP99Ms: number | null
  requestBytesTotal: number
  responseBytesTotal: number
  activeEndpointCount: number | null
}

export type AnalyticsTimeseriesPoint = {
  bucketStart: string
  requestCount: number
  errorCount: number
  errorRate: number
  status2xx: number
  status3xx: number
  status4xx: number
  status5xx: number
  latencyMinMs: number | null
  latencyMaxMs: number | null
  latencyP50Ms: number | null
  latencyP95Ms: number | null
  latencyP99Ms: number | null
  requestBytesTotal: number
  responseBytesTotal: number
}

export type AnalyticsTimeseriesResponse = {
  bucket: AnalyticsBucket
  points: AnalyticsTimeseriesPoint[]
}

export type AnalyticsRankingItem = {
  id: string
  name: string | null
  method: string | null
  pathTemplate: string | null
  requestCount: number
  errorRate: number
  latencyP95Ms: number | null
}

export type StatusBreakdownItem = {
  statusCode: number
  requestCount: number
}

export type ExceptionMetricItem = {
  exceptionType: string
  exceptionCount: number
}
