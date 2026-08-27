package com.sentinel.loadEngine.engine;

import com.sentinel.loadEngine.engine.dto.IngestRequest;
import com.sentinel.loadEngine.engine.dto.IngestResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Component
@RequiredArgsConstructor
public class IngestServiceClient {

    @Value("${sentinel.ingestion.url}")
    private String ingestionServiceUrl;

    private final ObjectMapper objectMapper;


    private final HttpClient httpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .build();


    public IngestResponse sendRequest(IngestRequest ingestRequest) {
        HttpResponse<String> response = null;
        try {
            String jsonBody = objectMapper.writeValueAsString(ingestRequest);
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ingestionServiceUrl))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();
            response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return objectMapper.readValue(response.body(), IngestResponse.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
