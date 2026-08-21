import {
  AppliedFilterChips,
  Filters,
  type FilterField,
  type FiltersConfig,
} from "../../../shared/ui/filters";
import type { AnalyticsScope } from "../dto/request/analytics.request";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";
import { EndpointSelecField } from "./EndpointSelecField";
import { ProductSelecField } from "./ProductSelecField";
import { ScopeSelecField } from "./ScopeSelecField";
import { ServiceSelecField } from "./ServiceSelecField";
import { TenantSelecField } from "./TenantSelecField";

const TABS: { id: AnalyticsScope; label: string }[] = [
  { id: "TENANT", label: "Tenant" },
  { id: "PRODUCT", label: "Product" },
  { id: "SERVICE", label: "Service" },
  { id: "ENDPOINT", label: "Endpoint" },
];

type AnalyticsToolbarProps = {
  // scope: AnalyticsScope;
  scopeReady: boolean;
  // filterFields: FilterField[];
  // filtersConfig: FiltersConfig;
  // onTabChange: (scope: AnalyticsScope) => void;
  onOpenInLogs: () => void;
};

export const AnalyticsToolbar = ({
  // scope,
  scopeReady,
  // filterFields,
  // filtersConfig,
  onOpenInLogs,
}: AnalyticsToolbarProps) => {
  const { scope } = useAnalyticsSearchParams();
  return (
    <>
      <div className="flex flex-wrap gap-2 border-b border-border pb-px">
        <ScopeSelecField />
        {["TENANT", "PRODUCT", "SERVICE", "ENDPOINT"].includes(scope as any) && (
          <TenantSelecField />
        )}
        {["PRODUCT", "SERVICE", "ENDPOINT"].includes(scope as any) && <ProductSelecField />}
        {["SERVICE", "ENDPOINT"].includes(scope as any) && <ServiceSelecField />}
        {["ENDPOINT"].includes(scope as any) && <EndpointSelecField />}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenInLogs}
            disabled={!scopeReady}
            className="inline-flex h-7 items-center gap-1.5 rounded border border-accent bg-accent px-2 text-xs text-accent-foreground hover:opacity-90 disabled:opacity-50"
          >
            Open in Logs
          </button>
          <div className="ml-auto">
            {/* <Filters fields={filterFields} filtersConfig={filtersConfig} /> */}
          </div>
        </div>
        {/* <AppliedFilterChips fields={filterFields} filtersConfig={filtersConfig} /> */}
      </div>
    </>
  );
};
