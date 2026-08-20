package com.sentinel.ingest.logs.controller;

import com.sentinel.ingest.logs.dto.request.IngestLogRequest;
import com.sentinel.ingest.logs.dto.response.IngestLogResponse;
import com.sentinel.ingest.logs.service.IngestRequestLogService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/ingest")
@AllArgsConstructor
public class IngestRequestLogController {

    private final IngestRequestLogService ingestRequestLogService;

    @PostMapping
    ResponseEntity<IngestLogResponse> ingest(@Valid @RequestBody IngestLogRequest request) {
        return ResponseEntity.ok(ingestRequestLogService.ingest(request));
    }
}
