import { useMemo } from "react";
import { SelectField } from "../../../shared/forms/SelectField";
import { DataTable, useDataTable } from "../../../shared/ui/data-table";
import { primaryButtonClassName } from "../../../shared/ui/data-table/styles";
import type { ProductResponse } from "../../products/dto/response/product.response";
import type { ServiceResponse } from "../dto/response/service.response";
import { useServicesQuery } from "../hooks/useServices";
import { createServiceRowActions, productServiceColumns } from "./servicesTableConfig";


type ServicesTableProps = {
  products: ProductResponse[];
  selectedProductId?: string | null;
  onProductChange: (productId: string) => void;
  onCreate: () => void;
  onView: (service: ServiceResponse) => void;
  onEdit: (service: ServiceResponse) => void;
  onViewApiKeys: (service: ServiceResponse) => void;
  onDeactivate: (service: ServiceResponse) => void;
};

export const ServicesTable = ({
  products,
  selectedProductId,
  onProductChange,
  onCreate,
  onView,
  onEdit,
  onViewApiKeys,
  onDeactivate,
}: ServicesTableProps) => {
  const effectiveProductId = selectedProductId ?? undefined;

  const rowActions = useMemo(
    () =>
      createServiceRowActions({
        onView,
        onEdit,
        onViewApiKeys,
        onDeactivate,
      }),
    [onView, onEdit, onViewApiKeys, onDeactivate],
  );

  const emptyMessage = !effectiveProductId
    ? products.length === 0
      ? "Create a product before managing services"
      : "Select a product to view its services"
    : "No services match your filters";

  const { listQueryRequest, bindPage } = useDataTable({
    columns: productServiceColumns,
    getRowId: (row) => row.id,
    initialState: { pageSize: 10 },
    rowActions: effectiveProductId ? rowActions : [],
    toolbarActions: (
      <div className="flex flex-wrap items-center gap-2">
        <SelectField
          className="min-w-[10rem]"
          value={selectedProductId ?? ""}
          onChange={(event) => onProductChange(event.target.value)}
          aria-label="Filter services by product"
          emptyPlaceholder="No products"
          options={products.map((product) => ({
            value: product.id,
            label: product.name,
          }))}
        />

        <button
          type="button"
          className={primaryButtonClassName}
          onClick={onCreate}
          disabled={!effectiveProductId}
        >
          Create service
        </button>
      </div>
    ),
    emptyMessage,
    errorMessage: "Could not load services",
  });

  const page = useServicesQuery(effectiveProductId, effectiveProductId ? listQueryRequest : null);

  return (
    <DataTable
      {...bindPage({
        rows: effectiveProductId ? page.rows : [],
        totalElements: effectiveProductId ? page.totalElements : 0,
        isLoading: effectiveProductId != null && page.isLoading,
      })}
    />
  );
};
