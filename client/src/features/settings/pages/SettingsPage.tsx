import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../../routes/constants";
import { PageContent } from "../../../shared/layout/PageContent";
import { primaryButtonClassName } from "../../../shared/ui/data-table/styles";

export const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <PageContent>
      <div>
        <button
          type="button"
          className={primaryButtonClassName}
          onClick={() => navigate(`/${ROUTE_PATHS.settings}/${ROUTE_PATHS.settingsRoles}`)}
        >
          Manage Roles
        </button>
      </div>
    </PageContent>
  );
};
