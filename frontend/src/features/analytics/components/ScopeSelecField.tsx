import { SelectField } from "../../../shared/forms/SelectField";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";

const SCOPES = [
  { value: "TENANT", label: "Tenant" },
  { value: "PRODUCT", label: "Product" },
  { value: "SERVICE", label: "Service" },
  { value: "ENDPOINT", label: "Endpoint" },
];

export const ScopeSelecField = () => {
  const { scope, mergeParams } = useAnalyticsSearchParams();

  return (
    <SelectField
      className="min-w-[12rem]"
      value={scope ?? undefined}
      onChange={(event) => mergeParams({ scope: event.target.value })}
      aria-label="Filter API keys by service"
      emptyPlaceholder="No services"
      options={SCOPES}
    />
  );
};
