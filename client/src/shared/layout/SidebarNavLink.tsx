import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const inactiveClass =
  'flex items-center gap-2.5 rounded px-3 py-2 text-sm text-muted hover:bg-accent/25 hover:text-accent'
const activeClass =
  'flex items-center gap-2.5 rounded bg-accent px-3 py-2 text-sm font-medium text-accent-foreground'

type SidebarNavLinkProps = {
  to: string
  icon?: ReactNode
  children: ReactNode
}

export function SidebarNavLink({ to, icon, children }: SidebarNavLinkProps) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
      {icon}
      {children}
    </NavLink>
  )
}

export { activeClass as sidebarActiveClass, inactiveClass as sidebarInactiveClass }
