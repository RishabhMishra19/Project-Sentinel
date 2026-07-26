export type SortDirection = 'ASC' | 'DESC'

export type ListQuerySortConfig = {
  fieldName: string
  sortDirection: SortDirection
}

export type ListQuerySearchConfig = {
  fieldName: string
  searchValues: string[]
}

export type ListQueryFilterConfig = {
  fieldName: string
  filterValues: string[]
}

export type ListQueryRequest = {
  pageable?: { page: number; size: number }
  sortConfigs?: ListQuerySortConfig[]
  searchConfigs?: ListQuerySearchConfig[]
  filterConfigs?: ListQueryFilterConfig[]
  from?: string
  to?: string
}
