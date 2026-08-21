import { AnalyticsKpiStrip } from "./AnalyticsKpiStrip";
import { AnalyticsRankingsTable } from "./AnalyticsRankingsTable";
import { AnalyticsTimeseriesCharts } from "./AnalyticsTimeseriesCharts";
import { EndpointStatusChart } from "./EndpointDetailCharts";

export const AnalyticsResults = () => {
  return (
    <div className="flex flex-col gap-4">
      <AnalyticsKpiStrip />
      <AnalyticsTimeseriesCharts />
      <div className="grid gap-4 lg:grid-cols-2">
        <EndpointStatusChart />
      </div>
      <AnalyticsRankingsTable />
    </div>
  );
};
