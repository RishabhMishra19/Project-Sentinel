import { flexRender, type Table } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";

interface DataTableRowsBodyProps<TData> {
  table: Table<TData>;
}

export function DataTableRowsBody<TData>({ table }: DataTableRowsBodyProps<TData>) {
  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="h-12">
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
