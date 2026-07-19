import ExampleDatatable from "@/components/common/datatable/Example";
import { Page } from "@/components/page/Page";
import { PageHeader } from "@/components/page/PageHeader";

export default function DashboardPage() {
  return (
    <Page>
      <PageHeader title="Dashboard" />
      <ExampleDatatable />
    </Page>
  );
}
