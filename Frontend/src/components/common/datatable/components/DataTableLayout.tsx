import { Table } from "@/components/ui/table";

import { DataTablePagination } from "./DataTablePagination";
import { TableBody } from "@/components/ui/table";
import type { Table as TableType } from "@tanstack/react-table";
import type { DataTableAction } from "./DataTableToolbar/DataTableActionMenu";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableHeader } from "./DataTableHeader";

interface DataTableLayoutProps<TData> {
  table: TableType<TData>;
  actions?: DataTableAction[];
  children: React.ReactNode;
}

export function DataTableLayout<TData>({ table, children, actions }: DataTableLayoutProps<TData>) {
  return (
    <div className="flex flex-col gap-0">
      <DataTableToolbar table={table} actions={actions} />
      <Table className="border">
        <DataTableHeader table={table} />
        <TableBody className="bg-white">{children}</TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
