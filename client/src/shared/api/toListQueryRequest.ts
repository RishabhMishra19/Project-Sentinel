import type { DataTableQueryState } from "../ui/data-table";
import type { ListQueryRequest } from "./listQueryRequest";

type SearchByOptions<T extends string> = {
  isSearchBy: (value: string) => value is T;
  defaultSearchBy: T;
};

type ToListQueryOptions<TSearchBy extends string = string> = {
  sortableFields: Set<string>;
  searchBy?: SearchByOptions<TSearchBy>;
  /** When true, YYYY-MM-DD from/to become day-bound Instants (CRUD createdAt). */
  dayBoundRange?: boolean;
  /** Filter keys promoted to top-level from/to (defaults: from, to). */
  rangeKeys?: { fromKey?: string; toKey?: string };
  defaultSort?: { fieldName: string; desc?: boolean };
};

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const toDayStartIso = (value: string): string => {
  if (DATE_ONLY.test(value)) {
    return new Date(`${value}T00:00:00.000Z`).toISOString();
  }
  return new Date(value).toISOString();
};

const toExclusiveDayEndIso = (value: string): string => {
  if (DATE_ONLY.test(value)) {
    const d = new Date(`${value}T00:00:00.000Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString();
  }
  return new Date(value).toISOString();
};

const splitValues = (raw: string): string[] =>
  raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

/**
 * Maps data-table query state into the shared POST /search ListQueryRequest body.
 */
export const toListQueryRequest = <TSearchBy extends string = string>(
  state: DataTableQueryState,
  options: ToListQueryOptions<TSearchBy>,
): ListQueryRequest => {
  const fromKey = options.rangeKeys?.fromKey ?? "from";
  const toKey = options.rangeKeys?.toKey ?? "to";
  const body: ListQueryRequest = {
    pageable: {
      page: state.pageIndex,
      size: state.pageSize,
    },
    sortConfigs: [],
    searchConfigs: [],
    filterConfigs: [],
  };

  if (state.sorting && options.sortableFields.has(state.sorting.id)) {
    body.sortConfigs = [
      {
        fieldName: state.sorting.id,
        sortDirection: state.sorting.desc ? "DESC" : "ASC",
      },
    ];
  } else if (options.defaultSort) {
    body.sortConfigs = [
      {
        fieldName: options.defaultSort.fieldName,
        sortDirection: options.defaultSort.desc === false ? "ASC" : "DESC",
      },
    ];
  }

  if (options.searchBy) {
    const q = state.search.value.trim();
    if (q) {
      const fieldName = options.searchBy.isSearchBy(state.search.columnId)
        ? state.search.columnId
        : options.searchBy.defaultSearchBy;
      body.searchConfigs = [{ fieldName, searchValues: [q] }];
    }
  }

  const apiFilters = state.apiFilters ?? {};
  const fromRaw = apiFilters[fromKey];
  const toRaw = apiFilters[toKey];
  if (fromRaw) {
    body.from = options.dayBoundRange ? toDayStartIso(fromRaw) : fromRaw;
  }
  if (toRaw) {
    body.to = options.dayBoundRange ? toExclusiveDayEndIso(toRaw) : toRaw;
  }

  for (const [key, value] of Object.entries(apiFilters)) {
    if (key === fromKey || key === toKey || !value) continue;
    body.filterConfigs!.push({
      fieldName: key,
      filterValues: splitValues(value),
    });
  }

  return body;
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
