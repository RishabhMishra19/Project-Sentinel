import type { Column } from "@tanstack/react-table";

import { BooleanFilter } from "./filters/BooleanFilter";
import { DateFilter } from "./filters/DateFilter";
import { DateRangeFilter } from "./filters/DateRangeFilter";
import { SelectFilter } from "./filters/SelectFilter";

interface FilterPopupProps<TData> {
  column?: Column<TData, unknown>;
}

export function FilterPopup<TData>({ column }: FilterPopupProps<TData>) {
  if (!column) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Hover over a filter to configure it.
      </div>
    );
  }

  const filter = column.columnDef.meta?.filter;

  if (!filter) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Filter configuration not found.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {filter.type === "select" && <SelectFilter column={column} />}

      {filter.type === "boolean" && <BooleanFilter column={column} />}

      {filter.type === "date" && <DateFilter column={column} />}

      {filter.type === "date-range" && <DateRangeFilter column={column} />}
    </div>
  );
}
