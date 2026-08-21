import { PageContent } from "../../../shared/layout/PageContent";
import { AnalyticsResults } from "../components/AnalyticsResults";
import { AnalyticsToolbar } from "../components/AnalyticsToolbar";

export const AnalyticsPage = () => {
  return (
    <PageContent className="m-0 p-0">
      <AnalyticsToolbar />
      <AnalyticsResults />
    </PageContent>
  );
};
