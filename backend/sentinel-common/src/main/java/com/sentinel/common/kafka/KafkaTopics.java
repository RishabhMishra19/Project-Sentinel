package com.sentinel.common.kafka;

public class KafkaTopics {

    /**
     * Raw request log events produced by Sentinel agents/services.
     * Consumed by request-log processing and analytics pipelines.
     */
    public static final String request_logs = "request_logs";

    /**
     * One-minute aggregated request metrics grouped by tenant.
     * Used to persist and further aggregate tenant-level analytics.
     */
    public static final String tenant_minute_analytics = "tenant_minute_analytics";

    /**
     * One-minute aggregated request metrics grouped by product.
     * Used to persist and further aggregate product-level analytics.
     */
    public static final String product_minute_analytics = "product_minute_analytics";

    /**
     * One-minute aggregated request metrics grouped by service.
     * Used to persist and further aggregate service-level analytics.
     */
    public static final String service_minute_analytics = "service_minute_analytics";

    /**
     * One-minute aggregated request metrics grouped by endpoint.
     * Used to persist and further aggregate endpoint-level analytics.
     */
    public static final String endpoint_minute_analytics = "endpoint_minute_analytics";

    /**
     * Hourly aggregated tenant metrics derived from minute-level statistics.
     * Used for hourly tenant analytics and Cassandra persistence.
     */
    public static final String tenant_hour_analytics = "tenant_hour_analytics";

    /**
     * Hourly aggregated product metrics derived from minute-level statistics.
     * Used for hourly product analytics and Cassandra persistence.
     */
    public static final String product_hour_analytics = "product_hour_analytics";

    /**
     * Hourly aggregated service metrics derived from minute-level statistics.
     * Used for hourly service analytics and Cassandra persistence.
     */
    public static final String service_hour_analytics = "service_hour_analytics";

    /**
     * Hourly aggregated endpoint metrics derived from minute-level statistics.
     * Used for hourly endpoint analytics and Cassandra persistence.
     */
    public static final String endpoint_hour_analytics = "endpoint_hour_analytics";

    /**
     * Daily aggregated tenant metrics derived from hourly statistics.
     * Used for daily tenant analytics and Cassandra persistence.
     */
    public static final String tenant_day_analytics = "tenant_day_analytics";

    /**
     * Daily aggregated product metrics derived from hourly statistics.
     * Used for daily product analytics and Cassandra persistence.
     */
    public static final String product_day_analytics = "product_day_analytics";

    /**
     * Daily aggregated service metrics derived from hourly statistics.
     * Used for daily service analytics and Cassandra persistence.
     */
    public static final String service_day_analytics = "service_day_analytics";

    /**
     * Daily aggregated endpoint metrics derived from hourly statistics.
     * Used for daily endpoint analytics and Cassandra persistence.
     */
    public static final String endpoint_day_analytics = "endpoint_day_analytics";

    /**
     * Endpoint-level HTTP status code metrics.
     * Contains aggregated counts for 2xx, 3xx, 4xx, and 5xx responses
     * for each endpoint, used for endpoint health and status analytics.
     */
    public static final String endpoint_status_metrics = "endpoint_status_metrics";
}