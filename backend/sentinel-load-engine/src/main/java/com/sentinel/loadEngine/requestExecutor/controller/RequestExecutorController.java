package com.sentinel.loadEngine.requestExecutor.controller;

import com.sentinel.loadEngine.requestExecutor.dto.request.GenerateLoadTestDataRequest;
import com.sentinel.loadEngine.requestExecutor.dto.request.RunLoadTestRequest;
import com.sentinel.loadEngine.requestExecutor.dto.response.LoadTestResponse;
import com.sentinel.loadEngine.requestExecutor.service.RequestExecutorService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/load-engine")
@AllArgsConstructor
public class RequestExecutorController {

    private final RequestExecutorService requestExecutorService;

    @GetMapping("/data")
    ResponseEntity<List<LoadTestResponse>> generate() {
        return ResponseEntity.ok(requestExecutorService.getLoadTestList());
    }

    @PostMapping("/data")
    ResponseEntity<UUID> generate(@Valid @RequestBody GenerateLoadTestDataRequest request) {
        return ResponseEntity.ok(requestExecutorService.generateLoadTestData(request));
    }

    @GetMapping("/data/{loadTestDataId}")
    ResponseEntity<LoadTestResponse> getById(@PathVariable UUID loadTestDataId) {
        return ResponseEntity.ok(requestExecutorService.getLoadTestByDataId(loadTestDataId));
    }

    @PostMapping("/data/{loadTestDataId}/start")
    ResponseEntity<LoadTestResponse> start(@PathVariable UUID loadTestDataId, @Valid @RequestBody RunLoadTestRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(requestExecutorService.startLoadTest(loadTestDataId, request));
    }

    @PostMapping("/data/{loadTestDataId}/stop")
    ResponseEntity<LoadTestResponse> stop(@PathVariable UUID loadTestDataId) {
        return ResponseEntity.ok(requestExecutorService.stopLoadTest(loadTestDataId));
    }

    @DeleteMapping("/data/{loadTestDataId}")
    ResponseEntity<Boolean> deleteData(@PathVariable UUID loadTestDataId) {
        return ResponseEntity.ok(requestExecutorService.deleteLoadTestData(loadTestDataId));
    }

}
