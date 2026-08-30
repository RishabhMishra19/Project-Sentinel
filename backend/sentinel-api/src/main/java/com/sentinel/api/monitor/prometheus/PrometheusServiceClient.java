package com.sentinel.api.monitor.prometheus;

import com.sentinel.api.monitor.dto.MetricSeries;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PrometheusServiceClient {

    @Value("${prometheus.url}")
    private String prometheusUrl;

    private final ObjectMapper objectMapper;

    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();

    public List<MetricSeries> queryRange(String query, Instant start, Instant end, int stepSeconds) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("Start and end must not be null");
        }

        if (!start.isBefore(end)) {
            throw new IllegalArgumentException("Start must be before end");
        }

        if (stepSeconds <= 0) {
            throw new IllegalArgumentException("Step must be greater than 0");
        }

        try {
            URI uri = buildQueryRangeUri(query, start, end, stepSeconds);

            HttpRequest request = HttpRequest.newBuilder().uri(uri).header("Accept", "application/json").GET().build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {

                throw new RuntimeException("Prometheus returned HTTP " + response.statusCode() + ": " + response.body());
            }

            return parseRangeResponse(response.body());

        } catch (Exception e) {
            throw new RuntimeException("Failed to query Prometheus", e);
        }
    }

    private URI buildQueryRangeUri(String query, Instant start, Instant end, int stepSeconds) {
        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);

        String url = prometheusUrl + "/api/v1/query_range" + "?query=" + encodedQuery + "&start=" + start.getEpochSecond() + "&end=" +
            end.getEpochSecond() + "&step=" + stepSeconds;

        return URI.create(url);
    }

    private List<MetricSeries> parseRangeResponse(String body) throws Exception {

        JsonNode root = objectMapper.readTree(body);

        String status = root.path("status").asText();

        if (!"success".equals(status)) {
            throw new RuntimeException("Prometheus query failed: " + body);
        }

        List<MetricSeries> seriesList = new ArrayList<>();

        JsonNode results = root.path("data").path("result");

        if (!results.isArray()) {
            return seriesList;
        }

        for (JsonNode series : results) {

            JsonNode metric = series.path("metric");
            String name = metric.has("name")
                ? metric.path("name").asString()
                : metric.path("__name__").asString();

            List<MetricSeries.MetricPoint> data = new ArrayList<>();

            JsonNode values = series.path("values");

            if (!values.isArray()) {
                continue;
            }

            for (JsonNode value : values) {

                if (!value.isArray() || value.size() < 2) {
                    continue;
                }

                double timestamp = value.get(0).asDouble();

                String metricValueText = value.get(1).asText();

                Instant instant = Instant.ofEpochMilli((long) (timestamp * 1000));

                // Prometheus can return NaN/+Inf/-Inf
                if (isInvalidMetricValue(metricValueText)) {
                    continue;
                }

                double metricValue = Double.parseDouble(metricValueText);

                data.add(new MetricSeries.MetricPoint(instant, metricValue));
            }

            seriesList.add(new MetricSeries(name, data));
        }

        return seriesList;
    }

    private boolean isInvalidMetricValue(String value) {
        return "NaN".equals(value) || "+Inf".equals(value) || "-Inf".equals(value);
    }
}
