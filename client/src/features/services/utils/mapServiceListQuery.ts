import type { ListQueryRequest } from '../../../shared/api/listQueryRequest'
import { toListQueryRequest } from '../../../shared/api/toListQueryRequest'
import type { DataTableQueryState } from '../../../shared/ui/data-table'
import type { ServiceSearchBy } from '../dto/request/service.request'

const SORTABLE_FIELDS = new Set(['name', 'status', 'createdAt'])

const isSearchBy = (value: string): value is ServiceSearchBy => value === 'name'

export const mapServiceListQuery = (
  state: DataTableQueryState,
): ListQueryRequest =>
  toListQueryRequest(state, {
    sortableFields: SORTABLE_FIELDS,
    searchBy: { isSearchBy, defaultSearchBy: 'name' },
    dayBoundRange: true,
  })
