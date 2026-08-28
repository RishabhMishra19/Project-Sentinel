package com.sentinel.common.cassandra;

import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.atomic.AtomicLong;

@Slf4j
public class CassandraInsertMetrics {

    private final AtomicLong totalRequest = new AtomicLong();
    private final AtomicLong totalSuccess = new AtomicLong();
    private final AtomicLong latency = new AtomicLong();

    public void record(long total, long success, long latency) {
        this.totalRequest.addAndGet(total);
        this.totalSuccess.addAndGet(success);
        this.latency.addAndGet(latency);
        log.info(this.toString());
    }

    public String toString() {
        return String.format("Cassandra Write: total=%s, success=%s, failure=%s, latency=%.2f ms", this.totalRequest.get(),
            this.totalSuccess.get(),
            this.totalRequest.get() - this.totalSuccess.get(), (double) this.latency.get() / this.totalRequest.get());
    }
}
