import { inputClassName } from "../styles";
import type { FilterOption, FilterValue } from "../types";

type SelectFilterProps = {
  value: FilterValue<"select">;
  options: FilterOption[];
  onChange: (value: FilterValue<"select">) => void;
};

export const SelectFilter = ({ value, options, onChange }: SelectFilterProps) => (
  <select
    className={`${inputClassName} w-full`}
    value={value ?? ""}
    onChange={(event) => onChange(event.target.value || null)}
  >
    <option value="">Any</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
