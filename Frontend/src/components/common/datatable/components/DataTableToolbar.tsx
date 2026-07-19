import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";

import { DataTableActionMenu } from "./DataTableActionMenu";
import { DataTableAppliedFilters } from "./DataTableAppliedFilters";
import { DataTableFilter } from "./DataTableFilter";
import { DataTableSearch } from "./DataTableSearch";

import type { DataTableAction, DataTableFilterConfig } from "../types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;

  searchPlaceholder?: string;

  filters?: DataTableFilterConfig[];

  actions?: DataTableAction[];

  children?: ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder,
  filters = [],
  actions = [],
  children,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="border-b bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <DataTableSearch table={table} placeholder={searchPlaceholder} />

          {filters.map((filter) => (
            <DataTableFilter
              key={filter.columnId}
              table={table}
              columnId={filter.columnId}
              title={filter.title}
              options={filter.options}
            />
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
