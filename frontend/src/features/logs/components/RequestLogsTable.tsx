import { useMemo } from "react";
import { DataTable, useDataTable } from "../../../shared/ui/data-table";
import type { RequestLogResponse } from "../dto/response/requestLog.response";
import { useRequestLogsQuery } from "../hooks/useRequestLogs";
import { createRequestLogColumns, createRequestLogRowActions } from "./requestLogsTableConfig";
import { SelectField } from "../../../shared/forms/SelectField";
import { useUrlSyncedSelection } from "../../../shared/hooks/useUrlSyncedSelection";
import type { ProductResponse } from "../../products/dto/response/product.response";
import type { ServiceResponse } from "../../services/dto/response/service.response";
import type { CursorPageRequest } from "../../../shared/dto/request/CursorPageRequest";

type RequestLogsTableProps = {
  onView: (log: RequestLogResponse) => void;
  products: ProductResponse[];
  services: ServiceResponse[];
};

export const RequestLogsTable = ({ onView, products, services }: RequestLogsTableProps) => {
  const { selectedId: selectedProductId, onChange: onProductChange } = useUrlSyncedSelection({
    paramKey: "productId",
    items: products,
  });

  const relevantServices = useMemo(
    () => services.filter((v) => v.productId === selectedProductId),
    [services, selectedProductId],
  );

  const { selectedId: selectedServiceId, onChange: onServiceChange } = useUrlSyncedSelection({
    paramKey: "serviceId",
    items: relevantServices,
  });

  const columns = useMemo(() => createRequestLogColumns(), []);

  const rowActions = useMemo(() => createRequestLogRowActions({ onView }), [onView]);

  const { query, bindPage } = useDataTable({
    columns,
    getRowId: (row) => row.id,
    initialState: { pageSize: 10 },
    rowActions,
    toolbarActions: (
      <div className="flex flex-wrap items-center gap-2">
        <SelectField
          className="min-w-[12rem]"
          value={selectedProductId ?? ""}
          onChange={(event) => {
            onProductChange(event.target.value);
            onServiceChange(null);
          }}
          aria-label="Filter Request Logs by product"
          emptyPlaceholder="No products"
          options={products.map((product) => ({
            value: product.id,
            label: product.name,
          }))}
        />

        <SelectField
          className="min-w-[12rem]"
          value={selectedServiceId ?? ""}
          onChange={(event) => onServiceChange(event.target.value)}
          aria-label="Filter Request Logs by service"
          emptyPlaceholder="No services"
          options={relevantServices.map((service) => ({
            value: service.id,
            label: service.name,
          }))}
        />
      </div>
    ),
    emptyMessage: "No events match your filters",
    errorMessage: "Could not load events",
    enablePagination: true,
  });

  const listQueryRequest: CursorPageRequest | undefined = useMemo(() => {
    if (selectedServiceId == null) return undefined;
    return {
      pageSize: query.pageSize,
      cursor: query.cursor,
      direction: query.cursorType ?? "FORWARD",
    };
  }, [query]);

  const page = useRequestLogsQuery(selectedServiceId, listQueryRequest);

  console.log({ page, as: bindPage(page) });

  return <DataTable {...bindPage(page)} />;
};
