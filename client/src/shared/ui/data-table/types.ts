import type { ReactNode } from 'react'

export type DataTableFilterType =
  | 'select'
  | 'multiSelect'
  | 'boolean'
  | 'date'
  | 'dateRange'

export type DataTableFilterOption = { label: string; value: string }

/** Source of truth: filter type → value shape */
export type DataTableFilterValueByType = {
  select: string | null
  multiSelect: string[]
  boolean: boolean | null
  date: string | null
  dateRange: { from: string | null; to: string | null }
}

/** Source of truth: filter type → column filter config */
export type DataTableFilterConfigByType = {
  select: { type: 'select'; options: DataTableFilterOption[] }
  multiSelect: { type: 'multiSelect'; options: DataTableFilterOption[] }
  boolean: { type: 'boolean' }
  date: { type: 'date' }
  dateRange: { type: 'dateRange' }
}

export type DataTableFilterValue<F extends DataTableFilterType = DataTableFilterType> =
  DataTableFilterValueByType[F]

export type DataTableColumnFilter<F extends DataTableFilterType = DataTableFilterType> =
  DataTableFilterConfigByType[F]

export type DataTableCellType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'badge'
  | 'custom'

export type DataTableCellValueByType = {
  text: string | null | undefined
  number: number | null | undefined
  date: string | null | undefined
  datetime: string | null | undefined
  boolean: boolean | null | undefined
  badge: string | null | undefined
  custom: never
}

export type DataTableBadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'muted'

/** Source of truth: cell type → column cell config */
export type DataTableCellConfigByType<T extends object> = {
  text: {
    type: 'text'
    getValue: (row: T) => DataTableCellValueByType['text']
  }
  number: {
    type: 'number'
    getValue: (row: T) => DataTableCellValueByType['number']
  }
  date: {
    type: 'date'
    getValue: (row: T) => DataTableCellValueByType['date']
  }
  datetime: {
    type: 'datetime'
    getValue: (row: T) => DataTableCellValueByType['datetime']
  }
  boolean: {
    type: 'boolean'
    getValue: (row: T) => DataTableCellValueByType['boolean']
    trueLabel?: string
    falseLabel?: string
  }
  badge: {
    type: 'badge'
    getValue: (row: T) => DataTableCellValueByType['badge']
    labels?: Record<string, string>
    variants?: Record<string, DataTableBadgeVariant>
  }
  custom: {
    type: 'custom'
    render: (row: T) => ReactNode
  }
}

export type DataTableCellConfig<
  T extends object,
  C extends DataTableCellType = DataTableCellType,
> = DataTableCellConfigByType<T>[C]

export type DataTableColumn<T extends object> = {
  id: string
  header: string
  cell: DataTableCellConfig<T>
  sortable?: boolean
  searchable?: boolean
  filter?: DataTableColumnFilter
}

export type DataTableSort = { id: string; desc: boolean } | null

export type DataTableSearchState = {
  columnId: string
  value: string
}

export type RowAction<T extends object> = {
  id: string
  label: string
  onClick: (row: T) => void
  variant?: 'default' | 'danger'
  hidden?: (row: T) => boolean
  disabled?: (row: T) => boolean
}

export type DataTablePagination = {
  pageIndex: number
  pageSize: number
  totalElements: number
  onPageIndexChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export type DataTableSortingConfig = {
  sorting: DataTableSort
  onSortingChange: (next: DataTableSort) => void
}

export type DataTableSearchConfig = {
  search: DataTableSearchState
  onSearchChange: (next: DataTableSearchState) => void
}

export type DataTableFiltersConfig = {
  filters: Record<string, DataTableFilterValue>
  onFiltersChange: (next: Record<string, DataTableFilterValue>) => void
  onFiltersClear: () => void
}

export type DataTableProps<T extends object> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string

  sortingConfig?: DataTableSortingConfig
  searchConfig?: DataTableSearchConfig
  filtersConfig?: DataTableFiltersConfig
  pagination?: DataTablePagination

  rowActions?: RowAction<T>[]
  toolbarActions?: ReactNode

  isLoading?: boolean
  emptyMessage?: string
}
