import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";

import { DataTableActionMenu } from "./DataTableActionMenu";
import { DataTableAppliedFilters } from "./DataTableAppliedFilters";
import { DataTableFilter } from "./DataTableFilter";
import { DataTableSearch } from "./DataTableSearch";

import type { DataTableAction } from "../types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;

  actions?: DataTableAction[];

  children?: ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  actions = [],
  children,
}: DataTableToolbarProps<TData>) {
  const filterableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.columnDef.meta?.filter);

  return (
    <div className="border-b bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <DataTableSearch table={table} />
          {filterableColumns.map((column) => (
            <DataTableFilter key={column.id} table={table} column={column} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {children}

          <DataTableActionMenu table={table} actions={actions} />
        </div>
      </div>

      <DataTableAppliedFilters table={table} />
    </div>
  );
}
