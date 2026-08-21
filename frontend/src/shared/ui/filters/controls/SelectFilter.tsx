import { TooltipWrapper } from "../../TooltipWrapper";
import { inputClassName } from "../styles";
import type { FilterOption, FilterValue } from "../types";

type SelectFilterProps = {
  value: FilterValue<"select">;
  options: FilterOption[];
  onChange: (value: FilterValue<"select">) => void;
  disabled?: boolean;
};

export const SelectFilter = ({ value, options, onChange, disabled = false }: SelectFilterProps) => (
  <TooltipWrapper value={options.find((option) => option.value === value)?.label ?? "Any"}>
    <select
      className={`${inputClassName} w-full`}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value || null)}
      disabled={disabled}
    >
      <option key="any" value={undefined}>
        Any
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </TooltipWrapper>
);
