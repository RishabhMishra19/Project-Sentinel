import type {
  DataTableColumn,
  DataTableColumnFilter,
  DataTableFilterValue,
} from '../../types'
import {
  PRESET_SUMMARY,
  matchDateRangePreset,
} from './controls/DateRangeFilter'

export type FilterableColumnOption = {
  id: string
  header: string
  filter: DataTableColumnFilter
}

export type FilterChip = {
  id: string
  header: string
  label: string
}

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
      const preset = matchDateRangePreset(range)
      if (preset) {
        return PRESET_SUMMARY[preset]
      }
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

export const toFilterableColumns = <T extends object>(
  columns: DataTableColumn<T>[],
): FilterableColumnOption[] =>
  columns.flatMap((column) =>
    column.filter != null
      ? [{ id: column.id, header: column.header, filter: column.filter }]
      : [],
  )

export const countActiveFilters = (
  columns: FilterableColumnOption[],
  filters: Record<string, DataTableFilterValue>,
): number =>
  columns.filter((column) => isFilterActive(column.filter, filters[column.id]))
    .length

export const collectActiveFilters = (
  columns: FilterableColumnOption[],
  draft: Record<string, DataTableFilterValue>,
): Record<string, DataTableFilterValue> => {
  const next: Record<string, DataTableFilterValue> = {}
  for (const column of columns) {
    if (isFilterActive(column.filter, draft[column.id])) {
      next[column.id] = draft[column.id]
    }
  }
  return next
}

export const buildFilterChips = (
  columns: FilterableColumnOption[],
  filters: Record<string, DataTableFilterValue>,
): FilterChip[] =>
  columns.flatMap((column) => {
    const label = formatFilterValue(column.filter, filters[column.id])
    if (!label) {
      return []
    }
    return [{ id: column.id, header: column.header, label }]
  })
