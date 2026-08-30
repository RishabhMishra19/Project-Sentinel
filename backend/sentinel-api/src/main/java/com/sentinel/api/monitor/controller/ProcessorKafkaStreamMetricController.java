package com.sentinel.api.monitor.controller;

import com.sentinel.api.monitor.dto.ProcessorKafkaStreamMetricsResponse;
import com.sentinel.api.monitor.service.ProcessorKafkaStreamMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/admin/monitor/processor/kafka-streams")
@RequiredArgsConstructor
public class ProcessorKafkaStreamMetricController {

    private final ProcessorKafkaStreamMetricService metricService;

    @GetMapping
    public ProcessorKafkaStreamMetricsResponse getMetrics(
        @RequestParam String stream,
        @RequestParam Instant from,
        @RequestParam Instant to
    ) {
        return metricService.getKafkaStreamMetrics(
            stream,
            from,
            to
        );
    }
}
