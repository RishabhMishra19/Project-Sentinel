import type {
  ColumnDef,
  PaginationState,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";

export type DataTableColumn<TData> = ColumnDef<TData>;

export interface DataTableRequest {
  page: number;
  size: number;
  search?: string;
  sorting?: SortingState;
  filters?: ColumnFiltersState;
}

export interface DataTableResponse<TData> {
  items: TData[];
  totalItems: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface DataTableState {
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  globalFilter: string;
  rowSelection: Record<string, boolean>;
}

export interface ServerTableProps<TData> {
  columns: DataTableColumn<TData>[];
  fetchData: (request: DataTableRequest) => Promise<DataTableResponse<TData>>;
}

export interface ClientTableProps<TData> {
  columns: DataTableColumn<TData>[];
  data: TData[];
}

export interface DataTableFilterOption {
  label: string;
  value: string;
  icon?: LucideIcon;
}

export interface DataTableFilterConfig {
  /**
   * TanStack column id / accessorKey
   */
  columnId: string;

  /**
   * Label shown on the filter button
   */
  title: string;

  /**
   * Available filter options
   */
  options: DataTableFilterOption[];
}

export interface DataTableAction {
  /**
   * Label shown in the action menu
   */
  label: string;

  /**
   * Optional leading icon
   */
  icon?: LucideIcon;

  /**
   * Called when the action is clicked
   */
  onClick: () => void;

  /**
   * Disable the menu item
   */
  disabled?: boolean;
}
