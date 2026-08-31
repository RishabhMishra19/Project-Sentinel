import { MONITOR } from "../../../shared/api/api.routes";
import { apiManager } from "../../../shared/api/ApiManager";
import type {
    CassandraMetricsRequest,
    KafkaMetricsRequest,
    KafkaStreamsMetricsRequest,
    MetricRequest,
} from "../dto/monitor.request";
import type {
    IngestAppMetricsResponse,
    IngestKafkaMetricsResponse,
    KafkaMetricPoint,
    ProcessorCassandraMetricsResponse,
    ProcessorListenerMetricsResponse,
    ProcessorStreamsMetricsResponse,
} from "../dto/monitor.response";

export class MonitorApi {
    static getIngestAppMetrics(params: MetricRequest): Promise<IngestAppMetricsResponse> {
        return apiManager.get<IngestAppMetricsResponse>(MONITOR.GET_INGEST_APP_METRICS, { params });
    }
    static getIngestKafkaMetrics(params: KafkaMetricsRequest): Promise<IngestKafkaMetricsResponse> {
        return apiManager.get<IngestKafkaMetricsResponse>(MONITOR.GET_INGEST_KAFKA_METRICS, {
            params,
        });
    }
    static getProcessorCassandraMetrics(
        params: CassandraMetricsRequest,
    ): Promise<ProcessorCassandraMetricsResponse> {
        return apiManager.get<ProcessorCassandraMetricsResponse>(
            MONITOR.GET_PROCESSOR_CASSANDRA_METRICS,
            {
                params,
            },
        );
    }
    static getProcessorListenerMetrics(
        params: KafkaMetricsRequest,
    ): Promise<ProcessorListenerMetricsResponse> {
        return apiManager.get<ProcessorListenerMetricsResponse>(
            MONITOR.GET_PROCESSOR_LISTENER_METRICS,
            {
                params,
            },
        );
    }
    static getProcessorStreamsMetrics(
        params: KafkaStreamsMetricsRequest,
    ): Promise<ProcessorStreamsMetricsResponse> {
        return apiManager.get<ProcessorStreamsMetricsResponse>(
            MONITOR.GET_PROCESSOR_STREAMS_METRICS,
            {
                params,
            },
        );
    }
    static getKafkaMessagesIn(params: KafkaMetricsRequest): Promise<KafkaMetricPoint[]> {
        return apiManager.get<KafkaMetricPoint[]>(MONITOR.GET_MESSAGES_IN, { params });
    }
}
