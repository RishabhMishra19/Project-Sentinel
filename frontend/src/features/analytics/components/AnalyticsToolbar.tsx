import {
  AppliedFilterChips,
  Filters,
  type FilterField,
  type FiltersConfig,
} from "../../../shared/ui/filters";
import type { AnalyticsScope } from "../dto/request/analytics.request";

const TABS: { id: AnalyticsScope; label: string }[] = [
  { id: "TENANT", label: "Tenant" },
  { id: "PRODUCT", label: "Product" },
  { id: "SERVICE", label: "Service" },
  { id: "ENDPOINT", label: "Endpoint" },
];

type AnalyticsToolbarProps = {
  scope: AnalyticsScope;
  scopeReady: boolean;
  filterFields: FilterField[];
  filtersConfig: FiltersConfig;
  onTabChange: (scope: AnalyticsScope) => void;
  onOpenInLogs: () => void;
};

export const AnalyticsToolbar = ({
  scope,
  scopeReady,
  filterFields,
  filtersConfig,
  onTabChange,
  onOpenInLogs,
}: AnalyticsToolbarProps) => {
  return (
    <>
      <div className="flex flex-wrap gap-2 border-b border-border pb-px">
        {TABS.map((tab) => {
          const active = scope === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
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
            <Filters fields={filterFields} filtersConfig={filtersConfig} />
          </div>
        </div>
        <AppliedFilterChips fields={filterFields} filtersConfig={filtersConfig} />
      </div>
    </>
  );
};
