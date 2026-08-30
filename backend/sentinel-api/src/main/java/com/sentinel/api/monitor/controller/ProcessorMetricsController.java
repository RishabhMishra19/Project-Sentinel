package com.sentinel.api.monitor.controller;

import com.sentinel.api.monitor.dto.ProcessorCassandraTableMetrics;
import com.sentinel.api.monitor.dto.ProcessorKafkaListenerMetrics;
import com.sentinel.api.monitor.service.ProcessorMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/admin/monitor/processor")
@RequiredArgsConstructor
public class ProcessorMetricsController {

    private final ProcessorMetricService processorMetricService;

    @GetMapping("/listener")
    public ProcessorKafkaListenerMetrics getListenerMetrics(@RequestParam String topic, @RequestParam Instant from,
        @RequestParam Instant to) {
        return processorMetricService.getListenerMetrics(topic, from, to);
    }

    @GetMapping("/cassandra")
    public ProcessorCassandraTableMetrics getCassandraMetrics(@RequestParam String table, @RequestParam Instant from,
        @RequestParam Instant to) {
        return processorMetricService.getCassandraMetrics(table, from, to);
    }

}
