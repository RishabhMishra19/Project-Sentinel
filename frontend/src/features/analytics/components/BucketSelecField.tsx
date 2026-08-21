import { SelectFilter } from "../../../shared/ui/filters/controls";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";
import { FilterSelectWrapper } from "./FilterSelectWrapper";

const BUCKETS = [
  { value: "MINUTE", label: "Minute" },
  { value: "HOUR", label: "Hour" },
  { value: "DAY", label: "Day" },
];

export const BucketSelecField = () => {
  const { bucket, mergeParams } = useAnalyticsSearchParams();

  return (
    <FilterSelectWrapper label="Bucket">
      <SelectFilter
        value={bucket}
        options={BUCKETS}
        onChange={(val) => mergeParams({ bucket: val })}
      />
    </FilterSelectWrapper>
  );
};
