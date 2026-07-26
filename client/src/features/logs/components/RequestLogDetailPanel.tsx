import { useId, useState, type ReactNode } from "react";
import { toast } from "../../../shared/ui/toast";
import type { RequestLogResponse } from "../dto/response/requestLog.response";

type RequestLogDetailPanelProps = {
  log: RequestLogResponse | undefined;
  loading: boolean;
  onClose: () => void;
};

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatBytes(bytes: number | null) {
  if (bytes == null) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function statusClasses(code: number) {
  if (code >= 500) return "bg-danger/15 text-danger";
  if (code >= 400) return "bg-warning/15 text-warning";
  if (code >= 300) return "bg-accent-soft text-accent";
  return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
}

function methodClasses(method: string) {
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
}

function DetailItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 break-all text-sm text-foreground">{children}</dd>
    </div>
  );
}

function CopyableValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard.");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy.");
    }
  };

  return (
    <div className="flex items-start gap-2">
      <code className="min-w-0 flex-1 font-mono text-xs leading-5 text-foreground">{value}</code>
      <button
        type="button"
        onClick={() => void onCopy()}
        className="shrink-0 rounded border border-border px-2 py-0.5 text-[11px] text-muted hover:bg-chrome hover:text-foreground"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <div className="h-24 animate-pulse rounded-xl bg-chrome" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-chrome" />
        ))}
      </div>
    </div>
  );
}

export function RequestLogDetailPanel({ log, loading, onClose }: RequestLogDetailPanelProps) {
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

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading || !log ? (
            <LoadingState />
          ) : (
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
                  <DetailItem label="Time">{formatDateTime(log.occurredAt)}</DetailItem>
                  <DetailItem label="Duration">
                    <span className="tabular-nums">{log.durationMs} ms</span>
                  </DetailItem>
                </dl>
              </section>

              <section>
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                  Route
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-border p-4">
                  <DetailItem label="Product">{log.productName}</DetailItem>
                  <DetailItem label="Service">{log.serviceName}</DetailItem>
                  <div className="col-span-2">
                    <DetailItem label="Endpoint">
                      <span className="font-mono text-xs">
                        {log.method} {log.pathTemplate}
                      </span>
                    </DetailItem>
                  </div>
                </dl>
              </section>

              <section>
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                  Identifiers
                </h3>
                <dl className="flex flex-col gap-4 rounded-xl border border-border p-4">
                  <DetailItem label="Trace">
                    {log.traceId ? <CopyableValue value={log.traceId} /> : "—"}
                  </DetailItem>
                  <DetailItem label="Request ID">
                    {log.requestId ? <CopyableValue value={log.requestId} /> : "—"}
                  </DetailItem>
                </dl>
              </section>

              <section>
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                  Client
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-border p-4">
                  <DetailItem label="User">
                    {log.userId ? <span className="font-mono text-xs">{log.userId}</span> : "—"}
                  </DetailItem>
                  <DetailItem label="IP">
                    {log.endUserIp ? (
                      <span className="font-mono text-xs">{log.endUserIp}</span>
                    ) : (
                      "—"
                    )}
                  </DetailItem>
                </dl>
              </section>

              {requestSize || responseSize ? (
                <section>
                  <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    Payload
                  </h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-border p-4">
                    <DetailItem label="Request size">{requestSize ?? "—"}</DetailItem>
                    <DetailItem label="Response size">{responseSize ?? "—"}</DetailItem>
                  </dl>
                </section>
              ) : null}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
