import type { Table } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

interface DataTableLoadingBodyProps<TData> {
  table: Table<TData>;

  rows?: number;
}

export function DataTableLoadingBody<TData>({ table, rows = 8 }: DataTableLoadingBodyProps<TData>) {
  const columns = table.getVisibleLeafColumns().length;

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <TableCell key={columnIndex}>
              <Skeleton className="h-5 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
