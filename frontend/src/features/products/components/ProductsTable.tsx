import { useMemo } from "react";
import { DataTable, useDataTable } from "../../../shared/ui/data-table";
import { primaryButtonClassName } from "../../../shared/ui/data-table/styles";
import type { ProductResponse } from "../dto/response/product.response";
import { useProductsQuery } from "../hooks/useProducts";
import { createProductRowActions, productColumns } from "./productsTableConfig";

type ProductsTableProps = {
  onCreate: () => void;
  onView: (product: ProductResponse) => void;
  onEdit: (product: ProductResponse) => void;
  onServices: (product: ProductResponse) => void;
  onDeactivate: (product: ProductResponse) => void;
};

export const ProductsTable = ({
  onCreate,
  onView,
  onEdit,
  onServices,
  onDeactivate,
}: ProductsTableProps) => {
  const rowActions = useMemo(
    () =>
      createProductRowActions({
        onView,
        onEdit,
        onServices,
        onDeactivate,
      }),
    [onView, onEdit, onServices, onDeactivate],
  );

  const { listQueryRequest, bindPage } = useDataTable({
    columns: productColumns,
    getRowId: (row) => row.id,
    initialState: { pageSize: 10 },
    rowActions,
    toolbarActions: (
      <button type="button" className={primaryButtonClassName} onClick={onCreate}>
        Create product
      </button>
    ),
    emptyMessage: "No products match your filters",
    errorMessage: "Could not load products",
  });

  const page = useProductsQuery(listQueryRequest);

  return <DataTable {...bindPage(page)} />;
};
