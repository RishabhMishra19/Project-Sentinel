import { ANALYTICS_API_ROUTES } from "../../../shared/api/api.routes";
import { apiManager } from "../../../shared/api/ApiManager";
import type {
  AnalyticsEntityAggregatedRequestParams,
  AnalyticsSummaryRequestParams,
  AnalyticsTimeSeriesRequestParams,
} from "../dto/request/analytics.request";
import type {
  AnalyticsSummaryResponse,
  AnalyticsTimeSeriesResponse,
  AnalyticsEntityAggregatedResponse,
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

  static entityAggregated(
    params: AnalyticsEntityAggregatedRequestParams,
  ): Promise<AnalyticsEntityAggregatedResponse> {
    return apiManager.get<AnalyticsEntityAggregatedResponse>(
      ANALYTICS_API_ROUTES.ENTITY_AGGREGATED,
      {
        params,
      },
    );
  }
}
