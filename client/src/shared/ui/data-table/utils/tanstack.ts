import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableColumn } from "../types";
import { getCellComparableValue } from "./cellValues";

export { getCellComparableValue, getCellSearchText } from "./cellValues";

export const buildTanStackColumns = <T extends object>(
  columns: DataTableColumn<T>[],
): ColumnDef<T, unknown>[] =>
  columns.map((column) => ({
    id: column.id,
    accessorFn: (row) => getCellComparableValue(row, column),
    enableSorting: Boolean(column.sortable),
    header: column.header,
  }));
