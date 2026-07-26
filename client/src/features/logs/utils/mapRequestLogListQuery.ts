import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import { toListQueryRequest } from "../../../shared/api/toListQueryRequest";
import type { DataTableQueryState } from "../../../shared/ui/data-table";
import { dateTimeRangeFromPreset } from "../../../shared/ui/filters";
import { clampLogsRange } from "../../analytics/utils/timeRange";

const SORTABLE_FIELDS = new Set(["occurredAt", "durationMs", "statusCode"]);

const datetimeLocalToIso = (local: string): string | null => {
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

const defaultLogsRange = (): { from: string; to: string } => {
  const range = dateTimeRangeFromPreset("24h");
  return {
    from: datetimeLocalToIso(range.from)!,
    to: datetimeLocalToIso(range.to)!,
  };
};

export const mapRequestLogListQuery = (state: DataTableQueryState): ListQueryRequest => {
  const body = toListQueryRequest(state, {
    sortableFields: SORTABLE_FIELDS,
    searchBy: {
      isSearchBy: (v): v is "traceId" => v === "traceId",
      defaultSearchBy: "traceId",
    },
    defaultSort: { fieldName: "occurredAt", desc: true },
  });

  const fallback = defaultLogsRange();
  const clamped = clampLogsRange(
    state.apiFilters.from ?? body.from ?? fallback.from,
    state.apiFilters.to ?? body.to ?? fallback.to,
  );
  body.from = clamped.from;
  body.to = clamped.to;

  return body;
};
