package com.sentinel.processor.kafka;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicLong;

@Component
public class StreamMetricsCollector {

    private final AtomicLong totalMessagesProcessed = new AtomicLong(0);
    private final AtomicLong totalProcessingTimeMs = new AtomicLong(0);

    public void recordMessage(long durationMs) {
        totalMessagesProcessed.incrementAndGet();
        totalProcessingTimeMs.addAndGet(durationMs);
    }

    public long getCount() {
        return totalMessagesProcessed.get();
    }

    public double getAverageLatency() {
        long count = totalMessagesProcessed.get();
        return count == 0 ? 0.0 : (double) totalProcessingTimeMs.get() / count;
    }

}
