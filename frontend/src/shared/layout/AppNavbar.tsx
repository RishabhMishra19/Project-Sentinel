import { ChevronRightIcon } from "../../assets/icons";
import { useAppSelector } from "../../redux/hooks";
import type { Crumb } from "../../routes/types";
import { ThemeToggle } from "../theme";
import { Breadcrumb } from "./Breadcrumb";

type AppNavbarProps = {
  crumbs: Crumb[];
  description?: string;
};

export const AppNavbar = ({ crumbs, description }: AppNavbarProps) => {
  const activeTenant = useAppSelector((state) => state.session.activeTenant!);
  return (
    <header className="flex min-h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-3">
      <div className="min-w-0">
        <div className="flex items-center">
          <span className="text-md font-bold">{activeTenant.name}</span>
          &nbsp;
          <ChevronRightIcon className="size-3.5 shrink-0 text-muted" />
          &nbsp;
          <Breadcrumb items={crumbs} />
        </div>
        {description ? <p className="mt-0.5 truncate text-xs text-muted">{description}</p> : null}
      </div>

      <ThemeToggle />
    </header>
  );
};
