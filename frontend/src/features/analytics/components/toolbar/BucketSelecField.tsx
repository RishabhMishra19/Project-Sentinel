import { SelectFilter } from "../../../shared/ui/filters/controls";
import { BUCKET_OPTIONS } from "../utils/analytics.constants";
import { FilterSelectWrapper } from "./toolbar/FilterSelectWrapper";

type BucketSelecFieldProps = {
  val: string;
  onChange: (newVal: string) => void;
};

export const BucketSelecField = ({ val, onChange }: BucketSelecFieldProps) => {
  return (
    <FilterSelectWrapper label="Bucket">
      <SelectFilter
        value={val}
        options={BUCKET_OPTIONS}
        onChange={(newVal) => newVal && onChange(newVal)}
        classname="text-xs h-6"
      />
    </FilterSelectWrapper>
  );
};
