import { isFilterActive } from '../filters/isFilterActive'
import type {
  DataTableColumn,
  DataTableFilterValue,
  DataTableSearchState,
} from '../types'
import { getCellComparableValue, getCellSearchText } from './getCellValue'

export const matchesSearch = <T extends Record<string, unknown>>(
  row: T,
  columns: DataTableColumn<T>[],
  search: DataTableSearchState,
): boolean => {
  const query = search.value.trim().toLowerCase()
  if (!query) {
    return true
  }

  const column = columns.find((item) => item.id === search.columnId)
  if (!column) {
    return true
  }

  return getCellSearchText(row, column).toLowerCase().includes(query)
}

export const matchesColumnFilter = <T extends Record<string, unknown>>(
  row: T,
  column: DataTableColumn<T>,
  value: DataTableFilterValue | undefined,
): boolean => {
  if (!column.filter || !isFilterActive(column.filter, value)) {
    return true
  }

  const cellValue = getCellComparableValue(row, column)

  switch (column.filter.type) {
    case 'select':
      return String(cellValue ?? '') === value
    case 'multiSelect': {
      const selected = value as DataTableFilterValue<'multiSelect'>
      return selected.includes(String(cellValue ?? ''))
    }
    case 'boolean':
      return cellValue === value
    case 'date': {
      const day = String(cellValue ?? '').slice(0, 10)
      return day === value
    }
    case 'dateRange': {
      const range = value as DataTableFilterValue<'dateRange'>
      const day = String(cellValue ?? '').slice(0, 10)
      if (!day) {
        return false
      }
      if (range.from && day < range.from) {
        return false
      }
      if (range.to && day > range.to) {
        return false
      }
      return true
    }
  }
}

export const applyClientFilters = <T extends Record<string, unknown>>(
  data: T[],
  columns: DataTableColumn<T>[],
  search: DataTableSearchState,
  filters: Record<string, DataTableFilterValue>,
): T[] =>
  data.filter((row) => {
    if (!matchesSearch(row, columns, search)) {
      return false
    }
    return columns.every((column) =>
      matchesColumnFilter(row, column, filters[column.id]),
    )
  })
