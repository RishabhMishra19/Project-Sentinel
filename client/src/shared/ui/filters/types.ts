export type FilterType =
  | 'select'
  | 'multiSelect'
  | 'boolean'
  | 'date'
  | 'dateRange'

export type FilterOption = { label: string; value: string }

/** Source of truth: filter type → value shape */
export type FilterValueByType = {
  select: string | null
  multiSelect: string[]
  boolean: boolean | null
  date: string | null
  dateRange: { from: string | null; to: string | null }
}

/** Source of truth: filter type → field filter config */
export type FilterConfigByType = {
  select: { type: 'select'; options: FilterOption[] }
  multiSelect: { type: 'multiSelect'; options: FilterOption[] }
  boolean: { type: 'boolean' }
  date: { type: 'date' }
  dateRange: { type: 'dateRange' }
}

export type FilterValue<F extends FilterType = FilterType> =
  FilterValueByType[F]

export type FilterFieldConfig<F extends FilterType = FilterType> =
  FilterConfigByType[F]

/** A filterable field shown in the Filters popover / applied chips */
export type FilterField = {
  id: string
  header: string
  filter: FilterFieldConfig
}

export type FiltersConfig = {
  filters: Record<string, FilterValue>
  onFiltersChange: (next: Record<string, FilterValue>) => void
}
