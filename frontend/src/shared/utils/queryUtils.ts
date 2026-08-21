import type { ListQueryRequest } from "../dto/request/listQueryRequest";
import type { DataTableColumn, DataTableQueryState } from "../ui/data-table";
import { applyClientFilters } from "../ui/data-table/utils/clientFiltering";
import { paginateClientRows, sortClientRows } from "../ui/data-table/utils/clientRows";
import { toDayStartIso, toExclusiveDayEndIso } from "./dateUtils";

const splitValues = (raw: string): string[] =>
  raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

/**
 * Maps data-table query state → shared POST /search ListQueryRequest.
 * YYYY-MM-DD from/to are day-bounded to Instants; already-ISO values pass through.
 */
export const toListQueryRequest = (state: DataTableQueryState): ListQueryRequest => {
  const body: ListQueryRequest = {
    pageable: {
      page: state.pageIndex,
      size: state.pageSize,
    },
    sortConfigs: [],
    searchConfigs: [],
    filterConfigs: [],
  };

  if (state.sorting) {
    body.sortConfigs = [
      {
        fieldName: state.sorting.id,
        sortDirection: state.sorting.desc ? "DESC" : "ASC",
      },
    ];
  }

  const q = state.search.value.trim();
  if (q && state.search.columnId) {
    body.searchConfigs = [{ fieldName: state.search.columnId, searchValues: [q] }];
  }

  const apiFilters = state.apiFilters ?? {};
  if (apiFilters.from) {
    body.from = toDayStartIso(apiFilters.from);
  }
  if (apiFilters.to) {
    body.to = toExclusiveDayEndIso(apiFilters.to);
  }

  for (const [key, value] of Object.entries(apiFilters)) {
    if (key === "from" || key === "to" || !value) continue;
    body.filterConfigs!.push({
      fieldName: key,
      filterValues: splitValues(value),
    });
  }

  return body;
};

/** Apply client-side filter → sort → paginate for a data-table query. */
export const applyQueryOnData = <T extends object>(
  data: T[],
  columns: DataTableColumn<T>[],
  query: DataTableQueryState,
  options?: { enablePagination?: boolean },
): { rows: T[]; totalElements: number } => {
  const enablePagination = options?.enablePagination ?? true;
  const filtered = applyClientFilters(data, columns, query.search, query.filters);
  const sorted = sortClientRows(filtered, columns, query.sorting);
  const totalElements = sorted.length;
  const rows = enablePagination
    ? paginateClientRows(sorted, query.pageIndex, query.pageSize)
    : sorted;

  return { rows, totalElements };
};

/** Build ListQueryRequest for analytics-style typed params. */
export const analyticsParamsToListQuery = (params: {
  scope: string;
  bucket: string;
  from: string;
  to: string;
  productId?: string;
  serviceId?: string;
  endpointId?: string;
  sortBy?: string;
  page?: number;
  size?: number;
}): ListQueryRequest => {
  const filterConfigs = [
    { fieldName: "scope", filterValues: [params.scope] },
    { fieldName: "bucket", filterValues: [params.bucket] },
  ];
  if (params.productId) {
    filterConfigs.push({ fieldName: "productId", filterValues: [params.productId] });
  }
  if (params.serviceId) {
    filterConfigs.push({ fieldName: "serviceId", filterValues: [params.serviceId] });
  }
  if (params.endpointId) {
    filterConfigs.push({ fieldName: "endpointId", filterValues: [params.endpointId] });
  }
  if (params.sortBy) {
    filterConfigs.push({ fieldName: "sortBy", filterValues: [params.sortBy] });
  }

  return {
    pageable: {
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
    filterConfigs,
    from: params.from,
    to: params.to,
  };
};
