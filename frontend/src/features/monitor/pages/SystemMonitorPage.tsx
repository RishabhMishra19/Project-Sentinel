import { getDateTimeRange } from "../../../shared/utils/dateUtils";
import { IngestAppMetricsChart } from "../charts/IngestAppMetricsChart";
import { IngestKafkaMetricsChart } from "../charts/IngestKafkaMetricsChart";
import { ProcessorCassandraMetricsChart } from "../charts/ProcessorCassandraMetricsChart";
import { ProcessorListenerMetricsChart } from "../charts/ProcessorListenerMetricsChart";
import { ProcessorStreamsMetricsChart } from "../charts/ProcessorStreamsMetricsChart";

export default function ProcessorDashboard() {
    return (
        <div className="min-h-screen px-4 py-3 text-slate-200">
            <div className="mx-auto max-w-[1600px]">
                {/* <DashboardHeader autoRefresh={autoRefresh} setAutoRefresh={setAutoRefresh} /> */}

                <div className="flex flex-wrap w-full justify-between">
                    <IngestKafkaMetricsChart {...getDateTimeRange(5000)} />
                    <ProcessorListenerMetricsChart {...getDateTimeRange(5000)} />
                    <ProcessorCassandraMetricsChart {...getDateTimeRange(5000)} />
                    <ProcessorStreamsMetricsChart {...getDateTimeRange(5000)} />
                </div>
                <IngestAppMetricsChart {...getDateTimeRange(5000)} />
                <div className="mt-2 flex items-center gap-1.5 text-[8px] text-slate-600">
                    <span className="text-blue-400">ⓘ</span>
                    All rates are calculated using Prometheus rate() over a 1-minute window. Times
                    shown in UTC.
                </div>
            </div>
        </div>
    );
}
