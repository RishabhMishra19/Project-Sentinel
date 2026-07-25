import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableColumn } from '../types'

export const getCellComparableValue = <T extends object>(
  row: T,
  column: DataTableColumn<T>,
): string | number | boolean | null => {
  const cell = column.cell
  if (cell.type === 'custom') {
    return null
  }

  const value = cell.getValue(row)
  if (value == null) {
    return null
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  return String(value)
}

export const getCellSearchText = <T extends object>(
  row: T,
  column: DataTableColumn<T>,
): string => {
  const value = getCellComparableValue(row, column)
  if (value == null) {
    return ''
  }
  return String(value)
}

export const buildTanStackColumns = <T extends object>(
  columns: DataTableColumn<T>[],
): ColumnDef<T, unknown>[] =>
  columns.map((column) => ({
    id: column.id,
    accessorFn: (row) => getCellComparableValue(row, column),
    enableSorting: Boolean(column.sortable),
    header: column.header,
  }))
