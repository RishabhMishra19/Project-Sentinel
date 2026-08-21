import { SelectFilter } from "../../../shared/ui/filters/controls";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";
import { FilterSelectWrapper } from "./FilterSelectWrapper";

const SCOPES = [
  { value: "TENANT", label: "Tenant" },
  { value: "PRODUCT", label: "Product" },
  { value: "SERVICE", label: "Service" },
  { value: "ENDPOINT", label: "Endpoint" },
];

export const ScopeSelecField = () => {
  const { scope, mergeParams } = useAnalyticsSearchParams();

  return (
    <FilterSelectWrapper label="Scope">
      <SelectFilter
        value={scope}
        options={SCOPES}
        onChange={(val) => mergeParams({ scope: val })}
      />
    </FilterSelectWrapper>
  );
};
