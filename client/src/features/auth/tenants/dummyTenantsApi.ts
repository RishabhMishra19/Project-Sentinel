import type { DataTableQueryState } from '../../../shared/ui/data-table'
import { applyClientFilters } from '../../../shared/ui/data-table/hooks/applyClientFilters'
import { getCellComparableValue } from '../../../shared/ui/data-table/hooks/getCellValue'
import { DUMMY_TENANTS, type DummyTenant } from './dummyTenantsData'
import { tenantColumns } from './tenantsTableConfig'

export type DummyTenantsPage = {
  content: DummyTenant[]
  page: number
  size: number
  totalElements: number
}

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

const sortTenants = (
  rows: DummyTenant[],
  sorting: DataTableQueryState['sorting'],
): DummyTenant[] => {
  if (!sorting) {
    return rows
  }

  const column = tenantColumns.find((item) => item.id === sorting.id)
  if (!column) {
    return rows
  }

  const sorted = [...rows]
  const dir = sorting.desc ? -1 : 1

  sorted.sort((left, right) => {
    const a = getCellComparableValue(left, column)
    const b = getCellComparableValue(right, column)
    if (a == null && b == null) {
      return 0
    }
    if (a == null) {
      return 1
    }
    if (b == null) {
      return -1
    }
    if (a === b) {
      return 0
    }
    return a > b ? dir : -dir
  })

  return sorted
}

/** Fake server list API — applies search/filters/sort/page with latency. */
export const listDummyTenants = async (
  query: DataTableQueryState,
): Promise<DummyTenantsPage> => {
  await delay(450)

  const filtered = applyClientFilters(
    DUMMY_TENANTS,
    tenantColumns,
    query.search,
    query.filters,
  )
  const sorted = sortTenants(filtered, query.sorting)
  const start = query.pageIndex * query.pageSize
  const content = sorted.slice(start, start + query.pageSize)

  return {
    content,
    page: query.pageIndex,
    size: query.pageSize,
    totalElements: sorted.length,
  }
}

export const listAllDummyTenants = async (): Promise<DummyTenant[]> => {
  await delay(250)
  return [...DUMMY_TENANTS]
}
