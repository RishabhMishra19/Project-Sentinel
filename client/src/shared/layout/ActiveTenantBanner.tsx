import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearActiveTenant } from "../../redux/session/sessionSlice";

export function ActiveTenantBanner() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);
  const activeTenant = useAppSelector((state) => state.session.activeTenant)!;

  const message = `Impersonated as ${user?.email ?? "…"} in tenant: ${activeTenant.name}`;

  return (
    <div
      className="flex shrink-0 items-center gap-3 border-b border-warning/25 bg-warning/15 px-3 py-1.5"
      role="status"
    >
      <p className="tenant-text-sparkle min-w-0 flex-1 truncate text-sm font-medium">
        {message}
      </p>
      <button
        type="button"
        className="shrink-0 rounded-md bg-danger px-2.5 py-1 text-xs font-medium text-white hover:bg-danger/90"
        onClick={() => dispatch(clearActiveTenant())}
      >
        End
      </button>
    </div>
  );
}
