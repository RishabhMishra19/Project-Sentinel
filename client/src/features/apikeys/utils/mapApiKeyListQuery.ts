import {
  mapListQueryMeta,
  type DataTableQueryState,
} from '../../../shared/ui/data-table'
import type { ServiceApiKeyListParams } from '../dto/request/apikey.request'

const SORTABLE_FIELDS = new Set(['name', 'status', 'createdAt', 'revokedAt'])

export const mapApiKeyListQuery = (
  state: DataTableQueryState,
): ServiceApiKeyListParams =>
  ({
    ...mapListQueryMeta(state, SORTABLE_FIELDS),
    ...state.apiFilters,
  }) as ServiceApiKeyListParams
