import type { FilterFieldConfig, FilterValue } from "../types";
import {
  BooleanFilter,
  DateFilter,
  DateRangeFilter,
  DateTimeRangeFilter,
  MultiSelectFilter,
  SelectFilter,
} from "../controls";

type FilterControlProps = {
  filter: FilterFieldConfig;
  value: FilterValue | undefined;
  onChange: (value: FilterValue) => void;
};

export const FilterControl = ({ filter, value, onChange }: FilterControlProps) => {
  switch (filter.type) {
    case "select":
      return (
        <SelectFilter
          options={filter.options}
          value={(value as FilterValue<"select">) ?? null}
          onChange={onChange}
        />
      );
    case "multiSelect":
      return (
        <MultiSelectFilter
          options={filter.options}
          value={(value as FilterValue<"multiSelect">) ?? []}
          onChange={onChange}
        />
      );
    case "boolean":
      return (
        <BooleanFilter value={(value as FilterValue<"boolean">) ?? null} onChange={onChange} />
      );
    case "date":
      return <DateFilter value={(value as FilterValue<"date">) ?? null} onChange={onChange} />;
    case "dateRange":
      return (
        <DateRangeFilter
          value={
            (value as FilterValue<"dateRange">) ?? {
              from: null,
              to: null,
            }
          }
          onChange={onChange}
        />
      );
    case "dateTimeRange":
      return (
        <DateTimeRangeFilter
          value={
            (value as FilterValue<"dateTimeRange">) ?? {
              from: null,
              to: null,
            }
          }
          onChange={onChange}
        />
      );
  }
};
