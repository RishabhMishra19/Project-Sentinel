import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Column } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const canSort = column.getCanSort();

  if (!canSort) {
    return <span>{title}</span>;
  }

  const sort = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      className="-ml-3 h-8 px-3 hover:bg-transparent cursor-pointer"
      onClick={() => column.toggleSorting(sort === "asc")}
    >
      <span>{title}</span>

      {sort === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}

      {sort === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}

      {!sort && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
    </Button>
  );
}
