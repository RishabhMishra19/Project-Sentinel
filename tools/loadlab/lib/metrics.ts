import type { MetricsRequest, PipelineMetrics } from "./metricsTypes";

/** Parse a single Prometheus sample value for an exact metric name (ignores HELP/TYPE). */
function sampleValue(text: string, metricName: string): number | null {
  const re = new RegExp(`^${escapeRegex(metricName)}(?:\\{[^}]*\\})?\\s+([0-9.eE+-]+)\\s*$`, "m");
  const match = text.match(re);
  if (!match) {
    return null;
  }
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function avgMsFromSeconds(sum: number | null, count: number | null): number | null {
  if (sum == null || count == null || count <= 0) {
    return null;
  }
  return (sum / count) * 1000;
}

async function scrape(url: string): Promise<{ text: string } | { error: string }> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return { error: `HTTP ${res.status}` };
    }
    return { text: await res.text() };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "fetch failed" };
  }
}

function parseIngest(text: string): PipelineMetrics["ingest"] {
  const eventsPublished = sampleValue(text, "sentinel_ingest_events_published_total");
  const requests = sampleValue(text, "sentinel_ingest_requests_total");
  const publishSum = sampleValue(text, "sentinel_ingest_publish_seconds_sum");
  const publishCount = sampleValue(text, "sentinel_ingest_publish_seconds_count");
  return {
    ok: true,
    error: null,
    eventsPublished,
    requests,
    avgPublishMs: avgMsFromSeconds(publishSum, publishCount),
  };
}

function parseWorker(text: string): PipelineMetrics["worker"] {
  const eventsProcessed = sampleValue(text, "sentinel_worker_events_processed_total");
  const batchesProcessed = sampleValue(text, "sentinel_worker_batches_processed_total");
  const batchesFailed = sampleValue(text, "sentinel_worker_batches_failed_total");
  const batchSizeSum = sampleValue(text, "sentinel_worker_batch_size_sum");
  const batchSizeCount = sampleValue(text, "sentinel_worker_batch_size_count");
  const batchTimeSum = sampleValue(text, "sentinel_worker_batch_process_seconds_sum");
  const batchTimeCount = sampleValue(text, "sentinel_worker_batch_process_seconds_count");
  const avgBatchSize =
    batchSizeSum != null && batchSizeCount != null && batchSizeCount > 0
      ? batchSizeSum / batchSizeCount
      : null;
  const avgPerEventMs =
    batchTimeSum != null && eventsProcessed != null && eventsProcessed > 0
      ? (batchTimeSum / eventsProcessed) * 1000
      : null;
  return {
    ok: true,
    error: null,
    eventsProcessed,
    batchesProcessed,
    batchesFailed,
    avgBatchSize,
    avgBatchMs: avgMsFromSeconds(batchTimeSum, batchTimeCount),
    avgPerEventMs,
  };
}

function unreachableIngest(error: string): PipelineMetrics["ingest"] {
  return {
    ok: false,
    error,
    eventsPublished: null,
    requests: null,
    avgPublishMs: null,
  };
}

function unreachableWorker(error: string): PipelineMetrics["worker"] {
  return {
    ok: false,
    error,
    eventsProcessed: null,
    batchesProcessed: null,
    batchesFailed: null,
    avgBatchSize: null,
    avgBatchMs: null,
    avgPerEventMs: null,
  };
}

export async function fetchPipelineMetrics(input: MetricsRequest): Promise<PipelineMetrics> {
  const ingestBase = input.ingestUrl.replace(/\/$/, "");
  const workerBase = input.workerUrl.replace(/\/$/, "");

  const [ingestScrape, workerScrape] = await Promise.all([
    scrape(`${ingestBase}/actuator/prometheus`),
    scrape(`${workerBase}/actuator/prometheus`),
  ]);

  const ingest: PipelineMetrics["ingest"] =
    "text" in ingestScrape ? parseIngest(ingestScrape.text) : unreachableIngest(ingestScrape.error);
  const worker: PipelineMetrics["worker"] =
    "text" in workerScrape ? parseWorker(workerScrape.text) : unreachableWorker(workerScrape.error);

  return {
    ingest,
    worker,
    fetchedAt: new Date().toISOString(),
  };
}
