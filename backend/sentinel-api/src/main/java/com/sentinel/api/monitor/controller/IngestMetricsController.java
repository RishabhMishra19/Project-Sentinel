package com.sentinel.api.monitor.controller;

import com.sentinel.api.monitor.dto.IngestApplicationMetricsResponse;
import com.sentinel.api.monitor.dto.IngestKafkaMetricsResponse;
import com.sentinel.api.monitor.service.IngestMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/admin/monitor/ingest")
@RequiredArgsConstructor
public class IngestMetricsController {

    private final IngestMetricService ingestMetricService;

    @GetMapping("/application")
    public IngestApplicationMetricsResponse getIngestApplicationMetrics(@RequestParam Instant from, @RequestParam Instant to) {
        return ingestMetricService.getIngestApplicationMetrics(from, to);
    }

    @GetMapping("/kafka")
    public IngestKafkaMetricsResponse getIngestKafkaMetrics(@RequestParam String topic, @RequestParam Instant from, @RequestParam Instant to) {
        return ingestMetricService.getIngestKafkaMetrics(topic, from, to);
    }

}
