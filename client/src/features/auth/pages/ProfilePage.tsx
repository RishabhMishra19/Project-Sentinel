import { useState } from "react";
import { DetailRow, QueryGate } from "../../../shared/ui";
import { formatDateTime } from "../../../shared/utils/dateUtils";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { useProfile } from "../hooks/useProfile";

export const ProfilePage = () => {
  const { data, isLoading, isError } = useProfile();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <>
      <div className="mx-auto flex min-h-64 max-w-3xl flex-col rounded-xl border border-border bg-surface p-8">
        <div className="mb-6 flex shrink-0 items-start justify-between gap-4">
          <p className="text-sm text-muted">Your account details</p>
          <button
            type="button"
            onClick={() => setChangePasswordOpen(true)}
            className="rounded bg-accent px-3 py-2 text-sm text-accent-foreground hover:opacity-90"
          >
            Change password
          </button>
        </div>

        <QueryGate
          isLoading={isLoading}
          isError={isError || (!isLoading && !data)}
          loadingMessage="Loading profile…"
          errorMessage="Failed to load profile"
        >
          {data ? (
            <div className="space-y-6">
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow variant="emphasized" label="Display name" value={data.name} />
                <DetailRow variant="emphasized" label="Email" value={data.email} />
                <DetailRow variant="emphasized" label="Status" value={data.status} />
                <DetailRow
                  variant="emphasized"
                  label="Sentinel admin"
                  value={data.sentinelAdmin ? "Yes" : "No"}
                />
                <DetailRow
                  variant="emphasized"
                  label="Tenant admin"
                  value={data.tenantAdmin ? "Yes" : "No"}
                />
                <DetailRow
                  variant="emphasized"
                  label="Tenant"
                  value={data.tenant ? `${data.tenant.name} (${data.tenant.id})` : "No tenant"}
                />
                <DetailRow
                  variant="emphasized"
                  label="Created"
                  value={formatDateTime(data.createdAt)}
                />
                <DetailRow
                  variant="emphasized"
                  label="Updated"
                  value={formatDateTime(data.updatedAt)}
                />
                <DetailRow
                  variant="emphasized"
                  label="Last login"
                  value={formatDateTime(data.lastLoginAt, "Never")}
                />
              </dl>

              <div className="space-y-3">
                <h2 className="text-lg font-medium text-foreground">Roles</h2>
                {data.roles.length === 0 ? (
                  <p className="text-sm text-muted">No roles assigned</p>
                ) : (
                  <ul className="space-y-3">
                    {data.roles.map((role) => (
                      <li key={role.id} className="rounded border border-border p-4">
                        <p className="font-medium text-foreground">{role.name}</p>
                        <p className="mt-2 text-sm text-muted">
                          Scopes:{" "}
                          {role.scopes
                            .map(
                              (s) =>
                                `${s.scopeType}${s.scopeId ? `:${s.scopeId.slice(0, 8)}` : ""} (${s.permission})`,
                            )
                            .join(", ") || "none"}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : null}
        </QueryGate>
      </div>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </>
  );
};
