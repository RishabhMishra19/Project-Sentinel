import { ANALYTICS_API_ROUTES } from "../../../shared/api/api.routes";
import { apiManager } from "../../../shared/api/ApiManager";
import { analyticsParamsToListQuery } from "../../../shared/utils/queryUtils";
import type { PageResponse } from "../../../shared/dto/response/PageResponse";
import type {
  AnalyticsQueryParams,
  AnalyticsRankingsParams,
  GetAnalyticsSummaryRequestParams,
} from "../dto/request/analytics.request";
import type {
  AnalyticsRankingItem,
  AnalyticsSummaryResponse,
  AnalyticsTimeseriesResponse,
  ExceptionMetricItem,
  StatusBreakdownItem,
} from "../dto/response/analytics.response";

export class AnalyticsApi {
  static summary(params: GetAnalyticsSummaryRequestParams): Promise<AnalyticsSummaryResponse> {
    return apiManager.get<AnalyticsSummaryResponse>(ANALYTICS_API_ROUTES.SUMMARY, {
      params,
    });
  }

  static timeseries(params: AnalyticsQueryParams): Promise<AnalyticsTimeseriesResponse> {
    return apiManager.post<AnalyticsTimeseriesResponse>(
      ANALYTICS_API_ROUTES.TIMESERIES,
      analyticsParamsToListQuery(params),
    );
  }

  static rankings(params: AnalyticsRankingsParams): Promise<PageResponse<AnalyticsRankingItem>> {
    return apiManager.post<PageResponse<AnalyticsRankingItem>>(
      ANALYTICS_API_ROUTES.RANKINGS,
      analyticsParamsToListQuery(params),
    );
  }

  static statusBreakdown(
    endpointId: string,
    params: { from: string; to: string },
  ): Promise<StatusBreakdownItem[]> {
    return apiManager.post<StatusBreakdownItem[]>(
      ANALYTICS_API_ROUTES.STATUS_BREAKDOWN(endpointId),
      { from: params.from, to: params.to },
    );
  }

  static exceptions(
    endpointId: string,
    params: { from: string; to: string },
  ): Promise<ExceptionMetricItem[]> {
    return apiManager.post<ExceptionMetricItem[]>(ANALYTICS_API_ROUTES.EXCEPTIONS(endpointId), {
      from: params.from,
      to: params.to,
    });
  }
}
