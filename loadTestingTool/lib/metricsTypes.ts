export type MetricsRequest = {
  ingestUrl: string;
  workerUrl: string;
};

export type ServiceMetricsStatus = {
  ok: boolean;
  error: string | null;
};

export type PipelineMetrics = {
  ingest: ServiceMetricsStatus & {
    eventsPublished: number | null;
    requests: number | null;
    avgPublishMs: number | null;
  };
  worker: ServiceMetricsStatus & {
    eventsProcessed: number | null;
    batchesProcessed: number | null;
    batchesFailed: number | null;
    avgBatchSize: number | null;
    avgBatchMs: number | null;
    avgPerEventMs: number | null;
  };
  fetchedAt: string;
};
