import type { ReactNode } from 'react'
import type { SidebarMode } from './SidebarItem'

type SidebarTrayProps = {
  children: ReactNode
  mode?: SidebarMode
  className?: string
}

export function SidebarTray({
  children,
  mode = 'expanded',
  className = '',
}: SidebarTrayProps) {
  const shellClass =
    mode === 'collapsed'
      ? 'flex flex-col gap-1'
      : 'flex flex-col gap-1 rounded-2xl bg-sidebar-tray p-1.5'

  return <div className={`${shellClass} ${className}`.trim()}>{children}</div>
}
