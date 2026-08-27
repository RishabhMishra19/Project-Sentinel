package com.sentinel.common.cassandra;

import lombok.RequiredArgsConstructor;
import org.springframework.data.cassandra.core.AsyncCassandraTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Semaphore;

@Component
@RequiredArgsConstructor
public class CassandraBatchInsertUtil {

    private static final int MAX_CONCURRENT_WRITES = 40;

    private final AsyncCassandraTemplate asyncCassandraTemplate;
    private final Semaphore writeLimiter = new Semaphore(MAX_CONCURRENT_WRITES);

    public <T> void insert(List<T> entities) {
        insertAsync(entities).join();
    }

    public <T> CompletableFuture<Void> insertAsync(List<T> entities) {
        if (entities == null || entities.isEmpty()) {
            return CompletableFuture.completedFuture(null);
        }
        List<CompletableFuture<T>> futures = new ArrayList<>(entities.size());
        for (T entity : entities) {
            try {
                writeLimiter.acquire();
                CompletableFuture<T> future = asyncCassandraTemplate.insert(entity);
                future.whenComplete((result, error) -> writeLimiter.release());
                futures.add(future);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return CompletableFuture.failedFuture(
                    new RuntimeException("Interrupted while waiting for Cassandra write slot", e)
                );
            }
        }

        return CompletableFuture.allOf(
            futures.toArray(new CompletableFuture[0])
        );
    }

}
