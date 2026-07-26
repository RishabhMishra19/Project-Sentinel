import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../../navigation";
import { primaryButtonClassName } from "../../../shared/ui/data-table/styles";

export const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <button
          type="button"
          className={primaryButtonClassName}
          onClick={() =>
            navigate(`/${ROUTE_PATHS.settings}/${ROUTE_PATHS.settingsRoles}`)
          }
        >
          Manage Roles
        </button>
      </div>
    </div>
  );
};
