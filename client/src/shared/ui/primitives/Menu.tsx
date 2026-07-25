import { useState, type ReactElement } from 'react'
import { Popover } from './Popover'

export type MenuItem = {
  id: string
  label: string
  onSelect: () => void
  disabled?: boolean
  variant?: 'default' | 'danger'
}

type MenuProps = {
  trigger: ReactElement<{
    onClick?: (event: React.MouseEvent) => void
    'aria-expanded'?: boolean
    'aria-controls'?: string
  }>
  items: MenuItem[]
  align?: 'start' | 'end'
  className?: string
}

export const Menu = ({
  trigger,
  items,
  align = 'end',
  className,
}: MenuProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover
      trigger={trigger}
      align={align}
      className={className}
      contentClassName="p-1"
      open={open}
      onOpenChange={setOpen}
    >
      <ul className="flex min-w-[8rem] flex-col gap-0.5" role="menu">
        {items.map((item) => (
          <li key={item.id} role="none">
            <button
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={`w-full rounded px-2 py-1.5 text-left text-sm disabled:opacity-50 ${
                item.variant === 'danger'
                  ? 'text-danger hover:bg-danger/10'
                  : 'text-foreground hover:bg-chrome'
              }`}
              onClick={(event) => {
                event.stopPropagation()
                if (item.disabled) {
                  return
                }
                item.onSelect()
                setOpen(false)
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </Popover>
  )
}
