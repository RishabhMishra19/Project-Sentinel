import type { Column } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface FilterMenuProps<TData> {
  columns: Column<TData, unknown>[];
  activeColumn?: Column<TData, unknown>;
  onHover: (column: Column<TData, unknown>) => void;
}

export function FilterMenu<TData>({ columns, activeColumn, onHover }: FilterMenuProps<TData>) {
  return (
    <div className="w-40 shrink-0 border-r">
      {columns.map((column) => {
        const title =
          typeof column.columnDef.header === "string" ? column.columnDef.header : column.id;

        const isActive = activeColumn?.id === column.id;

        return (
          <button
            key={column.id}
            type="button"
            onMouseEnter={() => onHover(column)}
            className={cn(
              "flex w-full items-center justify-between px-4 py-2 text-sm transition-colors",
              "hover:bg-muted",
              isActive && "bg-muted font-medium",
            )}
          >
            <span>{title}</span>

            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        );
      })}
    </div>
  );
}
