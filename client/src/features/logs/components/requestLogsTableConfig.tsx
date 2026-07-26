import type { DataTableColumn, RowAction } from "../../../shared/ui/data-table";
import type { FilterOption } from "../../../shared/ui/filters";
import type { RequestLogResponse } from "../dto/response/requestLog.response";

type CreateRequestLogColumnsOptions = {
  productOptions: FilterOption[];
  serviceOptions: FilterOption[];
  endpointOptions: FilterOption[];
};

function statusTone(code: number) {
  if (code >= 500) return "text-red-700";
  if (code >= 400) return "text-amber-700";
  return "text-foreground";
}

export function createRequestLogColumns({
  productOptions,
  serviceOptions,
  endpointOptions,
}: CreateRequestLogColumnsOptions): DataTableColumn<RequestLogResponse>[] {
  return [
    {
      id: "occurredAt",
      header: "Time",
      sortable: true,
      filter: { type: "dateTimeRange" },
      cell: { type: "datetime", getValue: (row) => row.occurredAt },
    },
    {
      id: "productId",
      header: "Product",
      filter: { type: "select", options: productOptions },
      cell: { type: "text", getValue: (row) => row.productName },
    },
    {
      id: "serviceId",
      header: "Service",
      filter: { type: "select", options: serviceOptions },
      cell: { type: "text", getValue: (row) => row.serviceName },
    },
    {
      id: "endpointId",
      header: "Endpoint",
      filter: { type: "select", options: endpointOptions },
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
      filter: {
        type: "multiSelect",
        options: [
          { label: "2xx", value: "2xx" },
          { label: "3xx", value: "3xx" },
          { label: "4xx", value: "4xx" },
          { label: "5xx", value: "5xx" },
        ],
      },
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
      sortable: true,
      cell: {
        type: "custom",
        render: (row) => <span className="tabular-nums">{row.durationMs} ms</span>,
      },
    },
    {
      id: "traceId",
      header: "Trace",
      searchable: true,
      cell: {
        type: "custom",
        render: (row) => (
          <span className="max-w-[10rem] truncate font-mono text-xs">{row.traceId ?? "—"}</span>
        ),
      },
    },
  ];
}

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
