import type { ColumnDef } from "@tanstack/react-table";

import { DataTableEmptyBody } from "./components/DataTableEmptyBody";
import { DataTableLayout } from "./components/DataTableLayout";
import { DataTableLoadingBody } from "./components/DataTableLoadingBody";
import { useServerTable } from "./hooks/useServerTable";
import { DataTableRowsBody } from "./components/DataTableRowsBody";

interface ServerDataTableProps<TData> {
  columns: ColumnDef<TData>[];
  fetchData: Parameters<typeof useServerTable<TData>>[0]["fetchData"];
  emptyMessage?: string;
}

export function ServerDataTable<TData>({
  columns,
  fetchData,
  emptyMessage,
}: ServerDataTableProps<TData>) {
  const { table, loading } = useServerTable({
    columns,
    fetchData,
  });

  return (
    <DataTableLayout table={table}>
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
