import { mapListQueryMeta, type DataTableQueryState } from "../../../shared/ui/data-table";
import type { ServiceListParams, ServiceSearchBy } from "../dto/request/service.request";

const SORTABLE_FIELDS = new Set(["name", "status", "createdAt"]);

const isSearchBy = (value: string): value is ServiceSearchBy => value === "name";

export const mapServiceListQuery = (state: DataTableQueryState): ServiceListParams =>
  ({
    ...mapListQueryMeta(state, SORTABLE_FIELDS, {
      isSearchBy,
      defaultSearchBy: "name",
    }),
    ...state.apiFilters,
  }) as ServiceListParams;
