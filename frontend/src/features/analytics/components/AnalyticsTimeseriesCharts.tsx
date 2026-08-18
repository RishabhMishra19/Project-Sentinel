import { QueryGate } from "../../../shared/ui";
import type { AnalyticsQueryParams } from "../dto/request/analytics.request";
import { useAnalyticsTimeseriesQuery } from "../hooks/useAnalytics";
import {
  AnalyticsErrorRateChart,
  AnalyticsLatencyChart,
  AnalyticsVolumeChart,
} from "./AnalyticsCharts";

export const AnalyticsTimeseriesCharts = ({ params }: { params: AnalyticsQueryParams }) => {
  const timeseriesQuery = useAnalyticsTimeseriesQuery(params);
  const points = timeseriesQuery.data?.points ?? [];

  return (
    <QueryGate
      isLoading={timeseriesQuery.isLoading}
      isError={timeseriesQuery.isError}
      errorMessage="Could not load timeseries."
      className="min-h-64"
    >
      <div className="grid gap-4 lg:grid-cols-1">
        <AnalyticsVolumeChart points={points} />
        <AnalyticsErrorRateChart points={points} />
        <AnalyticsLatencyChart points={points} />
      </div>
    </QueryGate>
  );
};
