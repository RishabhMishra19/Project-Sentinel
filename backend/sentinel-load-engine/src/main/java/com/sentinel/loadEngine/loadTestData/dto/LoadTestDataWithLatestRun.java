package com.sentinel.loadEngine.loadTestData.dto;

import com.sentinel.loadEngine.loadTestData.entity.LoadTestData;
import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLog;

public record LoadTestDataWithLatestRun(LoadTestData loadTestData, LoadTestRunLog latestRun) {
}
