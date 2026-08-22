import { ANALYTICS_API_ROUTES } from "../../../shared/api/api.routes";
import { apiManager } from "../../../shared/api/ApiManager";
import type {
  AnalyticsEntityAggregatedRequestParams as AnalyticsChildrenAggregatedRequestParams,
  AnalyticsSummaryRequestParams,
  AnalyticsTimeSeriesRequestParams,
} from "../dto/request/analytics.request";
import type {
  AnalyticsSummaryResponse,
  AnalyticsTimeSeriesResponse,
  AnalyticsEntityAggregatedResponse as AnalyticsChildrenAggregatedResponse,
} from "../dto/response/analytics.response";

export class AnalyticsApi {
  static summary(params: AnalyticsSummaryRequestParams): Promise<AnalyticsSummaryResponse> {
    return apiManager.get<AnalyticsSummaryResponse>(ANALYTICS_API_ROUTES.SUMMARY, {
      params,
    });
  }

  static timeseries(
    params: AnalyticsTimeSeriesRequestParams,
  ): Promise<AnalyticsTimeSeriesResponse> {
    return apiManager.get<AnalyticsTimeSeriesResponse>(ANALYTICS_API_ROUTES.TIMESERIES, {
      params,
    });
  }

  static childrenAggregated(
    params: AnalyticsChildrenAggregatedRequestParams,
  ): Promise<AnalyticsChildrenAggregatedResponse> {
    return apiManager.get<AnalyticsChildrenAggregatedResponse>(
      ANALYTICS_API_ROUTES.CHILDREN_AGGREGATED,
      {
        params,
      },
    );
  }
}
