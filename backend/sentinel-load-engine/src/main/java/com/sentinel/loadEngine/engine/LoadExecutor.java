package com.sentinel.loadEngine.engine;

import com.sentinel.loadEngine.loadTestData.entity.LoadTestData;
import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLog;
import com.sentinel.loadEngine.loadTestRun.service.LoadTestRunService;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.distribution.HistogramSnapshot;
import io.micrometer.core.instrument.distribution.ValueAtPercentile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Component
@RequiredArgsConstructor
public class LoadExecutor {

    public record LoadExecutionResult(
        long totalRequests,
        long totalErrors
    ) {
    }

    private final AtomicBoolean isRunning = new AtomicBoolean(false);
    private final AtomicBoolean isCanceled = new AtomicBoolean(false);
    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong totalErrors = new AtomicLong(0);
    private final AtomicLong totalSubmitted = new AtomicLong(0);
    private final AtomicLong activeRequests = new AtomicLong(0);

    private final IngestServiceClient ingestServiceClient;
    private final LoadTestRunService loadTestRunService;

    public void cancelRun() {
        isCanceled.set(true);
    }

    public LoadExecutionResult execute(LoadTestData loadTestData, LoadTestRunLog runLog) {
        if (!isRunning.compareAndSet(false, true)) {
            throw new RuntimeException("The load test run is already running");
        }

        isCanceled.set(false);
        totalRequests.set(0);
        totalErrors.set(0);

        IngestRequestDataGenerator generator = new IngestRequestDataGenerator(runLog.getConfig(), loadTestData.getTestData());

        int targetRps = runLog.getConfig().getTargetRps();
        int concurrency = runLog.getConfig().getConcurrency();
        int durationSeconds = runLog.getConfig().getDurationSeconds();

        Semaphore concurrencyLimiter = new Semaphore(concurrency);

        try (ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor()) {

            Instant endTime = Instant.now().plus(Duration.ofSeconds(durationSeconds));

            while (Instant.now().isBefore(endTime) && !Thread.currentThread().isInterrupted() && !isCanceled.get()) {


                long tickStart = System.currentTimeMillis();

                for (int i = 0; i < targetRps; i++) {
                    totalSubmitted.incrementAndGet();
                    executorService.submit(() -> executeRequest(generator, concurrencyLimiter));
                }

                long elapsed = System.currentTimeMillis() - tickStart;
                long sleepTime = 1000 - elapsed;

                if (sleepTime > 0) {
                    Thread.sleep(sleepTime);
                }
                // Live progress update
                loadTestRunService.updateNoOfRequests(runLog.getId(), totalRequests.get(), totalErrors.get());
                long submitted = totalSubmitted.get();
                long started = totalRequests.get();
                long errors = totalErrors.get();

                long submitted = totalSubmitted.get();
                long completed = totalCompleted.get();
                long errors = totalErrors.get();
                long active = activeRequests.get();

                long pending = submitted - completed - errors - active;

                log.info(
                    "submitted={}, started={}, errors={}, waiting={}, waiting for permit={}",
                    submitted,
                    started,
                    errors,
                    submitted - started,
                    concurrencyLimiter.getQueueLength()
                );
            }

            log.info("Load generation finished");

            while (concurrencyLimiter.getQueueLength() > 0) {

                log.info(
                    "Draining: started={}, errors={}, waiting={}",
                    totalRequests.get(),
                    totalErrors.get(),
                    concurrencyLimiter.getQueueLength()
                );

                Thread.sleep(1000);
            }

            log.info(
                "completed total requests: {}, total errors: {}",
                totalRequests.get(),
                totalErrors.get()
            );

            this.logIngestLatency();

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();

        } finally {
            loadTestRunService.updateNoOfRequests(
                runLog.getId(),
                totalRequests.get(),
                totalErrors.get()
            );
            isRunning.set(false);
            isCanceled.set(false);
        }
        return new LoadExecutionResult(
            totalRequests.get(),
            totalErrors.get()
        );
    }

    private void executeRequest(IngestRequestDataGenerator generator, Semaphore concurrencyLimiter) {
        boolean acquired = false;

        try {
            concurrencyLimiter.acquire();
            acquired = true;
            activeRequests.incrementAndGet();

            totalRequests.incrementAndGet();

            ingestServiceClient.sendRequest(generator.getRequest());

        } catch (Exception e) {
            totalErrors.incrementAndGet();
            log.error("Error executing ingest request", e);

        } finally {
            if (acquired) {
                concurrencyLimiter.release();
            }
        }
    }

    private void logIngestLatency() {
        HistogramSnapshot snapshot = ingestServiceClient.getIngestTimer().takeSnapshot();

        log.info(
            "Ingest latency: count={}, p50={}ms, p95={}ms, p99={}ms, max={}ms",
            snapshot.count(),
            percentile(snapshot, 0.50),
            percentile(snapshot, 0.95),
            percentile(snapshot, 0.99),
            snapshot.max(TimeUnit.MILLISECONDS)
        );
    }

    private double percentile(HistogramSnapshot snapshot, double target) {
        return Arrays.stream(snapshot.percentileValues())
            .filter(value -> value.percentile() == target)
            .mapToDouble(value -> value.value(TimeUnit.MILLISECONDS))
            .findFirst()
            .orElse(Double.NaN);
    }
}
