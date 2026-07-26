import type { ListQueryRequest } from "../../../shared/api/listQueryRequest";
import { toListQueryRequest } from "../../../shared/api/toListQueryRequest";
import type { DataTableQueryState } from "../../../shared/ui/data-table";
import type { UserSearchBy } from "../dto/request/user.request";

const SORTABLE_FIELDS = new Set(["email", "displayName", "status", "createdAt"]);

const isSearchBy = (value: string): value is UserSearchBy =>
  value === "email" || value === "displayName";

export const mapUserListQuery = (state: DataTableQueryState): ListQueryRequest =>
  toListQueryRequest(state, {
    sortableFields: SORTABLE_FIELDS,
    searchBy: { isSearchBy, defaultSearchBy: "email" },
    dayBoundRange: true,
  });
