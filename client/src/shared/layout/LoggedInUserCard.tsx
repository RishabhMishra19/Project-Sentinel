import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { ROUTES } from '../../routes/paths'
import { SidebarItem, type SidebarMode } from './SidebarItem'

function getInitials(displayName?: string | null, email?: string | null) {
  const source = displayName?.trim() || email?.trim() || '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

type LoggedInUserCardProps = {
  mode?: SidebarMode
}

export function LoggedInUserCard({ mode = 'expanded' }: LoggedInUserCardProps) {
  const user = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const location = useLocation()
  const isProfileActive = location.pathname === ROUTES.PROFILE

  const meStatus = useAppSelector((state) => state.auth.meStatus)
  const isLoadingUser = !user && (meStatus === 'idle' || meStatus === 'loading')
  const initials = getInitials(user?.displayName, user?.email)

  const email = user?.email ?? 'No email'
  const displayName = user?.displayName ?? 'Unknown'

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
  )

  const isCollapsed = mode === 'collapsed'
  const avatarClass = `inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${
    isCollapsed ? 'size-8 text-[11px]' : 'size-9 text-xs'
  } ${
    isProfileActive
      ? 'bg-sidebar-item-active-foreground/10 text-sidebar-item-active-foreground'
      : 'bg-sidebar-item text-sidebar-foreground'
  }`

  return (
    <SidebarItem
      mode={mode}
      active={isProfileActive}
      onClick={() => navigate(ROUTES.PROFILE)}
      className={isCollapsed ? undefined : 'gap-2 py-2.5'}
      iconNode={
        <span className={avatarClass} aria-hidden>
          {isLoadingUser ? '…' : initials}
        </span>
      }
      textNode={
        isCollapsed ? (isLoadingUser ? 'Loading…' : displayName) : textNode
      }
    />
  )
}
