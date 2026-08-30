package com.sentinel.common.cassandra;

import lombok.RequiredArgsConstructor;
import org.springframework.data.cassandra.core.AsyncCassandraTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Semaphore;

@Component
@RequiredArgsConstructor
public class CassandraBatchInsertUtil {

    public record BatchInsertResult(long total, long succeeded, long failed, long latencyMs) {
    }

    private static final int MAX_CONCURRENT_WRITES = 40;

    private final AsyncCassandraTemplate asyncCassandraTemplate;
    private final Semaphore writeLimiter = new Semaphore(MAX_CONCURRENT_WRITES);

    public <T> CompletableFuture<BatchInsertResult> insertAsync(List<T> entities) {
        if (entities == null || entities.isEmpty()) {
            return CompletableFuture.completedFuture(new BatchInsertResult(0, 0, 0, 0));
        }
        Instant startedAt = Instant.now();
        List<CompletableFuture<Boolean>> futures = new ArrayList<>(entities.size());
        for (T entity : entities) {
            try {
                writeLimiter.acquire();
                CompletableFuture<Boolean> future = asyncCassandraTemplate.insert(entity).handle((result, error) -> error == null);
                future.whenComplete((result, error) -> writeLimiter.release());
                futures.add(future);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return CompletableFuture.failedFuture(new RuntimeException("Interrupted while waiting for Cassandra write slot", e));
            }
        }

        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).thenApply(ignored -> {
            int total = futures.size();
            int succeeded = (int) futures.stream().filter(CompletableFuture::join).count();
            int failed = total - succeeded;
            long latencyMs = Duration.between(startedAt, Instant.now()).toMillis();
            return new BatchInsertResult(total, succeeded, failed, latencyMs);
        });
    }

}
