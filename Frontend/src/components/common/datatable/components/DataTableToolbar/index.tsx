import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";

import { DataTableActionMenu } from "./DataTableActionMenu";
import { DataTableAppliedFilters } from "./DataTableAppliedFilters";
import { DataTableSearch } from "./DataTableSearch";
import type { DataTableAction } from "../../types";
import { DataTableFilters } from "./DataTableFilters";

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
  return (
    <div className="bg-muted/30 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center justify-between">
          <DataTableSearch table={table} />
          <DataTableFilters table={table} />
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
