import { PRESET_SUMMARY, matchDateRangePreset } from "./controls/DateRangeFilter";
import { DATE_TIME_PRESET_SUMMARY, matchDateTimeRangePreset } from "./controls/DateTimeRangeFilter";
import type { FilterField, FilterFieldConfig, FilterValue } from "./types";

export type FilterChip = {
  id: string;
  header: string;
  label: string;
};

export const isFilterActive = (
  filter: FilterFieldConfig,
  value: FilterValue | undefined,
): boolean => {
  if (value === undefined || value === null) {
    return false;
  }
  switch (filter.type) {
    case "select":
    case "boolean":
    case "date":
      return value !== null && value !== "";
    case "multiSelect":
      return Array.isArray(value) && value.length > 0;
    case "dateRange": {
      const range = value as FilterValue<"dateRange">;
      return Boolean(range.from || range.to);
    }
    case "dateTimeRange": {
      const range = value as FilterValue<"dateTimeRange">;
      return Boolean(range.from || range.to);
    }
  }
};

export const formatFilterValue = (
  filter: FilterFieldConfig,
  value: FilterValue | undefined,
): string | null => {
  if (!isFilterActive(filter, value)) {
    return null;
  }

  switch (filter.type) {
    case "select": {
      const selected = value as FilterValue<"select">;
      return filter.options.find((option) => option.value === selected)?.label ?? selected;
    }
    case "multiSelect": {
      const selected = value as FilterValue<"multiSelect">;
      return selected
        .map((item) => filter.options.find((option) => option.value === item)?.label ?? item)
        .join(", ");
    }
    case "boolean": {
      const bool = value as FilterValue<"boolean">;
      if (bool === true) {
        return "Yes";
      }
      if (bool === false) {
        return "No";
      }
      return null;
    }
    case "date":
      return value as FilterValue<"date">;
    case "dateRange": {
      const range = value as FilterValue<"dateRange">;
      const preset = matchDateRangePreset(range);
      if (preset) {
        return PRESET_SUMMARY[preset];
      }
      if (range.from && range.to) {
        return `${range.from} – ${range.to}`;
      }
      if (range.from) {
        return `From ${range.from}`;
      }
      if (range.to) {
        return `Until ${range.to}`;
      }
      return null;
    }
    case "dateTimeRange": {
      const range = value as FilterValue<"dateTimeRange">;
      const preset = matchDateTimeRangePreset(range);
      if (preset) {
        return DATE_TIME_PRESET_SUMMARY[preset];
      }
      if (range.from && range.to) {
        return `${range.from} – ${range.to}`;
      }
      if (range.from) {
        return `From ${range.from}`;
      }
      if (range.to) {
        return `Until ${range.to}`;
      }
      return null;
    }
  }
};

export const toFilterFields = <
  T extends { id: string; header: string; filter?: FilterFieldConfig },
>(
  columns: T[],
): FilterField[] =>
  columns.flatMap((column) =>
    column.filter != null ? [{ id: column.id, header: column.header, filter: column.filter }] : [],
  );

export const countActiveFilters = (
  fields: FilterField[],
  filters: Record<string, FilterValue>,
): number => fields.filter((field) => isFilterActive(field.filter, filters[field.id])).length;

export const collectActiveFilters = (
  fields: FilterField[],
  draft: Record<string, FilterValue>,
): Record<string, FilterValue> => {
  const next: Record<string, FilterValue> = {};
  for (const field of fields) {
    if (isFilterActive(field.filter, draft[field.id])) {
      next[field.id] = draft[field.id];
    }
  }
  return next;
};

export const buildFilterChips = (
  fields: FilterField[],
  filters: Record<string, FilterValue>,
): FilterChip[] =>
  fields.flatMap((field) => {
    const label = formatFilterValue(field.filter, filters[field.id]);
    if (!label) {
      return [];
    }
    return [{ id: field.id, header: field.header, label }];
  });
