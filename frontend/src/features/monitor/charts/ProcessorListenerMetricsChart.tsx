import { useQuery } from "@tanstack/react-query";
import { MonitorApi } from "../api/MonitorApi";
import type { MetricRequest } from "../dto/monitor.request";
import { extractTime } from "../../../shared/utils/dateUtils";
import { DashboardChart } from "../components/DashboardChart";
import { TOPICS } from "../constants/topics";
import { useState } from "react";
import { POLLING_INTERVAL } from "../constants/common";

export const ProcessorListenerMetricsChart = (params: MetricRequest) => {
    const [topic, setTopic] = useState(TOPICS[0]);
    const { isLoading, data } = useQuery({
        queryKey: ["processor-listener-metrics", params],
        queryFn: () => MonitorApi.getProcessorListenerMetrics({ ...params, topic: topic }),
        refetchInterval: POLLING_INTERVAL,
    });

    const polledMap = (data?.polled?.data ?? []).reduce(
        (prev, cur) => ({ ...prev, [cur.timestamp]: cur.value }),
        {} as Record<string, number>,
    );
    const failureMap = (data?.failures?.data ?? []).reduce(
        (prev, cur) => ({ ...prev, [cur.timestamp]: cur.value }),
        {} as Record<string, number>,
    );
    const latencyP95Map = (data?.batchProcessingLatencyP95?.data ?? []).reduce(
        (prev, cur) => ({ ...prev, [cur.timestamp]: cur.value }),
        {} as Record<string, number>,
    );

    const timestamps = new Set([
        ...Object.keys(polledMap),
        ...Object.keys(failureMap),
        ...Object.keys(latencyP95Map),
    ]);

    const modifiedData = new Array(...timestamps).map((timestamp) => ({
        timestamp: extractTime(new Date(timestamp)),
        polled: polledMap[timestamp] ?? 0.0,
        failure: failureMap[timestamp] ?? 0.0,
        latencyP95: latencyP95Map[timestamp] ?? 0.0,
    }));

    return (
        <DashboardChart
            isLoading={isLoading}
            selectFiels={{
                options: TOPICS.map((v) => ({ label: v, value: v })),
                value: topic,
                onChange: (val) => !!val && setTopic(val),
            }}
            title="Processor Listener Metrics"
            data={modifiedData}
            lines={[
                { dataKey: "polled", name: "Polled", color: "#025b13" },
                { dataKey: "failure", name: "Failures", color: "#d90808" },
                { dataKey: "latencyP95", name: "Latency P95", color: "#f59e0b" },
            ]}
            showXAxis={true}
            showYAxis={true}
            showGradient={false}
        />
    );
};
