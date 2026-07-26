import { useId } from "react";
import { CopyableValue, DetailRow, QueryGate } from "../../../shared/ui";
import { formatDateTime } from "../../../shared/utils/dateUtils";
import type { RequestLogResponse } from "../dto/response/requestLog.response";

type RequestLogDetailPanelProps = {
  log: RequestLogResponse | undefined;
  loading: boolean;
  isError?: boolean;
  onClose: () => void;
};

const formatBytes = (bytes: number | null) => {
  if (bytes == null) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const statusClasses = (code: number) => {
  if (code >= 500) return "bg-danger/15 text-danger";
  if (code >= 400) return "bg-warning/15 text-warning";
  if (code >= 300) return "bg-accent-soft text-accent";
  return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
};

const methodClasses = (method: string) => {
  switch (method.toUpperCase()) {
    case "GET":
      return "bg-accent-soft text-accent";
    case "POST":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    case "PUT":
    case "PATCH":
      return "bg-warning/15 text-warning";
    case "DELETE":
      return "bg-danger/15 text-danger";
    default:
      return "bg-chrome text-muted";
  }
};

export const RequestLogDetailPanel = ({
  log,
  loading,
  isError = false,
  onClose,
}: RequestLogDetailPanelProps) => {
  const titleId = useId();
  const requestSize = log ? formatBytes(log.requestSizeBytes) : null;
  const responseSize = log ? formatBytes(log.responseSizeBytes) : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40">
      <button
        type="button"
        className="flex-1 cursor-default"
        aria-label="Close dialog backdrop"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full max-w-lg flex-col border-l border-border bg-surface shadow-lg"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Logs</p>
            <h2
              id={titleId}
              className="mt-0.5 text-lg font-semibold tracking-tight text-foreground"
            >
              Request details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-border px-2.5 py-1 text-sm text-foreground hover:bg-chrome"
          >
            Close
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5">
          <QueryGate
            isLoading={loading}
            isError={isError || (!loading && !log)}
            errorMessage="Could not load request details."
          >
            {log ? (
              <div className="flex flex-col gap-6">
                <section className="rounded-xl border border-border bg-background p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold tracking-wide ${methodClasses(log.method)}`}
                    >
                      {log.method}
                    </span>
                    <span
                      className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold tabular-nums ${statusClasses(log.statusCode)}`}
                    >
                      {log.statusCode}
                    </span>
                    <span className="rounded bg-chrome px-2 py-0.5 text-xs font-medium tabular-nums text-foreground">
                      {log.durationMs} ms
                    </span>
                  </div>
                  <p className="mt-3 break-all font-mono text-sm font-medium leading-6 text-foreground">
                    {log.pathTemplate}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {log.serviceName}
                    <span className="mx-1.5 text-border">·</span>
                    {log.productName}
                  </p>
                </section>

                <section>
                  <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    Timing
                  </h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-border p-4">
                    <DetailRow
                      variant="emphasized"
                      label="Time"
                      value={formatDateTime(log.occurredAt)}
                    />
                    <DetailRow variant="emphasized" label="Duration">
                      <span className="tabular-nums">{log.durationMs} ms</span>
                    </DetailRow>
                  </dl>
                </section>

                <section>
                  <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    Route
                  </h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-border p-4">
                    <DetailRow variant="emphasized" label="Product" value={log.productName} />
                    <DetailRow variant="emphasized" label="Service" value={log.serviceName} />
                    <div className="col-span-2">
                      <DetailRow variant="emphasized" label="Endpoint">
                        <span className="font-mono text-xs">
                          {log.method} {log.pathTemplate}
                        </span>
                      </DetailRow>
                    </div>
                  </dl>
                </section>

                <section>
                  <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    Identifiers
                  </h3>
                  <dl className="flex flex-col gap-4 rounded-xl border border-border p-4">
                    <DetailRow variant="emphasized" label="Trace">
                      {log.traceId ? <CopyableValue value={log.traceId} /> : "—"}
                    </DetailRow>
                    <DetailRow variant="emphasized" label="Request ID">
                      {log.requestId ? <CopyableValue value={log.requestId} /> : "—"}
                    </DetailRow>
                  </dl>
                </section>

                <section>
                  <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    Client
                  </h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-border p-4">
                    <DetailRow variant="emphasized" label="User">
                      {log.userId ? <span className="font-mono text-xs">{log.userId}</span> : "—"}
                    </DetailRow>
                    <DetailRow variant="emphasized" label="IP">
                      {log.endUserIp ? (
                        <span className="font-mono text-xs">{log.endUserIp}</span>
                      ) : (
                        "—"
                      )}
                    </DetailRow>
                  </dl>
                </section>

                {requestSize || responseSize ? (
                  <section>
                    <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                      Payload
                    </h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-border p-4">
                      <DetailRow
                        variant="emphasized"
                        label="Request size"
                        value={requestSize ?? "—"}
                      />
                      <DetailRow
                        variant="emphasized"
                        label="Response size"
                        value={responseSize ?? "—"}
                      />
                    </dl>
                  </section>
                ) : null}
              </div>
            ) : null}
          </QueryGate>
        </div>
      </aside>
    </div>
  );
};
