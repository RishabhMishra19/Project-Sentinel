import { ANALYTICS_API_ROUTES } from "../../../shared/api/api.routes";
import { apiManager } from "../../../shared/api/ApiManager";
import { analyticsParamsToListQuery } from "../../../shared/utils/queryUtils";
import type {
  AnalyticsEntityAggregatedRequestParams,
  AnalyticsSummaryRequestParams,
  AnalyticsTimeSeriesRequestParams,
} from "../dto/request/analytics.request";
import type {
  AnalyticsEntityAggregatedResponse,
  AnalyticsSummaryResponse,
  AnalyticsTimeseriesResponse,
  StatusBreakdownItem,
} from "../dto/response/analytics.response";

export class AnalyticsApi {
  static summary(params: AnalyticsSummaryRequestParams): Promise<AnalyticsSummaryResponse> {
    return apiManager.get<AnalyticsSummaryResponse>(ANALYTICS_API_ROUTES.SUMMARY, {
      params,
    });
  }

  static timeseries(
    params: AnalyticsTimeSeriesRequestParams,
  ): Promise<AnalyticsTimeseriesResponse> {
    return apiManager.get<AnalyticsTimeseriesResponse>(ANALYTICS_API_ROUTES.TIMESERIES, {
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

  static statusBreakdown(
    endpointId: string,
    params: { from: string; to: string },
  ): Promise<StatusBreakdownItem[]> {
    return apiManager.post<StatusBreakdownItem[]>(
      ANALYTICS_API_ROUTES.STATUS_BREAKDOWN(endpointId),
      { from: params.from, to: params.to },
    );
  }
}
