import { useQuery } from "@tanstack/react-query";
import { AnalyticsApi } from "../api/AnalyticsApi";
import type {
  AnalyticsEntityAggregatedRequestParams,
  AnalyticsQueryParams,
  AnalyticsSummaryRequestParams,
} from "../dto/request/analytics.request";

const analyticsQueryKey = ["analytics"];

export const useAnalyticsSummaryQuery = (params: AnalyticsSummaryRequestParams | null) => {
  return useQuery({
    queryKey: [...analyticsQueryKey, "summary", params],
    queryFn: () => AnalyticsApi.summary(params!),
    enabled: params != null,
  });
};

export const useAnalyticsTimeseriesQuery = (params: AnalyticsQueryParams | null) => {
  return useQuery({
    queryKey: [...analyticsQueryKey, "timeseries", params],
    queryFn: () => AnalyticsApi.timeseries(params!),
    enabled: params != null,
  });
};

export const useAnalyticsEntityAggregatedQuery = (
  params: AnalyticsEntityAggregatedRequestParams | null,
) => {
  return useQuery({
    queryKey: [...analyticsQueryKey, "rankings", params],
    queryFn: () => AnalyticsApi.entityAggregated(params!),
    enabled: params != null,
  });
};

export const useEndpointStatusBreakdownQuery = (
  endpointId: string | null,
  from: string,
  to: string,
) => {
  return useQuery({
    queryKey: [...analyticsQueryKey, "status", endpointId, from, to],
    queryFn: () => AnalyticsApi.statusBreakdown(endpointId!, { from, to }),
    enabled: endpointId != null,
  });
};
