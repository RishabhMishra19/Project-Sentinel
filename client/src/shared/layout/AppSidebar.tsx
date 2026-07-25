import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import {
  LogoutIcon,
  ProductsIcon,
  ServicesIcon,
  SidebarCloseIcon,
  SidebarOpenIcon,
  TenantsIcon,
} from "../../assets/icons";
import { useLogout } from "../../features/auth/hooks/useLogout";
import { SHARED_ROUTES } from "../../routes/paths";
import { resolveSessionMode } from "../session/resolveSessionMode";
import { localStorageManager } from "../storage/LocalStorageManager";
import { LoggedInUserCard } from "./LoggedInUserCard";
import { ADMIN_SIDE_BAR_ITEMS, TENANT_SIDE_BAR_ITEMS } from "./sidebarConfig";
import { SidebarItem, type SidebarMode } from "./SidebarItem";
import { SidebarTray } from "./SidebarTray";

const SIDEBAR_MODE_KEY = "sidebar-mode";

const NAV_ICONS: Record<string, ReactNode> = {
  tenants: <TenantsIcon className="size-4 shrink-0" />,
  products: <ProductsIcon className="size-4 shrink-0" />,
  services: <ServicesIcon className="size-4 shrink-0" />,
};

function readStoredMode(): SidebarMode {
  return localStorageManager.get(SIDEBAR_MODE_KEY) === "collapsed"
    ? "collapsed"
    : "expanded";
}

export function AppSidebar() {
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mode, setMode] = useState<SidebarMode>(readStoredMode);
  const isCollapsed = mode === "collapsed";

  const user = useAppSelector((state) => state.session.user)!;
  const activeTenant = useAppSelector((state) => state.session.activeTenant);
  const sessionMode = resolveSessionMode(user, activeTenant);

  const navItems =
    sessionMode === "only_admin"
      ? ADMIN_SIDE_BAR_ITEMS
      : TENANT_SIDE_BAR_ITEMS;

  const isNavActive = (path: string) => pathname.startsWith(path);

  const toggleMode = () => {
    const next: SidebarMode = isCollapsed ? "expanded" : "collapsed";
    localStorageManager.set(SIDEBAR_MODE_KEY, next);
    setMode(next);
  };

  return (
    <aside
      className={`flex shrink-0 flex-col rounded-2xl bg-sidebar text-sidebar-foreground shadow-sm transition-[width] duration-200 ${
        isCollapsed ? "w-16" : "w-[17rem]"
      }`}
    >
      <div
        className={`flex items-center py-7 ${
          isCollapsed ? "flex-col gap-3 px-2" : "justify-between gap-2 px-4"
        }`}
      >
        <Link
          to={SHARED_ROUTES.PROFILE}
          className={`flex min-w-0 items-center tracking-tight text-sidebar-foreground hover:text-sidebar-muted ${
            isCollapsed ? "justify-center" : "gap-2.5 text-xl font-semibold"
          }`}
        >
          <img
            src="/logo-light.svg"
            alt=""
            width={28}
            height={28}
            className="shrink-0"
          />
          {!isCollapsed ? <span className="truncate">Sentinel</span> : null}
        </Link>

        <span className="relative">
          <button
            type="button"
            onClick={toggleMode}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
            className="peer inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-sidebar transition-opacity hover:opacity-90"
          >
            {isCollapsed ? (
              <SidebarOpenIcon className="size-5" />
            ) : (
              <SidebarCloseIcon className="size-5" />
            )}
          </button>
          <span
            role="tooltip"
            className="pointer-events-none absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 peer-hover:opacity-100 peer-focus-visible:opacity-100"
          >
            {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </span>
      </div>

      <nav className={`flex flex-1 flex-col ${isCollapsed ? "px-2" : "px-3"}`}>
        <SidebarTray mode={mode}>
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              mode={mode}
              active={isNavActive(item.path)}
              iconNode={NAV_ICONS[item.id]}
              textNode={item.label}
              onClick={() => navigate(item.path)}
            />
          ))}
        </SidebarTray>
      </nav>

      <div className={`mt-auto ${isCollapsed ? "p-2" : "p-3"}`}>
        <SidebarTray mode={mode}>
          <LoggedInUserCard mode={mode} />
          {!isCollapsed ? (
            <div
              role="separator"
              className="mx-1.5 my-0.5 h-px bg-sidebar-foreground/20"
            />
          ) : null}
          <SidebarItem
            mode={mode}
            tone="danger"
            iconNode={<LogoutIcon className="size-4 shrink-0" />}
            textNode={logoutMutation.isPending ? "Logging out…" : "Log out"}
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          />
        </SidebarTray>
      </div>
    </aside>
  );
}
