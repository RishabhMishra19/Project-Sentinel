import type { ReactNode } from "react";
import type { FilterFieldConfig, FiltersConfig } from "../filters";
import type { CursorPageResponse } from "../../dto/response/CursorPageResponse";

export type DataTableCellType =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "boolean"
  | "badge"
  | "custom";

export type DataTableCellValueByType = {
  text: string | null | undefined;
  number: number | null | undefined;
  date: string | null | undefined;
  datetime: string | null | undefined;
  boolean: boolean | null | undefined;
  badge: string | null | undefined;
  custom: never;
};

export type DataTableBadgeVariant = "default" | "success" | "warning" | "danger" | "muted";

/** Source of truth: cell type → column cell config */
export type DataTableCellConfigByType<T extends object> = {
  text: {
    type: "text";
    getValue: (row: T) => DataTableCellValueByType["text"];
  };
  number: {
    type: "number";
    getValue: (row: T) => DataTableCellValueByType["number"];
  };
  date: {
    type: "date";
    getValue: (row: T) => DataTableCellValueByType["date"];
  };
  datetime: {
    type: "datetime";
    getValue: (row: T) => DataTableCellValueByType["datetime"];
  };
  boolean: {
    type: "boolean";
    getValue: (row: T) => DataTableCellValueByType["boolean"];
    trueLabel?: string;
    falseLabel?: string;
  };
  badge: {
    type: "badge";
    getValue: (row: T) => DataTableCellValueByType["badge"];
    labels?: Record<string, string>;
    variants?: Record<string, DataTableBadgeVariant>;
  };
  custom: {
    type: "custom";
    render: (row: T) => ReactNode;
  };
};

export type DataTableCellConfig<
  T extends object,
  C extends DataTableCellType = DataTableCellType,
> = DataTableCellConfigByType<T>[C];

export type DataTableColumn<T extends object> = {
  id: string;
  header: string;
  cell: DataTableCellConfig<T>;
  sortable?: boolean;
  searchable?: boolean;
  filter?: FilterFieldConfig;
  visible?: boolean;
};

export type DataTableSort = { id: string; desc: boolean } | null;

export type DataTableSearchState = {
  columnId: string;
  value: string;
};

export type RowAction<T extends object> = {
  id: string;
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "danger";
  hidden?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
};

export type ServerCursorPagination = {
  startCursor?: string;
  endCursor?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  onNextPage: (afterCursor: string) => void;
  onPrevPage: (beforeCursor: string) => void;
};

export type DataTablePagination = {
  pageIndex: number;
  pageSize: number;
  totalElements: number;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export type DataTableSortingConfig = {
  sorting: DataTableSort;
  onSortingChange: (next: DataTableSort) => void;
};

export type DataTableSearchConfig = {
  search: DataTableSearchState;
  onSearchChange: (next: DataTableSearchState) => void;
  /** Delay before committing typed search. Defaults to 300ms in DataTableSearch. */
  debounceMs?: number;
};

export type DataTableProps<T extends object> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;

  sortingConfig?: DataTableSortingConfig;
  searchConfig?: DataTableSearchConfig;
  filtersConfig?: FiltersConfig;
  pagination?: DataTablePagination;
  cursorPagination?: ServerCursorPagination;
  onScrollEnd?: () => void;

  rowActions?: RowAction<T>[];
  toolbarActions?: ReactNode;

  isLoading?: boolean;
  emptyMessage?: string;
};
