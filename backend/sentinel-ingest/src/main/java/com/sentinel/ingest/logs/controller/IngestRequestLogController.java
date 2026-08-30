package com.sentinel.ingest.logs.controller;

import com.sentinel.ingest.logs.dto.request.IngestLogRequest;
import com.sentinel.ingest.logs.service.IngestRequestLogService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/v1/ingest")
@AllArgsConstructor
public class IngestRequestLogController {

    private final IngestRequestLogService ingestRequestLogService;

    @PostMapping
    ResponseEntity<Void> ingest(@Valid @RequestBody IngestLogRequest request) {
        ingestRequestLogService.ingest(request);
        return ResponseEntity.ok().build();
    }
}
