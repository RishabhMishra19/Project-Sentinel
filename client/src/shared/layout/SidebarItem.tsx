import type { MouseEventHandler, ReactNode } from 'react'

type Tone = 'default' | 'danger'
type Mode = 'collapsed' | 'expanded'

const baseClass =
  'flex w-full items-center rounded-xl text-sm transition-colors disabled:opacity-60'

function getSidebarItemClass(tone: Tone, active: boolean, mode: Mode, className = '') {
  const layoutClass =
    mode === 'collapsed' ? 'justify-center px-2 py-2.5' : 'gap-2.5 px-3 py-2.5'

  let toneClass: string
  if (tone === 'danger') {
    toneClass =
      'text-red-400 hover:bg-danger hover:text-white dark:text-danger dark:hover:bg-danger dark:hover:text-white'
  } else if (active) {
    toneClass = 'bg-sidebar-item-active font-medium text-sidebar-item-active-foreground'
  } else {
    toneClass = 'text-sidebar-muted hover:bg-sidebar-item hover:text-sidebar-foreground'
  }

  return `${baseClass} ${layoutClass} ${toneClass} ${className}`.trim()
}

type SidebarItemProps = {
  iconNode?: ReactNode
  textNode?: ReactNode
  mode?: Mode
  onClick?: MouseEventHandler<HTMLButtonElement>
  active?: boolean
  tone?: Tone
  disabled?: boolean
  className?: string
}

export function SidebarItem({
  iconNode,
  textNode,
  mode = 'expanded',
  onClick,
  active = false,
  tone = 'default',
  disabled = false,
  className = '',
}: SidebarItemProps) {
  const label = typeof textNode === 'string' ? textNode : undefined
  const isCollapsed = mode === 'collapsed'
  const hasIcon = iconNode != null

  return (
    <span className="relative">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={isCollapsed ? label : undefined}
        aria-current={active ? 'page' : undefined}
        className={`peer ${getSidebarItemClass(tone, active, mode, className)}`}
      >
        {iconNode}
        {mode === 'expanded' && textNode != null ? (
          <span className={hasIcon ? 'min-w-0 flex-1 text-left' : 'w-full text-center'}>
            {textNode}
          </span>
        ) : null}
      </button>
      {isCollapsed && label ? (
        <span
          role="tooltip"
          className="pointer-events-none absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 peer-hover:opacity-100 peer-focus-visible:opacity-100"
        >
          {label}
        </span>
      ) : null}
    </span>
  )
}

export type { Mode as SidebarMode }
