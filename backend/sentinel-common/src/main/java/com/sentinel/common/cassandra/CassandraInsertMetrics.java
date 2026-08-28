package com.sentinel.common.cassandra;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CassandraInsertMetrics {

    public CassandraInsertMetrics() {
        this.totalRequest = 0L;
        this.totalSuccess = 0L;
        this.totalFailure = 0L;
        this.latency = 0L;
    }

    private Long totalRequest;
    private Long totalSuccess;
    private Long totalFailure;
    private Long latency;

    public void record(long total, long success, long latency) {
        this.totalRequest += total;
        this.totalSuccess += success;
        this.totalFailure += (total - success);
        this.latency += latency;
        log.info(this.toString());
    }

    public String toString() {
        return String.format("Cassandra Write: total=%s, success=%s, failure=%s, latency=%.2f ms", this.totalRequest, this.totalSuccess,
            this.totalFailure, (double)this.latency/this.totalRequest);
    }
}
