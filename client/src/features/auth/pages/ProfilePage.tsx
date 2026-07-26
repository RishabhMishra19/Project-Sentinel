import { useState } from "react";
import { QueryGate } from "../../../shared/ui";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { useProfile } from "../hooks/useProfile";

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

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
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                    Display name
                  </dt>
                  <dd className="mt-1 text-foreground">{data.name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">Email</dt>
                  <dd className="mt-1 text-foreground">{data.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">Status</dt>
                  <dd className="mt-1 text-foreground">{data.status}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                    Sentinel admin
                  </dt>
                  <dd className="mt-1 text-foreground">{data.sentinelAdmin ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                    Tenant admin
                  </dt>
                  <dd className="mt-1 text-foreground">{data.tenantAdmin ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">Tenant</dt>
                  <dd className="mt-1 text-foreground">
                    {data.tenant ? `${data.tenant.name} (${data.tenant.id})` : "No tenant"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">Created</dt>
                  <dd className="mt-1 text-foreground">{formatDate(data.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">Updated</dt>
                  <dd className="mt-1 text-foreground">{formatDate(data.updatedAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                    Last login
                  </dt>
                  <dd className="mt-1 text-foreground">
                    {data.lastLoginAt ? formatDate(data.lastLoginAt) : "Never"}
                  </dd>
                </div>
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
