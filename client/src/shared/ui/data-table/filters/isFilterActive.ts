import type { DataTableColumnFilter, DataTableFilterValue } from '../types'

export const isFilterActive = (
  filter: DataTableColumnFilter,
  value: DataTableFilterValue | undefined,
): boolean => {
  if (value === undefined || value === null) {
    return false
  }
  switch (filter.type) {
    case 'select':
    case 'boolean':
    case 'date':
      return value !== null && value !== ''
    case 'multiSelect':
      return Array.isArray(value) && value.length > 0
    case 'dateRange': {
      const range = value as DataTableFilterValue<'dateRange'>
      return Boolean(range.from || range.to)
    }
  }
}
