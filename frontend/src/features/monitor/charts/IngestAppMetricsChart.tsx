import { useQuery } from "@tanstack/react-query";
import { MonitorApi } from "../api/MonitorApi";
import type { MetricRequest } from "../dto/monitor.request";
import { extractTime } from "../../../shared/utils/dateUtils";
import { DashboardChart } from "../components/DashboardChart";

export const IngestAppMetricsChart = (params: MetricRequest) => {
    const { isLoading, data } = useQuery({
        queryKey: ["ingest-app-metrics", params],
        queryFn: () => MonitorApi.getIngestAppMetrics(params),
        refetchInterval: 1000,
    });

    const requestsMap = (data?.requests?.data ?? []).reduce(
        (prev, cur) => ({ ...prev, [cur.timestamp]: cur.value }),
        {} as Record<string, number>,
    );
    const failureMap = (data?.failures?.data ?? []).reduce(
        (prev, cur) => ({ ...prev, [cur.timestamp]: cur.value }),
        {} as Record<string, number>,
    );
    const latencyP95Map = (data?.latencyP95?.data ?? []).reduce(
        (prev, cur) => ({ ...prev, [cur.timestamp]: cur.value }),
        {} as Record<string, number>,
    );

    const timestamps = new Set([
        ...Object.keys(requestsMap),
        ...Object.keys(failureMap),
        ...Object.keys(latencyP95Map),
    ]);

    const modifiedData = new Array(...timestamps).map((timestamp) => ({
        timestamp: extractTime(new Date(timestamp)),
        total: requestsMap[timestamp] ?? 0.0,
        failure: failureMap[timestamp] ?? 0.0,
        latencyP95: latencyP95Map[timestamp] ?? 0.0,
    }));

    return isLoading ? (
        <></>
    ) : (
        <DashboardChart
            title="Ingest App Metrics"
            data={modifiedData}
            lines={[
                { dataKey: "total", name: "Total", color: "#025b13" },
                { dataKey: "failure", name: "Failure", color: "#d90808" },
                { dataKey: "latencyP95", name: "Latency P95", color: "#f59e0b" },
            ]}
            height={150}
            showXAxis={true}
            showYAxis={true}
            showGradient={false}
            showGrid={true}
        />
    );
};
