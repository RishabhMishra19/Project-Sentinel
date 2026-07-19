import type { ColumnDef } from "@tanstack/react-table";

import { DataTableEmptyBody } from "./components/DataTableEmptyBody";
import { DataTableLayout } from "./components/DataTableLayout";
import { DataTableLoadingBody } from "./components/DataTableLoadingBody";
import { useClientTable } from "./hooks/useClientTable";
import { DataTableRowsBody } from "./components/DataTableRowsBody";
import type { DataTableFilterConfig, DataTableAction } from "./types";

interface ClientDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  loading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
  filters?: DataTableFilterConfig[];
  actions?: DataTableAction[];
}

export function ClientDataTable<TData>({
  data,
  columns,
  loading = false,
  emptyMessage,
  searchPlaceholder,
  filters,
  actions,
}: ClientDataTableProps<TData>) {
  const { table } = useClientTable({
    data,
    columns,
  });

  return (
    <DataTableLayout
      table={table}
      searchPlaceholder={searchPlaceholder}
      filters={filters}
      actions={actions}
    >
      {loading ? (
        <DataTableLoadingBody table={table} />
      ) : table.getRowModel().rows.length === 0 ? (
        <DataTableEmptyBody table={table} message={emptyMessage} />
      ) : (
        <DataTableRowsBody table={table} />
      )}
    </DataTableLayout>
  );
}
