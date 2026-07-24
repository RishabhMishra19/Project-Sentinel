import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'

type PopoverProps = {
  trigger: ReactElement<{
    onClick?: (event: React.MouseEvent) => void
    'aria-expanded'?: boolean
    'aria-controls'?: string
  }>
  children: ReactNode
  align?: 'start' | 'end'
  className?: string
  contentClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const Popover = ({
  trigger,
  children,
  align = 'start',
  className,
  contentClassName,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = useCallback(
    (next: boolean) => {
      onOpenChange?.(next)
      if (controlledOpen === undefined) {
        setUncontrolledOpen(next)
      }
    },
    [controlledOpen, onOpenChange],
  )

  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) {
      return
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, setOpen])

  const triggerNode = isValidElement(trigger)
    ? cloneElement(trigger, {
        'aria-expanded': open,
        'aria-controls': panelId,
        onClick: (event: React.MouseEvent) => {
          trigger.props.onClick?.(event)
          setOpen(!open)
        },
      })
    : trigger

  return (
    <div ref={rootRef} className={`relative inline-flex ${className ?? ''}`}>
      {triggerNode}
      {open ? (
        <div
          id={panelId}
          role="dialog"
          className={`absolute z-50 mt-1 min-w-[10rem] rounded border border-border bg-surface p-2 shadow-md ${
            align === 'end' ? 'right-0' : 'left-0'
          } ${contentClassName ?? ''}`}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
