import { CopyableValue, DetailRow, DetailSection } from "../../../shared/ui";
import { formatDateTime } from "../../../shared/utils/dateUtils";
import type { RequestLogResponse } from "../dto/response/requestLog.response";
import { formatBytes } from "../utils/requestLogFormat";

type RequestLogDetailSectionsProps = {
  log: RequestLogResponse;
};

export const RequestLogDetailSections = ({ log }: RequestLogDetailSectionsProps) => {
  const requestSize = formatBytes(log.requestSizeBytes);
  const responseSize = formatBytes(log.responseSizeBytes);

  return (
    <>
      <DetailSection title="Timing">
        <DetailRow variant="emphasized" label="Time" value={formatDateTime(log.occurredAt)} />
        <DetailRow variant="emphasized" label="Duration">
          <span className="tabular-nums">{log.durationMs} ms</span>
        </DetailRow>
      </DetailSection>

      <DetailSection title="Route">
        <DetailRow variant="emphasized" label="Product" value={log.productName} />
        <DetailRow variant="emphasized" label="Service" value={log.serviceName} />
        <div className="col-span-2">
          <DetailRow variant="emphasized" label="Endpoint">
            <span className="font-mono text-xs">
              {log.method} {log.pathTemplate}
            </span>
          </DetailRow>
        </div>
      </DetailSection>

      <DetailSection title="Identifiers" layout="stack">
        <DetailRow variant="emphasized" label="Trace">
          {log.traceId ? <CopyableValue value={log.traceId} /> : "—"}
        </DetailRow>
        <DetailRow variant="emphasized" label="Request ID">
          {log.requestId ? <CopyableValue value={log.requestId} /> : "—"}
        </DetailRow>
      </DetailSection>

      <DetailSection title="Client">
        <DetailRow variant="emphasized" label="User">
          {log.userId ? <span className="font-mono text-xs">{log.userId}</span> : "—"}
        </DetailRow>
        <DetailRow variant="emphasized" label="IP">
          {log.endUserIp ? <span className="font-mono text-xs">{log.endUserIp}</span> : "—"}
        </DetailRow>
      </DetailSection>

      {requestSize || responseSize ? (
        <DetailSection title="Payload">
          <DetailRow variant="emphasized" label="Request size" value={requestSize ?? "—"} />
          <DetailRow variant="emphasized" label="Response size" value={responseSize ?? "—"} />
        </DetailSection>
      ) : null}
    </>
  );
};
