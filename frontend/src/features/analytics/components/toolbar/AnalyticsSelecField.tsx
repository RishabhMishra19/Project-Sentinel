import { SelectFilter } from "../../../../shared/ui/filters/controls";
import { FilterSelectWrapper } from "./FilterSelectWrapper";

type AnalyticsSelecFieldProps = {
  label: string;
  val: string;
  onChange: (newVal: string) => void;
  options: { label: string; value: string }[];
};

export const AnalyticsSelecField = ({
  label,
  val,
  onChange,
  options,
}: AnalyticsSelecFieldProps) => {
  return (
    <FilterSelectWrapper label={label}>
      <SelectFilter
        value={val}
        options={options}
        onChange={(newVal) => newVal && onChange(newVal)}
        classname="text-xs h-6"
        hideAnyOption={true}
      />
    </FilterSelectWrapper>
  );
};
