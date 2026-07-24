import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const inactiveClass =
  'flex items-center gap-2.5 rounded px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground'
const activeClass =
  'relative flex items-center gap-2.5 rounded bg-accent-soft px-3 py-2 text-sm font-medium text-accent before:absolute before:top-1 before:bottom-1 before:left-0 before:w-1 before:rounded-full before:bg-accent'

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
