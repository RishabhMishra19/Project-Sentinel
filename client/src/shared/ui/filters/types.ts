export type FilterType =
  | 'select'
  | 'multiSelect'
  | 'boolean'
  | 'date'
  | 'dateRange'
  | 'dateTimeRange'

export type FilterOption = { label: string; value: string }

/** Source of truth: filter type → value shape */
export type FilterValueByType = {
  select: string | null
  multiSelect: string[]
  boolean: boolean | null
  date: string | null
  dateRange: { from: string | null; to: string | null }
  dateTimeRange: { from: string | null; to: string | null }
}

/** Query-param names for range filters (defaults: from / to). */
export type FilterRangeApiKeys = {
  fromKey?: string
  toKey?: string
}

/** Source of truth: filter type → field filter config */
export type FilterConfigByType = {
  select: { type: 'select'; options: FilterOption[] }
  multiSelect: { type: 'multiSelect'; options: FilterOption[] }
  boolean: { type: 'boolean' }
  date: { type: 'date' }
  dateRange: { type: 'dateRange' } & FilterRangeApiKeys
  dateTimeRange: { type: 'dateTimeRange' } & FilterRangeApiKeys
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

/** Flat wire params produced by encodeFilters (ready for most list APIs). */
export type ApiFilters = Record<string, string>

export type FiltersChange = {
  filters: Record<string, FilterValue>
  apiFilters: ApiFilters
}

export type FiltersConfig = {
  filters: Record<string, FilterValue>
  onFiltersChange: (next: FiltersChange) => void
}
