package com.sentinel.api.monitor.controller;

import com.sentinel.api.monitor.dto.response.SystemMonitor;
import com.sentinel.api.monitor.service.SystemMonitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/system")
@RequiredArgsConstructor
public class SystemMonitorController {

    private final SystemMonitorService systemMonitorService;

    @GetMapping
    public SystemMonitor.MonitorResponse getSystemMonitors() {
        return systemMonitorService.getSystemMonitors();
    }

}
