package com.sentinel.api.monitor.controller;

import com.sentinel.api.monitor.dto.KafkaMonitor;
import com.sentinel.api.monitor.dto.SystemMonitor;
import com.sentinel.api.monitor.service.KafkaMonitorService;
import com.sentinel.api.monitor.service.SystemMonitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/system-monitor")
@RequiredArgsConstructor
public class SystemMonitorController {

    private final SystemMonitorService systemMonitorService;
    private final KafkaMonitorService kafkaMonitorService;

    @GetMapping
    public SystemMonitor.MonitorResponse getSystemMonitors() {
        return systemMonitorService.getSystemMonitors();
    }

    @GetMapping("/kafka-monitor")
    public KafkaMonitor.MonitorResponse getKafkaMonitor() {
        return kafkaMonitorService.getKafkaMonitors();
    }

}
