import type { ApiFilters, FilterFieldConfig, FilterValue } from "../../filters";
import { encodeFilters, toFilterFields } from "../../filters";
import type { DataTableSearchState, DataTableSort } from "../types";

export type DataTableQueryState = {
  pageIndex: number;
  pageSize: number;
  cursor?: string;
  cursorType?: "FORWARD" | "BACKWARD";
  sorting: DataTableSort;
  search: DataTableSearchState;
  filters: Record<string, FilterValue>;
  /** Encoded wire params from active filters (via encodeFilters). */
  apiFilters: ApiFilters;
};

export const DEFAULT_PAGE_SIZE = 10;

export const createInitialQueryState = (
  columns: {
    id: string;
    header: string;
    searchable?: boolean;
    filter?: FilterFieldConfig;
  }[],
  initial?: Partial<DataTableQueryState>,
): DataTableQueryState => {
  const firstSearchable = columns.find((column) => column.searchable)?.id ?? "";
  const filters = initial?.filters ?? {};
  const fields = toFilterFields(columns);
  const apiFilters = initial?.apiFilters ?? encodeFilters(fields, filters);

  return {
    pageIndex: initial?.pageIndex ?? 0,
    pageSize: initial?.pageSize ?? DEFAULT_PAGE_SIZE,
    sorting: initial?.sorting ?? null,
    search: initial?.search ?? { columnId: firstSearchable, value: "" },
    filters,
    apiFilters,
  };
};
