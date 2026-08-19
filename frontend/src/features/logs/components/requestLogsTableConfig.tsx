import type { DataTableColumn, RowAction } from "../../../shared/ui/data-table";
import type { RequestLogResponse } from "../dto/response/requestLog.response";

const statusTone = (code: number) => {
  if (code >= 500) return "text-red-700";
  if (code >= 400) return "text-amber-700";
  return "text-foreground";
};

export const createRequestLogColumns = (): DataTableColumn<RequestLogResponse>[] => {
  return [
    {
      id: "occurredAt",
      header: "Time",
      sortable: true,
      filter: { type: "date" },
      cell: { type: "datetime", getValue: (row) => row.occurredAt },
    },
    {
      id: "productId",
      header: "Product",
      cell: { type: "text", getValue: (row) => row.productName },
    },
    {
      id: "serviceId",
      header: "Service",
      cell: { type: "text", getValue: (row) => row.serviceName },
    },
    {
      id: "endpointId",
      header: "Endpoint",
      cell: {
        type: "custom",
        render: (row) => (
          <span className="font-mono text-xs">
            {row.method} {row.pathTemplate}
          </span>
        ),
      },
    },
    {
      id: "statusClass",
      header: "Status",
      cell: {
        type: "custom",
        render: (row) => (
          <span className={`tabular-nums ${statusTone(row.statusCode)}`}>{row.statusCode}</span>
        ),
      },
    },
    {
      id: "durationMs",
      header: "Latency",
      cell: {
        type: "custom",
        render: (row) => <span className="tabular-nums">{row.durationMs} ms</span>,
      },
    },
    {
      id: "traceId",
      header: "Trace",
      cell: {
        type: "custom",
        render: (row) => (
          <span className="max-w-[10rem] truncate font-mono text-xs">{row.traceId ?? "—"}</span>
        ),
      },
    },
  ];
};

type RequestLogRowActionHandlers = {
  onView: (row: RequestLogResponse) => void;
};

export const createRequestLogRowActions = ({
  onView,
}: RequestLogRowActionHandlers): RowAction<RequestLogResponse>[] => [
  {
    id: "view",
    label: "View",
    onClick: onView,
  },
];
