package com.sentinel.loadEngine.engine;

import com.sentinel.common.postgresql.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.loadEngine.loadTestData.entity.LoadTestData;
import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Component
@RequiredArgsConstructor
public class LoadExecutor {

    private final AtomicBoolean isRunning = new AtomicBoolean(false);
    private final AtomicBoolean isCanceled = new AtomicBoolean(false);

    private final IngestServiceClient ingestServiceClient;
    private final ServiceApiKeyRepository serviceApiKeyRepository;

    public void cancelRun(){
        isCanceled.set(true);
    }

    public void execute(LoadTestData loadTestData, LoadTestRunLog runLog) {
        // Enforce single-test rule atomically
        if (!isRunning.compareAndSet(false, true)) {
            throw new RuntimeException("The load test run is already running");
        }

        IngestRequestDataGenerator ingestRequestDataGenerator =
            new IngestRequestDataGenerator(runLog.getConfig(), loadTestData.getTestData(), serviceApiKeyRepository);

        int targetRps = runLog.getConfig().getTargetRps();
        int durationSeconds = runLog.getConfig().getDurationSeconds();

        try (ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor()) {
            Instant endTime = Instant.now().plus(Duration.ofSeconds(durationSeconds));

            while (Instant.now().isBefore(endTime) && !Thread.currentThread().isInterrupted() && !isCanceled.get()) {
                long tickStart = System.currentTimeMillis();

                // Submit 'targetRps' requests for this 1-second interval
                for (int i = 0; i < targetRps; i++) {
                    executorService.submit(() -> {
                        try {
//                            ingestServiceClient.sendRequest(ingestRequestDataGenerator.getRequest());
                            System.out.println(ingestRequestDataGenerator.getRequest());
                        } catch (Exception e) {
                            log.error("Error executing ingest request", e);
                            // Log or handle individual request error so it doesn't crash the loop
                        }
                    });
                }

                // Pacing: Sleep for the remainder of the 1-second window
                long elapsed = System.currentTimeMillis() - tickStart;
                long sleepTime = 1000 - elapsed;
                if (sleepTime > 0) {
                    Thread.sleep(sleepTime);
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            isRunning.set(false);
            isCanceled.set(false);
        }
    }
}
