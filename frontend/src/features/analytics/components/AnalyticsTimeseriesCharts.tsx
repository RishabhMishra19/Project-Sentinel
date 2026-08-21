import { useAppSelector } from "../../../redux/hooks";
import { QueryGate } from "../../../shared/ui";
import type { AnalyticsQueryParams } from "../dto/request/analytics.request";
import { useAnalyticsTimeseriesQuery } from "../hooks/useAnalytics";
import { getTimeSeriesRequestParams } from "../utils/analyticsUrl";
import {
  AnalyticsErrorRateChart,
  AnalyticsLatencyChart,
  AnalyticsVolumeChart,
} from "./AnalyticsCharts";

export const AnalyticsTimeseriesCharts = ({ params }: { params: AnalyticsQueryParams }) => {
  const tenantId = useAppSelector((state) => state.session.activeTenant?.id!);
  const timeseriesQuery = useAnalyticsTimeseriesQuery(getTimeSeriesRequestParams(params, tenantId));
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
