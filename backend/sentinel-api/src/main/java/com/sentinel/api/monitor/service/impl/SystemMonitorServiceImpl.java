package com.sentinel.api.monitor.service.impl;

import com.sentinel.api.monitor.SystemMonitorProperties;
import com.sentinel.api.monitor.dto.SystemMonitor.*;
import com.sentinel.api.monitor.service.SystemMonitorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

@Slf4j
@Service
@RequiredArgsConstructor
public class SystemMonitorServiceImpl implements SystemMonitorService {

    private final RestClient restClient;
    private final SystemMonitorProperties systemMonitorProperties;

    @Override
    public MonitorResponse getSystemMonitors() {
        return new MonitorResponse(
                getServiceStatus("sentinel-api", systemMonitorProperties.serverUrl()),
                getServiceStatus("sentinel-ingest", systemMonitorProperties.ingestUrl()),
                getServiceStatus("sentinel-processor", systemMonitorProperties.processorUrl())
        );
    }

    private ServiceResponse getServiceStatus(String serviceName, String baseUrl) {
        try {
            ActuatorHealthResponse health = getHealth(baseUrl);
            return new ServiceResponse(
                    serviceName,
                    health.status(),
                    getCpuMetrics(baseUrl),
                    getMemoryMetrics(baseUrl),
                    getThreadsMetrics(baseUrl),
                    getHTTPRequestMetrics(baseUrl),
                    getGCMetrics(baseUrl),
                    getDiskMetrics(baseUrl),
                    getDBConnectionMetrics(baseUrl)
            );
        } catch (Exception e) {
            log.error("Failed to monitor {}", serviceName, e);
            return new ServiceResponse(serviceName, "DOWN", null, null, null, null, null, null, null);
        }
    }

    private ActuatorHealthResponse getHealth(String baseUrl) {
        return restClient.get()
                .uri(baseUrl + "/actuator/health")
                .retrieve()
                .body(ActuatorHealthResponse.class);
    }

    private CPU getCpuMetrics(String baseUrl) {
        try {
            return new CPU(
                    getMetricValue(baseUrl, "system.cpu.usage", "VALUE"),
                    (int) getMetricValue(baseUrl, "system.cpu.count", "VALUE")
            );
        } catch (Exception e) {
            log.error("Failed to fetch CPU metrics from {}", baseUrl, e);
            return new CPU(0, 0);
        }
    }

    private Memory getMemoryMetrics(String baseUrl) {
        try {
            return new Memory(
                    (long) getMetricValue(baseUrl, "jvm.memory.used", "VALUE", "area:heap"),
                    (long) getMetricValue(baseUrl, "jvm.memory.max", "VALUE", "area:heap"),
                    (long) getMetricValue(baseUrl, "jvm.memory.used", "VALUE", "area:nonheap")
            );
        } catch (Exception e) {
            log.error("Failed to fetch memory metrics from {}", baseUrl, e);
            return new Memory(0, 0, 0);
        }
    }

    private Threads getThreadsMetrics(String baseUrl) {
        try {
            return new Threads(
                    (long) getMetricValue(baseUrl, "jvm.threads.live", "VALUE"),
                    (long) getMetricValue(baseUrl, "jvm.threads.peak", "VALUE"),
                    (long) getMetricValue(baseUrl, "jvm.threads.daemon", "VALUE"),
                    (long) getMetricValue(baseUrl, "jvm.threads.started", "VALUE"),
                    getThreadStates(baseUrl)
            );
        } catch (Exception e) {
            log.error("Failed to fetch thread metrics from {}", baseUrl, e);
            return new Threads(0, 0, 0, 0, new ThreadStates(0, 0, 0, 0, 0, 0));
        }
    }

    private ThreadStates getThreadStates(String baseUrl) {
        return new ThreadStates(
                (long) getMetricValue(baseUrl, "jvm.threads.states", "VALUE", "state:runnable"),
                (long) getMetricValue(baseUrl, "jvm.threads.states", "VALUE", "state:blocked"),
                (long) getMetricValue(baseUrl, "jvm.threads.states", "VALUE", "state:waiting"),
                (long) getMetricValue(baseUrl, "jvm.threads.states", "VALUE", "state:timed-waiting"),
                (long) getMetricValue(baseUrl, "jvm.threads.states", "VALUE", "state:new"),
                (long) getMetricValue(baseUrl, "jvm.threads.states", "VALUE", "state:terminated")
        );
    }

    private HTTPRequest getHTTPRequestMetrics(String baseUrl) {
        try {
            long requests = (long) getMetricValue(baseUrl, "http.server.requests", "COUNT");
            long errors = getErrorCount(baseUrl);
            return new HTTPRequest(requests, errors);
        } catch (Exception e) {
            log.error("Failed to fetch HTTP request metrics from {}", baseUrl, e);
            return new HTTPRequest(0, 0);
        }
    }

    private long getErrorCount(String baseUrl) {
        try {
            return (long) getMetricValue(baseUrl, "http.server.requests", "COUNT", "outcome:SERVER_ERROR");
        } catch (HttpClientErrorException.NotFound e) {
            return 0;
        }
    }

    private GC getGCMetrics(String baseUrl) {
        try {
            return new GC(
                    (long) getMetricValue(baseUrl, "jvm.gc.memory.allocated", "VALUE"),
                    (long) getMetricValue(baseUrl, "jvm.gc.memory.promoted", "VALUE"),
                    getMetricValue(baseUrl, "jvm.gc.overhead", "VALUE")
            );
        } catch (Exception e) {
            log.error("Failed to fetch GC metrics from {}", baseUrl, e);
            return new GC(0, 0, 0);
        }
    }

    private Disk getDiskMetrics(String baseUrl) {
        try {
            long free = (long) getMetricValue(baseUrl, "disk.free", "VALUE");
            long total = (long) getMetricValue(baseUrl, "disk.total", "VALUE");
            double usage = total > 0 ? (double) (total - free) / total : 0;
            return new Disk(free, total, usage);
        } catch (Exception e) {
            log.error("Failed to fetch disk metrics from {}", baseUrl, e);
            return new Disk(0, 0, 0);
        }
    }

    private DBConnection getDBConnectionMetrics(String baseUrl) {
        try {
            return new DBConnection(
                    (long) getMetricValue(baseUrl, "hikaricp.connections.active", "VALUE"),
                    (long) getMetricValue(baseUrl, "hikaricp.connections.idle", "VALUE"),
                    (long) getMetricValue(baseUrl, "hikaricp.connections.max", "VALUE"),
                    (long) getMetricValue(baseUrl, "hikaricp.connections.min", "VALUE")
            );
        } catch (Exception e) {
            log.error("Failed to fetch database metrics from {}", baseUrl, e);
            return new DBConnection(0, 0, 0, 0);
        }
    }

    private double getMetricValue(String baseUrl, String metric, String statistic, String... tags) {
        return getMetricValue(getMetric(baseUrl, metric, tags), statistic);
    }

    private ActuatorMetricResponse getMetric(String baseUrl, String metric, String... tags) {
        String url = baseUrl + "/actuator/metrics/" + metric;
        if (tags.length > 0) {
            url += "?tag=" + String.join("&tag=", tags);
        }
        return restClient.get()
                .uri(url)
                .retrieve()
                .body(ActuatorMetricResponse.class);
    }

    private double getMetricValue(ActuatorMetricResponse metric, String statistic) {
        if (metric == null || metric.measurements() == null) {
            return 0;
        }
        return metric.measurements()
                .stream()
                .filter(m -> statistic.equals(m.statistic()))
                .mapToDouble(Measurement::value)
                .findFirst()
                .orElse(0);
    }

}