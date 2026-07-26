import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearActiveTenant } from "../../redux/session/sessionSlice";
import { ROUTE_PATHS } from "../../navigation";

export const ActiveTenantBanner = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const activeTenant = useAppSelector((state) => state.session.activeTenant)!;

  const message = `Session in tenant: ${activeTenant.name}`;

  const handleEnd = () => {
    dispatch(clearActiveTenant());
    navigate(`/${ROUTE_PATHS.tenants}`);
  };

  return (
    <div
      className="flex shrink-0 items-center gap-3 border-b border-warning/25 bg-warning/15 px-3 py-1.5"
      role="status"
    >
      <p className="tenant-text-sparkle min-w-0 flex-1 truncate text-sm font-medium">{message}</p>
      <button
        type="button"
        className="shrink-0 rounded-md bg-danger px-2.5 py-1 text-xs font-medium text-white hover:bg-danger/90"
        onClick={handleEnd}
      >
        End session
      </button>
    </div>
  );
};
