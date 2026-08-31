import { useQuery } from "@tanstack/react-query";
import { MonitorApi } from "../api/MonitorApi";
import type { MetricRequest } from "../dto/monitor.request";
import { extractTime } from "../../../shared/utils/dateUtils";
import { DashboardChart } from "../components/DashboardChart";
import { TOPICS } from "../constants/topics";
import { useState } from "react";
import { STREAMS } from "../constants/streams";

export const ProcessorStreamsMetricsChart = (params: MetricRequest) => {
    const [stream, setStream] = useState(TOPICS[0]);
    const { isLoading, data } = useQuery({
        queryKey: ["processor-listener-metrics", params],
        queryFn: () => MonitorApi.getProcessorStreamsMetrics({ ...params, stream }),
        refetchInterval: 1000,
    });

    const consumedMap = (data?.consumedPerSecond?.data ?? []).reduce(
        (prev, cur) => ({ ...prev, [cur.timestamp]: cur.value }),
        {} as Record<string, number>,
    );
    const failureMap = (data?.failedStreamThreads?.data ?? []).reduce(
        (prev, cur) => ({ ...prev, [cur.timestamp]: cur.value }),
        {} as Record<string, number>,
    );
    const polledMap = (data?.pollRatePerSecond?.data ?? []).reduce(
        (prev, cur) => ({ ...prev, [cur.timestamp]: cur.value }),
        {} as Record<string, number>,
    );
    const producedMap = (data?.producedPerSecond?.data ?? []).reduce(
        (prev, cur) => ({ ...prev, [cur.timestamp]: cur.value }),
        {} as Record<string, number>,
    );

    const timestamps = new Set([
        ...Object.keys(polledMap),
        ...Object.keys(failureMap),
        ...Object.keys(polledMap),
        ...Object.keys(producedMap),
    ]);

    const modifiedData = new Array(...timestamps).map((timestamp) => ({
        timestamp: extractTime(new Date(timestamp)),
        polled: polledMap[timestamp] ?? 0.0,
        failure: failureMap[timestamp] ?? 0.0,
        consumed: consumedMap[timestamp] ?? 0.0,
        produced: producedMap[timestamp] ?? 0.0,
    }));

    return (
        <DashboardChart
            isLoading={isLoading}
            selectFiels={{
                options: STREAMS.map((v) => ({ label: v, value: v })),
                value: stream,
                onChange: (val) => !!val && setStream(val),
            }}
            title="Processor Listener Metrics"
            data={modifiedData}
            lines={[
                { dataKey: "polled", name: "Polled", color: "#025b13" },
                { dataKey: "consumed", name: "Consumed", color: "#d90808" },
                { dataKey: "failure", name: "Failed", color: "#f59e0b" },
                { dataKey: "produced", name: "Produced", color: "#f59e0b" },
            ]}
            showXAxis={true}
            showYAxis={true}
            showGradient={false}
        />
    );
};
