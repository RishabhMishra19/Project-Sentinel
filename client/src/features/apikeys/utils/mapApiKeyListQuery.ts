import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import { toListQueryRequest } from "../../../shared/api/toListQueryRequest";
import type { DataTableQueryState } from "../../../shared/ui/data-table";

const SORTABLE_FIELDS = new Set(["name", "status", "createdAt", "revokedAt"]);

export const mapApiKeyListQuery = (state: DataTableQueryState): ListQueryRequest =>
  toListQueryRequest(state, {
    sortableFields: SORTABLE_FIELDS,
  });
