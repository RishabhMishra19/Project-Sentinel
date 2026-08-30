package com.sentinel.common.cassandra;

import java.util.List;

public class CassandraTables {

    /**
     * Raw request log events produced by Sentinel agents/services.
     */
    public static final String request_logs = "request_logs";

    /**
     * Raw request log lookups events produced by Sentinel agents/services..
     */
    public static final String request_logs_lookup_by_id = "request_logs_lookup_by_id";

    /**
     * One-minute aggregated request metrics grouped by tenant. Used to persist and further aggregate tenant-level analytics.
     */
    public static final String analytics_tenant_stats_minute = "analytics_tenant_stats_minute";

    /**
     * One-minute aggregated request metrics grouped by product. Used to persist and further aggregate product-level analytics.
     */
    public static final String analytics_product_stats_minute = "analytics_product_stats_minute";

    /**
     * One-minute aggregated request metrics grouped by service. Used to persist and further aggregate service-level analytics.
     */
    public static final String analytics_service_stats_minute = "analytics_service_stats_minute";

    /**
     * One-minute aggregated request metrics grouped by endpoint. Used to persist and further aggregate endpoint-level analytics.
     */
    public static final String analytics_endpoint_stats_minute = "analytics_endpoint_stats_minute";

    /**
     * Hourly aggregated tenant metrics derived from minute-level statistics. Used for hourly tenant analytics and Cassandra persistence.
     */
    public static final String analytics_tenant_stats_hour = "analytics_tenant_stats_hour";

    /**
     * Hourly aggregated product metrics derived from minute-level statistics. Used for hourly product analytics and Cassandra persistence.
     */
    public static final String analytics_product_stats_hour = "analytics_product_stats_hour";

    /**
     * Hourly aggregated service metrics derived from minute-level statistics. Used for hourly service analytics and Cassandra persistence.
     */
    public static final String analytics_service_stats_hour = "analytics_service_stats_hour";

    /**
     * Hourly aggregated endpoint metrics derived from minute-level statistics. Used for hourly endpoint analytics and Cassandra
     * persistence.
     */
    public static final String analytics_endpoint_stats_hour = "analytics_endpoint_stats_hour";

    /**
     * Daily aggregated tenant metrics derived from hourly statistics. Used for daily tenant analytics and Cassandra persistence.
     */
    public static final String analytics_tenant_stats_day = "analytics_tenant_stats_day";

    /**
     * Daily aggregated product metrics derived from hourly statistics. Used for daily product analytics and Cassandra persistence.
     */
    public static final String analytics_product_stats_day = "analytics_product_stats_day";

    /**
     * Daily aggregated service metrics derived from hourly statistics. Used for daily service analytics and Cassandra persistence.
     */
    public static final String analytics_service_stats_day = "analytics_service_stats_day";

    /**
     * Daily aggregated endpoint metrics derived from hourly statistics. Used for daily endpoint analytics and Cassandra persistence.
     */
    public static final String analytics_endpoint_stats_day = "analytics_endpoint_stats_day";

    public static List<String> getAllTables() {
        return List.of(request_logs, request_logs_lookup_by_id, analytics_tenant_stats_minute, analytics_product_stats_minute,
            analytics_service_stats_minute, analytics_endpoint_stats_minute, analytics_tenant_stats_hour, analytics_product_stats_hour,
            analytics_service_stats_hour, analytics_endpoint_stats_hour, analytics_tenant_stats_day, analytics_product_stats_day,
            analytics_service_stats_day, analytics_endpoint_stats_day);
    }
}
