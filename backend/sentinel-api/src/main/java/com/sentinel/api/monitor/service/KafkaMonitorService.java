package com.sentinel.api.monitor.service;

import com.sentinel.api.monitor.dto.KafkaMonitor;

public interface KafkaMonitorService {
    KafkaMonitor.MonitorResponse getKafkaMonitors();
}
