import type { DataTableColumnFilter, DataTableFilterValue } from '../types'
import { isFilterActive } from './isFilterActive'

export const formatFilterValue = (
  filter: DataTableColumnFilter,
  value: DataTableFilterValue | undefined,
): string | null => {
  if (!isFilterActive(filter, value)) {
    return null
  }

  switch (filter.type) {
    case 'select': {
      const selected = value as DataTableFilterValue<'select'>
      return (
        filter.options.find((option) => option.value === selected)?.label ??
        selected
      )
    }
    case 'multiSelect': {
      const selected = value as DataTableFilterValue<'multiSelect'>
      return selected
        .map(
          (item) =>
            filter.options.find((option) => option.value === item)?.label ??
            item,
        )
        .join(', ')
    }
    case 'boolean': {
      const bool = value as DataTableFilterValue<'boolean'>
      if (bool === true) {
        return 'Yes'
      }
      if (bool === false) {
        return 'No'
      }
      return null
    }
    case 'date':
      return value as DataTableFilterValue<'date'>
    case 'dateRange': {
      const range = value as DataTableFilterValue<'dateRange'>
      if (range.from && range.to) {
        return `${range.from} – ${range.to}`
      }
      if (range.from) {
        return `From ${range.from}`
      }
      if (range.to) {
        return `Until ${range.to}`
      }
      return null
    }
  }
}
