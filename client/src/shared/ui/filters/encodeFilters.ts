import { isFilterActive } from "./filterUtils";
import type { ApiFilters, FilterField, FilterValue } from "./types";

const isRange = (value: unknown): value is { from: string | null; to: string | null } =>
  value != null && typeof value === "object" && "from" in value && "to" in value;

/** datetime-local / Date-parseable string → ISO Instant, or null if invalid. */
const toIsoInstant = (value: string): string | null => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

const rangeKeys = (field: FilterField): { fromKey: string; toKey: string } => {
  if (field.filter.type === "dateRange" || field.filter.type === "dateTimeRange") {
    return {
      fromKey: field.filter.fromKey ?? "from",
      toKey: field.filter.toKey ?? "to",
    };
  }
  return { fromKey: "from", toKey: "to" };
};

/**
 * Standard UI filter → flat query-param encoding.
 * Field ids become param names; date(Time)Range expands to fromKey/toKey.
 */
export const encodeFilters = (
  fields: FilterField[],
  filters: Record<string, FilterValue>,
): ApiFilters => {
  const apiFilters: ApiFilters = {};

  for (const field of fields) {
    const value = filters[field.id];
    if (!isFilterActive(field.filter, value)) {
      continue;
    }

    switch (field.filter.type) {
      case "select": {
        const selected = value as FilterValue<"select">;
        if (selected) apiFilters[field.id] = selected;
        break;
      }
      case "multiSelect": {
        const selected = value as FilterValue<"multiSelect">;
        if (selected.length > 0) {
          apiFilters[field.id] = selected.join(",");
        }
        break;
      }
      case "boolean": {
        const bool = value as FilterValue<"boolean">;
        if (bool !== null) {
          apiFilters[field.id] = bool ? "true" : "false";
        }
        break;
      }
      case "date": {
        const date = value as FilterValue<"date">;
        if (date) apiFilters[field.id] = date;
        break;
      }
      case "dateRange": {
        if (!isRange(value)) break;
        const { fromKey, toKey } = rangeKeys(field);
        // Keep YYYY-MM-DD for LocalDate APIs.
        if (value.from) apiFilters[fromKey] = value.from;
        if (value.to) apiFilters[toKey] = value.to;
        break;
      }
      case "dateTimeRange": {
        if (!isRange(value)) break;
        const { fromKey, toKey } = rangeKeys(field);
        // datetime-local UI value → ISO Instant for Instant APIs.
        if (value.from) {
          const iso = toIsoInstant(value.from);
          if (iso) apiFilters[fromKey] = iso;
        }
        if (value.to) {
          const iso = toIsoInstant(value.to);
          if (iso) apiFilters[toKey] = iso;
        }
        break;
      }
    }
  }

  return apiFilters;
};
