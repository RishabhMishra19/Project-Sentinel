import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DataTableAppliedFiltersProps<TData> {
  table: Table<TData>;
}

export function DataTableAppliedFilters<TData>({ table }: DataTableAppliedFiltersProps<TData>) {
  const filters = table.getState().columnFilters;

  if (!filters.length) {
    return null;
  }

  const clearAll = () => {
    table.resetColumnFilters();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => {
        const values = Array.isArray(filter.value) ? filter.value : [filter.value];

        return values.map((value) => (
          <Badge key={`${filter.id}-${value}`} variant="secondary" className="gap-1">
            <span className="font-medium capitalize">{filter.id}</span>

            <span>{String(value)}</span>

            <button
              type="button"
              className="ml-1 rounded-sm hover:bg-muted"
              onClick={() => {
                const column = table.getColumn(filter.id);

                if (!column) return;

                const current = (column.getFilterValue() as string[]) ?? [];

                const next = current.filter((item) => item !== value);

                column.setFilterValue(next.length ? next : undefined);
              }}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ));
      })}

      <Button variant="ghost" size="sm" onClick={clearAll}>
        Clear all
      </Button>
    </div>
  );
}
