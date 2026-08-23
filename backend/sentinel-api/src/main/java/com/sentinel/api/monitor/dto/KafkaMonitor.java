package com.sentinel.api.monitor.dto;

import java.util.List;

public final class KafkaMonitor {

    public static record Topic(String name, int partitions) {}

    public static record MonitorResponse(String status, long brokerCount, List<Topic> topics) {}

}
