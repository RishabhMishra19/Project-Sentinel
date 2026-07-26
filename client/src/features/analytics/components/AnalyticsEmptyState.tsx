import type { AnalyticsScope } from "../dto/request/analytics.request";

export const AnalyticsEmptyState = ({ scope }: { scope: AnalyticsScope }) => {
  return (
    <div className="rounded-xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
      {scope === "PRODUCT" && "Select a product to view analytics."}
      {scope === "SERVICE" && "Select a service to view analytics."}
      {scope === "ENDPOINT" && "Select a service and endpoint to view analytics."}
    </div>
  );
};
