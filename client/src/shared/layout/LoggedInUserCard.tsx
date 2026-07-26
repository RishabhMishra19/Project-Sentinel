import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { ROUTE_PATHS } from "../../navigation";
import { SidebarItem, type SidebarMode } from "./SidebarItem";

const getInitials = (name?: string | null, email?: string | null) => {
  const source = name?.trim() || email?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

type LoggedInUserCardProps = {
  mode?: SidebarMode;
};

export const LoggedInUserCard = (=> { mode = "expanded" }: LoggedInUserCardProps) {
  const user = useAppSelector((state) => state.session.user);
  const navigate = useNavigate();
  const location = useLocation();
  const isProfileActive = location.pathname === `/${ROUTE_PATHS.profile}`;

  const isLoadingUser = !user;
  const initials = getInitials(user?.name, user?.email);

  const email = user?.email ?? "No email";
  const displayName = user?.name ?? "Unknown";

  const textNode = isLoadingUser ? (
    <span className="flex min-w-0 flex-col">
      <span className="truncate font-medium">Loading…</span>
      <span className="mt-0.5 truncate text-xs">Fetching account</span>
    </span>
  ) : (
    <span className="flex min-w-0 flex-col">
      <span className="truncate font-medium" title={displayName}>
        {displayName}
      </span>
      <span className="mt-0.5 truncate text-xs" title={email}>
        {email}
      </span>
    </span>
  );

  const isCollapsed = mode === "collapsed";
  const avatarClass = `inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${
    isCollapsed ? "size-8 text-[11px]" : "size-9 text-xs"
  } ${
    isProfileActive
      ? "bg-sidebar-item-active-foreground/10 text-sidebar-item-active-foreground"
      : "bg-sidebar-item text-sidebar-foreground"
  }`;

  return (
    <SidebarItem
      mode={mode}
      active={isProfileActive}
      onClick={() => navigate(`/${ROUTE_PATHS.profile}`)}
      className={isCollapsed ? undefined : "gap-2 py-2.5"}
      iconNode={
        <span className={avatarClass} aria-hidden>
          {isLoadingUser ? "…" : initials}
        </span>
      }
      textNode={isCollapsed ? (isLoadingUser ? "Loading…" : displayName) : textNode}
    />
  );
}
