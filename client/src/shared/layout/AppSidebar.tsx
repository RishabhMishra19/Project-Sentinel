import { Link } from 'react-router-dom'
import { OverviewIcon, SettingsIcon } from '../../assets/icons'
import { useLogout } from '../../features/auth/hooks/useLogout'
import { ROUTES } from '../../routes/paths'
import { ThemeToggle, useTheme } from '../theme'
import { LoggedInUserCard } from './LoggedInUserCard'
import { SidebarNavLink } from './SidebarNavLink'

export function AppSidebar() {
  const logoutMutation = useLogout()
  const { theme } = useTheme()
  const logoSrc = theme === 'dark' ? '/logo-light.svg' : '/logo.svg'

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-background">
      <div className="border-b border-border px-4 py-5">
        <Link
          to={ROUTES.OVERVIEW}
          className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-foreground hover:text-muted"
        >
          <img src={logoSrc} alt="" width={28} height={28} className="shrink-0" />
          Sentinel
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <SidebarNavLink to={ROUTES.OVERVIEW} icon={<OverviewIcon className="size-4 shrink-0" />}>
          Overview
        </SidebarNavLink>
        <SidebarNavLink to={ROUTES.SETTINGS} icon={<SettingsIcon className="size-4 shrink-0" />}>
          Settings
        </SidebarNavLink>
      </nav>

      <div className="mt-auto space-y-2 border-t border-border p-3">
        <ThemeToggle className="w-full" />
        <LoggedInUserCard />
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="w-full rounded border border-border px-3 py-2 text-sm text-foreground hover:bg-surface disabled:opacity-60"
        >
          {logoutMutation.isPending ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </aside>
  )
}
