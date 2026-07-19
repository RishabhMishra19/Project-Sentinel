import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { flexRender, type Table } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

interface DataTableHeaderProps<TData> {
  table: Table<TData>;
}

export function DataTableHeader<TData>({ table }: DataTableHeaderProps<TData>) {
  return (
    <TableHeader className="bg-muted/80">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="h-12">
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder ? null : typeof header.column.columnDef.header === "string" ? (
                <DataTableColumnHeader
                  column={header.column}
                  title={header.column.columnDef.header}
                />
              ) : (
                flexRender(header.column.columnDef.header, header.getContext())
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}
