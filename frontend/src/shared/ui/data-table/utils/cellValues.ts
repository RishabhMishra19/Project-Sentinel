import type { DataTableColumn } from "../types";

export const getCellComparableValue = <T extends object>(
  row: T,
  column: DataTableColumn<T>,
): string | number | boolean | null => {
  const cell = column.cell;
  if (cell.type === "custom") {
    return null;
  }

  const value = cell.getValue(row);
  if (value == null) {
    return null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  return String(value);
};

export const getCellSearchText = <T extends object>(row: T, column: DataTableColumn<T>): string => {
  const value = getCellComparableValue(row, column);
  if (value == null) {
    return "";
  }
  return String(value);
};
