package com.sentinel.loadEngine.engine;

import com.sentinel.loadEngine.loadTestData.entity.LoadTestData;
import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLog;
import com.sentinel.loadEngine.loadTestRun.service.LoadTestRunService;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.distribution.HistogramSnapshot;
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

    public record LoadExecutionResult(long totalRequests, long totalErrors) {
    }

    private final AtomicBoolean isRunning = new AtomicBoolean(false);
    private final AtomicBoolean isCanceled = new AtomicBoolean(false);

    /**
     * Successfully completed requests.
     */
    private final AtomicLong totalRequests = new AtomicLong(0);

    /**
     * Requests that failed.
     */
    private final AtomicLong totalErrors = new AtomicLong(0);

    /**
     * Tasks submitted to the executor.
     */
    private final AtomicLong totalSubmitted = new AtomicLong(0);

    /**
     * Requests currently executing.
     */
    private final AtomicLong activeRequests = new AtomicLong(0);

    private final IngestServiceClient ingestServiceClient;
    private final LoadTestRunService loadTestRunService;
    private final MeterRegistry meterRegistry;

    public void cancelRun() {
        isCanceled.set(true);
    }

    public LoadExecutionResult execute(LoadTestData loadTestData, LoadTestRunLog runLog) {
        if (!isRunning.compareAndSet(false, true)) {
            throw new RuntimeException("The load test run is already running");
        }

        Timer ingestTimer =
            Timer.builder("sentinel.ingest.http").description("HTTP latency for ingest requests").tag("runId", runLog.getId().toString())
                .publishPercentiles(0.5, 0.95, 0.99).publishPercentileHistogram().register(meterRegistry);

        resetCounters();

        IngestRequestDataGenerator generator = new IngestRequestDataGenerator(runLog.getConfig(), loadTestData.getTestData());

        int targetRps = runLog.getConfig().getTargetRps();
        int concurrency = runLog.getConfig().getConcurrency();
        int durationSeconds = runLog.getConfig().getDurationSeconds();

        Semaphore concurrencyLimiter = new Semaphore(concurrency);

        try (ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor()) {

            Instant endTime = Instant.now().plus(Duration.ofSeconds(durationSeconds));

            /*
             * ---------------------------------------------------------
             * Load generation phase
             * ---------------------------------------------------------
             */
            while (Instant.now().isBefore(endTime) && !Thread.currentThread().isInterrupted() && !isCanceled.get()) {

                long tickStart = System.currentTimeMillis();

                /*
                 * Submit targetRps requests for this one-second window.
                 */
                for (int i = 0; i < targetRps; i++) {

                    totalSubmitted.incrementAndGet();

                    executorService.submit(() -> executeRequest(generator, concurrencyLimiter, ingestTimer));
                }

                /*
                 * Maintain approximately targetRps.
                 */
                long elapsed = System.currentTimeMillis() - tickStart;

                long sleepTime = 1000 - elapsed;

                if (sleepTime > 0) {
                    Thread.sleep(sleepTime);
                }

                /*
                 * Live progress update.
                 */
                logProgress(runLog);
            }

            log.info("Load generation finished");

            /*
             * ---------------------------------------------------------
             * Drain phase
             * ---------------------------------------------------------
             *
             * No more tasks will be submitted.
             *
             * shutdown() tells the executor to finish all already
             * submitted tasks but reject new tasks.
             */
            executorService.shutdown();

            log.info("Waiting for submitted requests to complete: submitted={}", totalSubmitted.get());

            /*
             * Wait one second at a time so we can continue printing
             * live drain statistics.
             */
            while (!executorService.awaitTermination(1, TimeUnit.SECONDS)) {

                logProgress(runLog);
            }

            /*
             * Print the final state as well.
             */
            logProgress(runLog);

            log.info("Load test completed: totalRequests={}, totalErrors={}", totalRequests.get(), totalErrors.get());

            logIngestLatency(ingestTimer);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            log.warn("Load test execution interrupted");

        } finally {

            /*
             * Persist the latest state.
             */
            loadTestRunService.updateNoOfRequests(runLog.getId(), totalRequests.get(), totalErrors.get());

            isRunning.set(false);
            isCanceled.set(false);
        }

        return new LoadExecutionResult(totalRequests.get(), totalErrors.get());
    }

    private void executeRequest(IngestRequestDataGenerator generator, Semaphore concurrencyLimiter, Timer ingestTimer) {
        boolean acquired = false;

        try {
            /*
             * Wait until a concurrency slot becomes available.
             */
            concurrencyLimiter.acquire();
            acquired = true;

            /*
             * This request is now actually executing.
             */
            activeRequests.incrementAndGet();

            /*
             * Execute the HTTP request.
             */
            ingestTimer.record(() -> ingestServiceClient.sendRequest(generator.getRequest()));

            /*
             * Only count it as completed after sendRequest()
             * successfully returns.
             */
            totalRequests.incrementAndGet();

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            totalErrors.incrementAndGet();

        } catch (Exception e) {

            totalErrors.incrementAndGet();

            log.error("Error executing ingest request", e);

        } finally {

            /*
             * The request is no longer active.
             */
            if (acquired) {
                activeRequests.decrementAndGet();
                concurrencyLimiter.release();
            }
        }
    }

    private void logProgress(LoadTestRunLog runLog) {
        long submitted = totalSubmitted.get();
        long completed = totalRequests.get();
        long errors = totalErrors.get();
        long active = activeRequests.get();

        /*
         * Everything that has been submitted but is neither:
         *
         *   completed
         *   failed
         *   currently active
         *
         * is waiting for a concurrency permit.
         */
        long pending = Math.max(0, submitted - completed - errors - active);

        /*
         * Live DB update.
         */
        loadTestRunService.updateNoOfRequests(runLog.getId(), completed, errors);

        log.info("submitted={}, active={}, completed={}, errors={}, pending={}", submitted, active, completed, errors, pending);
    }

    private void logIngestLatency(Timer ingestTimer) {
        HistogramSnapshot snapshot = ingestTimer.takeSnapshot();

        log.info("Ingest latency: count={}, p50={}ms, p95={}ms, p99={}ms, max={}ms", snapshot.count(), percentile(snapshot, 0.50),
            percentile(snapshot, 0.95), percentile(snapshot, 0.99), snapshot.max(TimeUnit.MILLISECONDS));
    }

    private double percentile(HistogramSnapshot snapshot, double target) {
        return Arrays.stream(snapshot.percentileValues()).filter(value -> value.percentile() == target)
            .mapToDouble(value -> value.value(TimeUnit.MILLISECONDS)).findFirst().orElse(Double.NaN);
    }

    private void resetCounters() {
        isCanceled.set(false);

        totalRequests.set(0);
        totalErrors.set(0);
        totalSubmitted.set(0);
        activeRequests.set(0);
    }
}
