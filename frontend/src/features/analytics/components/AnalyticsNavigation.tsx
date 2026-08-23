import { ChevronRightIcon } from "../../../assets/icons";
import type { AnalyticsScopeType } from "../dto/request/analytics.request";
import { useAnalyticsUrlState } from "../hooks/useAnalyticsUrlState";
import { AnalyticsScope } from "../utils/analytics.constants";

export const AnalyticsNavigation = () => {
  const {
    selectedTenant,
    selectedProduct,
    selectedService,
    selectedEndpoint,
    updateState,
    validState,
  } = useAnalyticsUrlState();

  const onClick = (scope: AnalyticsScopeType) => {
    if (scope === validState.scope) return;
    switch (scope) {
      case AnalyticsScope.TENANT: {
        updateState({
          ...validState,
          scope: "TENANT",
          productId: null,
          serviceId: null,
          endpointId: null,
        });
        break;
      }
      case AnalyticsScope.PRODUCT: {
        updateState({
          ...validState,
          scope: "PRODUCT",
          serviceId: null,
          endpointId: null,
        } as typeof validState);
        break;
      }
      case AnalyticsScope.SERVICE: {
        updateState({
          ...validState,
          scope: "SERVICE",
          endpointId: null,
        } as typeof validState);
        break;
      }
    }
  };

  return (
    <nav className="flex items-center gap-0 text-sm">
      <span
        className="rounded px-1.5 py-1 text-muted-foreground  cursor-pointer text-blue-400 font-bold hover:bg-blue-50"
        onClick={(e) => onClick(AnalyticsScope.TENANT)}
      >
        {selectedTenant}
      </span>

      <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/40" />

      {selectedProduct && (
        <>
          <span
            className="rounded px-1.5 py-1 text-muted-foreground cursor-pointer text-blue-400 font-bold hover:bg-blue-50"
            onClick={(e) => onClick(AnalyticsScope.PRODUCT)}
          >
            {selectedProduct}
          </span>
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/40" />

          {selectedService && (
            <>
              <span
                className="rounded px-1.5 py-1 text-muted-foreground  cursor-pointer text-blue-400 font-bold hover:bg-blue-50"
                onClick={(e) => onClick(AnalyticsScope.SERVICE)}
              >
                {selectedService}
              </span>
              <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/40" />

              {selectedEndpoint && (
                <>
                  <span className="rounded px-1.5 py-1 font-medium text-foreground  cursor-pointer text-blue-400 font-bold text-underline">
                    {selectedEndpoint}
                  </span>
                  <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/40" />
                </>
              )}
            </>
          )}
        </>
      )}
    </nav>
  );
};
