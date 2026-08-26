package com.sentinel.loadEngine.loadTestRun.service.impl;

import com.sentinel.loadEngine.loadTestData.entity.LoadTestData;
import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLog;
import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLogConfig;
import com.sentinel.loadEngine.loadTestRun.repository.LoadTestRunRepository;
import com.sentinel.loadEngine.loadTestRun.service.LoadTestRunService;
import com.sentinel.loadEngine.requestExecutor.dto.request.RunLoadTestRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LoadTestRunServiceImpl implements LoadTestRunService {

    private final LoadTestRunRepository loadTestRunRepository;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public LoadTestRunLog create(UUID loadTestDataId, RunLoadTestRequest request) {
        return loadTestRunRepository.save(LoadTestRunLog.builder()
            .loadTestData(new LoadTestData(loadTestDataId))
            .startedAt(Instant.now())
            .config(new LoadTestRunLogConfig(request))
            .build());
    }

    @Override
    public LoadTestRunLog getById(UUID id) {
        return loadTestRunRepository.findById(id).orElseThrow(() -> new RuntimeException("LoadTestRun id not found!"));
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public LoadTestRunLog markCompleted(UUID id) {
        LoadTestRunLog loadTestRunLog = this.getById(id);
        if (loadTestRunLog.getCompletedAt() != null) {
            throw new RuntimeException("Load test run already stopped");
        }
        loadTestRunLog.setCompletedAt(Instant.now());
        return loadTestRunRepository.save(loadTestRunLog);
    }

    @Override
    public LoadTestRunLog getLatestRunLogByDataId(UUID loadTestDataId) {
        return loadTestRunRepository.findLatestRunLogForDataId(loadTestDataId).orElse(null);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateNoOfRequests(UUID loadTestRunId, long totalRequests, long totalErrors) {
        LoadTestRunLog runLog =  this.getById(loadTestRunId);
        runLog.setTotalRequests(totalRequests);
        runLog.setFailedRequests(totalErrors);
        loadTestRunRepository.saveAndFlush(runLog);
    }

}
