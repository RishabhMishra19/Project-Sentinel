import { QueryGate } from "../../../shared/ui";
import type { AnalyticsTimeSeriesRequestParams } from "../dto/request/analytics.request";
import { useAnalyticsTimeseriesQuery } from "../hooks/useAnalytics";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";
import {
  AnalyticsErrorRateChart,
  AnalyticsLatencyChart,
  AnalyticsVolumeChart,
} from "./AnalyticsCharts";

export const AnalyticsTimeseriesCharts = () => {
  const { entityId, scope, from, to, bucket } = useAnalyticsSearchParams();
  let params: AnalyticsTimeSeriesRequestParams | null = null;
  if (from && to && scope && entityId && bucket) {
    params = { from, to, scope: scope as any, entityId, bucket: bucket as any };
  }
  const timeseriesQuery = useAnalyticsTimeseriesQuery(params);
  const points = timeseriesQuery.data?.points ?? [];

  return (
    <QueryGate
      isLoading={timeseriesQuery.isLoading}
      isError={timeseriesQuery.isError}
      errorMessage="Could not load timeseries."
      className="min-h-64"
    >
      <div className="flex 2-full">
        <div className="flex-1">
          <AnalyticsVolumeChart points={points} />
        </div>
        <div className="flex-1">
          <AnalyticsErrorRateChart points={points} />
        </div>
        <div className="flex-1">
          <AnalyticsLatencyChart points={points} />
        </div>
      </div>
    </QueryGate>
  );
};
