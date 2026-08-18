import { buttonClassName } from "../styles";
import type { FilterValue } from "../types";

type BooleanFilterProps = {
  value: FilterValue<"boolean">;
  onChange: (value: FilterValue<"boolean">) => void;
};

const options: { label: string; value: FilterValue<"boolean"> }[] = [
  { label: "Any", value: null },
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export const BooleanFilter = ({ value, onChange }: BooleanFilterProps) => (
  <div className="flex gap-1">
    {options.map((option) => {
      const active = value === option.value;
      return (
        <button
          key={String(option.value)}
          type="button"
          className={`${buttonClassName} ${
            active ? "border-accent bg-accent-soft text-accent" : ""
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);
