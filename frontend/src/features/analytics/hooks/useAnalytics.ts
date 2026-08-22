import { useQuery } from "@tanstack/react-query";
import { AnalyticsApi } from "../api/AnalyticsApi";
import type {
  AnalyticsEntityAggregatedRequestParams,
  AnalyticsSummaryRequestParams,
} from "../dto/request/analytics.request";
import { useAnalyticsUrlState } from "./useAnalyticsUrlState";
import type { AnalyticsTimeSeriesResponse } from "../dto/response/analytics.response";

const analyticsQueryKey = ["analytics"];

export const useAnalyticsSummaryQuery = () => {
  const { entityId, validState } = useAnalyticsUrlState();
  const params: AnalyticsSummaryRequestParams = {
    scope: validState.scope,
    from: validState.from,
    to: validState.to,
    entityId,
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...analyticsQueryKey, "summary", params],
    queryFn: () => AnalyticsApi.summary(params!),
    enabled: params != null,
  });

  return {
    data,
    isLoading,
    isError,
    errorMessage: error?.message ?? "something went wrong",
  };
};

export const useAnalyticsTimeseriesQuery = () => {
  const { entityId, validState } = useAnalyticsUrlState();
  const params = {
    scope: validState.scope,
    bucket: validState.bucket,
    from: validState.from,
    to: validState.to,
    entityId,
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...analyticsQueryKey, "timeseries", params],
    queryFn: () => AnalyticsApi.timeseries(params!),
    select: (data) =>
      ({
        ...data,
        timeSeriesStats: data.timeSeriesStats.toReversed(),
      }) as AnalyticsTimeSeriesResponse,
    enabled: params != null,
  });

  return {
    data,
    isLoading,
    isError,
    errorMessage: error?.message ?? "something went wrong",
  };
};

export const useAnalyticsEntityAggregatedQuery = () => {
  const { validState } = useAnalyticsUrlState();
  const params = {
    scope: validState.scope,
    bucket: validState.bucket,
    from: validState.from,
    to: validState.to,
    tenantId: validState.tenantId,
    productId: validState.productId,
    serviceId: validState.serviceId,
    endpointId: validState.endpointId,
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...analyticsQueryKey, "rankings", params],
    queryFn: () => AnalyticsApi.entityAggregated(params!),
    enabled: params != null,
  });
  return {
    data,
    isLoading,
    isError,
    errorMessage: error?.message ?? "something went wrong",
  };
};
