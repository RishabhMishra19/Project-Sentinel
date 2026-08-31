import { useQuery } from "@tanstack/react-query";
import { MonitorApi } from "../api/MonitorApi";
import type { MetricRequest } from "../dto/monitor.request";
import { extractTime } from "../../../shared/utils/dateUtils";
import { useState } from "react";
import { DashboardChart } from "../components/DashboardChart";

export const IngestKafkaMetricsChart = (params: MetricRequest) => {
    const [ingestTopic, setIngestTopic] = useState("request_logs");
    const { isLoading, data } = useQuery({
        queryKey: ["ingest-kafka-metrics", params],
        queryFn: () => MonitorApi.getIngestKafkaMetrics({ ...params, topic: ingestTopic }),
        refetchInterval: 1000,
    });

    const requestsMap = (data?.kafkaPublished?.data ?? []).reduce(
        (prev, cur) => ({ ...prev, [cur.timestamp]: cur.value }),
        {} as Record<string, number>,
    );
    const failureMap = (data?.kafkaPublishFailures?.data ?? []).reduce(
        (prev, cur) => ({ ...prev, [cur.timestamp]: cur.value }),
        {} as Record<string, number>,
    );
    const latencyP95Map = (data?.kafkaPublishLatencyP95?.data ?? []).reduce(
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

    return (
        <DashboardChart
            isLoading={isLoading}
            selectFiels={{
                options: [{ label: "request_logs", value: "request_logs" }],
                value: ingestTopic,
                onChange: (val) => !!val && setIngestTopic(val),
            }}
            title="Ingest Kafka Metrics"
            data={modifiedData}
            lines={[
                { dataKey: "total", name: "Published", color: "#025b13" },
                { dataKey: "failure", name: "Failures", color: "#d90808" },
                { dataKey: "latencyP95", name: "Latency P95", color: "#f59e0b" },
            ]}
        />
    );
};
