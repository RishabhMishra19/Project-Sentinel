import { Table } from "@/components/ui/table";

import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableHeader } from "./DataTableHeader";
import { TableBody } from "@/components/ui/table";
import type { Table as TableType } from "@tanstack/react-table";
import type { DataTableFilterConfig } from "../types";
import type { DataTableAction } from "./DataTableActionMenu";

interface DataTableLayoutProps<TData> {
  table: TableType<TData>;
  searchPlaceholder?: string;
  filters?: DataTableFilterConfig[];
  actions?: DataTableAction[];
  children: React.ReactNode;
}

export function DataTableLayout<TData>({
  table,
  children,
  searchPlaceholder,
  filters,
  actions,
}: DataTableLayoutProps<TData>) {
  return (
    <div className="flex flex-col gap-0">
      <DataTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        actions={actions}
      />
      <Table className="border">
        <DataTableHeader table={table} />
        <TableBody className="bg-white">{children}</TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
