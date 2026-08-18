import { useMemo } from "react";
import { DataTable, useDataTable } from "../../../shared/ui/data-table";
import { primaryButtonClassName } from "../../../shared/ui/data-table/styles";
import type { TenantResponse } from "../dto/response/tenant.response";
import { useTenantsQuery } from "../hooks/useTenants";
import { createTenantRowActions, tenantColumns } from "./tenantsTableConfig";

type TenantsTableProps = {
  onCreate: () => void;
  onView: (tenant: TenantResponse) => void;
  onEdit: (tenant: TenantResponse) => void;
  onStartSession: (tenant: TenantResponse) => void;
  onDeactivate: (tenant: TenantResponse) => void;
};

export const TenantsTable = ({
  onCreate,
  onView,
  onEdit,
  onStartSession,
  onDeactivate,
}: TenantsTableProps) => {
  const rowActions = useMemo(
    () =>
      createTenantRowActions({
        onView,
        onEdit,
        onStartSession,
        onDeactivate,
      }),
    [onView, onEdit, onStartSession, onDeactivate],
  );

  const { listQueryRequest, bindPage } = useDataTable({
    columns: tenantColumns,
    getRowId: (row) => row.id,
    initialState: { pageSize: 10 },
    rowActions,
    toolbarActions: (
      <button type="button" className={primaryButtonClassName} onClick={onCreate}>
        Create tenant
      </button>
    ),
    emptyMessage: "No tenants match your filters",
    errorMessage: "Could not load tenants",
  });

  const page = useTenantsQuery(listQueryRequest);

  return <DataTable {...bindPage(page)} />;
};
