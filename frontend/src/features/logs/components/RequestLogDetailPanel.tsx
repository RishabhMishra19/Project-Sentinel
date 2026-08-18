import { QueryGate, SlideOver } from "../../../shared/ui";
import type { RequestLogResponse } from "../dto/response/requestLog.response";
import { RequestLogDetailSections } from "./RequestLogDetailSections";
import { RequestLogSummary } from "./RequestLogSummary";

type RequestLogDetailPanelProps = {
  open: boolean;
  log: RequestLogResponse | undefined;
  loading: boolean;
  isError?: boolean;
  onClose: () => void;
};

export const RequestLogDetailPanel = ({
  open,
  log,
  loading,
  isError = false,
  onClose,
}: RequestLogDetailPanelProps) => {
  return (
    <SlideOver open={open} onClose={onClose} eyebrow="Logs" title="Request details">
      <QueryGate
        isLoading={loading}
        isError={isError || (!loading && !log)}
        errorMessage="Could not load request details."
      >
        {log ? (
          <div className="flex flex-col gap-6">
            <RequestLogSummary log={log} />
            <RequestLogDetailSections log={log} />
          </div>
        ) : null}
      </QueryGate>
    </SlideOver>
  );
};
