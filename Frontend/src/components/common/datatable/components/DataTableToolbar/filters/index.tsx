import type { ComponentType } from "react";
import type { Column } from "@tanstack/react-table";

import { BooleanFilter } from "./BooleanFilter";
import { DateFilter } from "./DateFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import { SelectFilter } from "./SelectFilter";

export interface FilterComponentProps<TData> {
  column: Column<TData, unknown>;
}

export const FILTER_COMPONENTS = {
  select: SelectFilter,
  boolean: BooleanFilter,
  date: DateFilter,
  "date-range": DateRangeFilter,
} satisfies Record<string, ComponentType<FilterComponentProps<any>>>;
