import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { RoutesUtils } from "../RoutesUtils";
import { ChooseTenantModal } from "../../features/tenants/components/ChooseTenantModal";

export const RequireTenantContainer = () => {
  const activeTenant = useAppSelector((state) => state.session.activeTenant);

  if (!RoutesUtils.isActiveTenantSet(activeTenant)) {
    return <ChooseTenantModal />;
  }

  return <Outlet />;
};
