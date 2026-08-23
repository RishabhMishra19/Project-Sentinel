package com.sentinel.api.monitor.dto.response;

import java.util.List;

public final class SystemMonitor {

    public static record DBConnection(long active, long idle, long max, long min) {}

    public static record Disk(long free, long total, double usage) {}

    public static record GC(long allocated, long promoted, double overhead) {}

    public static record HTTPRequest(long requests, long errors) {}

    public static record ThreadStates(
            long runnable, long blocked, long waiting, long timedWaiting, long newThreads, long terminated
    ) {}

    public static record Threads(long live, long peak, long daemon, long started, ThreadStates states) {}

    public static record CPU(double usage, int availableProcessors) {}

    public static record Memory(long heapUsed, long heapMax, long nonHeapUsed) {}

    public static record ServiceResponse(String serviceName, String status, CPU cpu, Memory memory, Threads threads, HTTPRequest httpRequest, GC gc, Disk disk, DBConnection dbConnection) {}

    public static record MonitorResponse(ServiceResponse server, ServiceResponse ingest, ServiceResponse processor) {}

    public static record ActuatorHealthResponse(String status) {}

    public static record Measurement(String statistic, double value) {}

    public static record ActuatorMetricResponse(String name, List<Measurement> measurements) {}

}
