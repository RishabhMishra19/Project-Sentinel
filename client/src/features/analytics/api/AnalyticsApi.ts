import { ANALYTICS_API_ROUTES } from '../../../shared/api/api.routes'
import { apiManager } from '../../../shared/api/ApiManager'
import type { PageResponse } from '../../../shared/dto/response/PageResponse'
import type {
  AnalyticsQueryParams,
  AnalyticsRankingsParams,
} from '../dto/request/analytics.request'
import type {
  AnalyticsRankingItem,
  AnalyticsSummaryResponse,
  AnalyticsTimeseriesResponse,
  ExceptionMetricItem,
  StatusBreakdownItem,
} from '../dto/response/analytics.response'

export class AnalyticsApi {
  static summary(params: AnalyticsQueryParams): Promise<AnalyticsSummaryResponse> {
    return apiManager.get<AnalyticsSummaryResponse>(ANALYTICS_API_ROUTES.SUMMARY, {
      params,
    })
  }

  static timeseries(
    params: AnalyticsQueryParams,
  ): Promise<AnalyticsTimeseriesResponse> {
    return apiManager.get<AnalyticsTimeseriesResponse>(
      ANALYTICS_API_ROUTES.TIMESERIES,
      { params },
    )
  }

  static rankings(
    params: AnalyticsRankingsParams,
  ): Promise<PageResponse<AnalyticsRankingItem>> {
    return apiManager.get<PageResponse<AnalyticsRankingItem>>(
      ANALYTICS_API_ROUTES.RANKINGS,
      { params },
    )
  }

  static statusBreakdown(
    endpointId: string,
    params: { from: string; to: string },
  ): Promise<StatusBreakdownItem[]> {
    return apiManager.get<StatusBreakdownItem[]>(
      ANALYTICS_API_ROUTES.STATUS_BREAKDOWN(endpointId),
      { params },
    )
  }

  static exceptions(
    endpointId: string,
    params: { from: string; to: string },
  ): Promise<ExceptionMetricItem[]> {
    return apiManager.get<ExceptionMetricItem[]>(
      ANALYTICS_API_ROUTES.EXCEPTIONS(endpointId),
      { params },
    )
  }
}
