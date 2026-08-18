/**
 * Shown while the root session restore is in progress
 * (or waiting for user after a signed-in restore) before routes render.
 */
export const SessionBootstrapScreen = () => {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-chrome p-3">
      <div
        className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl bg-surface px-8 py-12 shadow-sm animate-[bootstrap-in_400ms_ease-out]"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex items-center gap-3">
          <img src="/logo-light.svg" alt="" width={36} height={36} className="shrink-0" />
          <span className="text-2xl font-semibold tracking-tight text-foreground">Sentinel</span>
        </div>

        <div
          className="size-8 rounded-full border-2 border-border border-t-accent animate-spin"
          aria-hidden
        />

        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Restoring your session</p>
          <p className="mt-1 text-sm text-muted">Checking sign-in and loading your account…</p>
        </div>
      </div>
    </div>
  );
};
