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
