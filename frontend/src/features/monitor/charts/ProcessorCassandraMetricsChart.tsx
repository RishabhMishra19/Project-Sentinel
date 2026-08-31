import { useQuery } from "@tanstack/react-query";
import { MonitorApi } from "../api/MonitorApi";
import type { MetricRequest } from "../dto/monitor.request";
import { extractTime } from "../../../shared/utils/dateUtils";
import { DashboardChart } from "../components/DashboardChart";
import { useState } from "react";
import { CASSANDRA_TABLES } from "../constants/cassandraTables";
import { POLLING_INTERVAL } from "../constants/common";

export const ProcessorCassandraMetricsChart = (params: MetricRequest) => {
    const [ingestTable, setIngestTable] = useState(CASSANDRA_TABLES[0]);

    const { isLoading, data } = useQuery({
        queryKey: ["processor-cassandra-metrics", params, ingestTable],
        queryFn: () => MonitorApi.getProcessorCassandraMetrics({ ...params, table: ingestTable }),
        refetchInterval: POLLING_INTERVAL,
    });

    const writesMap = (data?.writes?.data ?? []).reduce(
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
        ...Object.keys(writesMap),
        ...Object.keys(failureMap),
        ...Object.keys(latencyP95Map),
    ]);

    const modifiedData = new Array(...timestamps).map((timestamp) => ({
        timestamp: extractTime(new Date(timestamp)),
        writes: writesMap[timestamp] ?? 0.0,
        failure: failureMap[timestamp] ?? 0.0,
        latencyP95: latencyP95Map[timestamp] ?? 0.0,
    }));

    return (
        <DashboardChart
            isLoading={isLoading}
            title="Processor Cassandra Metrics"
            selectFiels={{
                options: CASSANDRA_TABLES.map((v) => ({ label: v, value: v })),
                value: ingestTable,
                onChange: (val) => !!val && setIngestTable(val),
            }}
            data={modifiedData}
            lines={[
                { dataKey: "writes", name: "Writes", color: "#025b13" },
                { dataKey: "failure", name: "Failures", color: "#d90808" },
                { dataKey: "latencyP95", name: "Latency P95", color: "#f59e0b" },
            ]}
            showXAxis={true}
            showYAxis={true}
            showGradient={false}
        />
    );
};
