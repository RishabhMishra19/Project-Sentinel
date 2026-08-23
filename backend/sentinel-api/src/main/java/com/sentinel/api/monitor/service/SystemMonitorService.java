package com.sentinel.api.monitor.service;

import com.sentinel.api.monitor.dto.response.SystemMonitor;

public interface SystemMonitorService {

    SystemMonitor.MonitorResponse getSystemMonitors();

}
