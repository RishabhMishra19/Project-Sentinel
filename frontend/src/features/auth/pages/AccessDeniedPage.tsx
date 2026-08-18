export const AccessDeniedPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-start gap-4 rounded-xl border border-border bg-surface p-8 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wide text-muted">403</p>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Access denied</h1>
      <p className="text-sm text-muted">
        You do not have permission to view this page. Contact your administrator if you believe this
        is a mistake.
      </p>
    </div>
  );
};
