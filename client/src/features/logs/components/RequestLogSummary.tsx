import type { RequestLogResponse } from "../dto/response/requestLog.response";
import { HttpMethodBadge, HttpStatusBadge } from "./requestLogBadges";

type RequestLogSummaryProps = {
  log: RequestLogResponse;
};

export const RequestLogSummary = ({ log }: RequestLogSummaryProps) => {
  return (
    <section className="rounded-xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-center gap-2">
        <HttpMethodBadge method={log.method} />
        <HttpStatusBadge statusCode={log.statusCode} />
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
  );
};
