package com.sentinel.loadEngine.dataGenerator.controller;

import com.sentinel.loadEngine.dataGenerator.dto.request.LoadTestDataGenerateRequest;
import com.sentinel.loadEngine.dataGenerator.dto.response.LoadTestResponse;
import com.sentinel.loadEngine.dataGenerator.dto.response.LoadTestDataGenerationResponse;
import com.sentinel.loadEngine.dataGenerator.dto.response.LoadTestRelatedEntities;
import com.sentinel.loadEngine.dataGenerator.service.LoadTestService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/v1/load-engine")
@AllArgsConstructor
public class LoadTestController {

    private final LoadTestService loadTestService;

    @PostMapping
    ResponseEntity<LoadTestDataGenerationResponse> generate( @RequestBody LoadTestDataGenerateRequest request) {
        return ResponseEntity.ok(loadTestService.generate(request));
    }

    @GetMapping("/{loadTestId}/entities")
    ResponseEntity<LoadTestRelatedEntities> getRelatedEntities( @PathVariable UUID loadTestId) {
        return ResponseEntity.ok(loadTestService.getRelatedEntitiesByLoadTestId(loadTestId));
    }

    @GetMapping("/{loadTestId}")
    ResponseEntity<LoadTestResponse> getById( @PathVariable UUID loadTestId) {
        return ResponseEntity.ok(loadTestService.getById(loadTestId));
    }

    @DeleteMapping("/{loadTestId}")
    ResponseEntity<Boolean> deleteById(@PathVariable UUID loadTestId) {
        return ResponseEntity.ok(loadTestService.deleteById(loadTestId));
    }
}
