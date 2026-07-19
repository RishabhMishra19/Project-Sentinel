import type { Table } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";

interface DataTableEmptyBodyProps<TData> {
  table: Table<TData>;

  message?: string;
}

export function DataTableEmptyBody<TData>({
  table,
  message = "No data found.",
}: DataTableEmptyBodyProps<TData>) {
  return (
    <TableRow>
      <TableCell
        colSpan={table.getVisibleLeafColumns().length}
        className="h-40 text-center text-muted-foreground"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
