import type { DataTableColumn, DataTableSort } from "../types";
import { getCellComparableValue } from "./cellValues";

const compareValues = (
  a: string | number | boolean | null,
  b: string | number | boolean | null,
): number => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  if (typeof a === "boolean" && typeof b === "boolean") {
    return Number(a) - Number(b);
  }

  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
};

export const sortClientRows = <T extends object>(
  rows: T[],
  columns: DataTableColumn<T>[],
  sorting: DataTableSort,
): T[] => {
  if (!sorting) {
    return rows;
  }

  const column = columns.find((item) => item.id === sorting.id);
  if (!column?.sortable) {
    return rows;
  }

  const sorted = [...rows];
  sorted.sort((left, right) => {
    const result = compareValues(
      getCellComparableValue(left, column),
      getCellComparableValue(right, column),
    );
    return sorting.desc ? -result : result;
  });
  return sorted;
};

export const paginateClientRows = <T extends object>(
  rows: T[],
  pageIndex: number,
  pageSize: number,
): T[] => {
  const start = pageIndex * pageSize;
  return rows.slice(start, start + pageSize);
};
