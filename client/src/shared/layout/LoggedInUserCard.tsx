import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { ROUTES } from '../../routes/paths'

function getInitials(displayName?: string | null, email?: string | null) {
  const source = displayName?.trim() || email?.trim() || '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

export function LoggedInUserCard() {
  const user = useAppSelector((state) => state.auth.user)
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const isProfileActive = location.pathname === ROUTES.PROFILE

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const meStatus = useAppSelector((state) => state.auth.meStatus)
  const isLoadingUser = !user && (meStatus === 'idle' || meStatus === 'loading')
  const initials = getInitials(user?.displayName, user?.email)

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center gap-3 rounded border px-3 py-2.5 text-left transition-colors ${
          isProfileActive
            ? 'border-accent/40 bg-accent-soft'
            : 'border-border bg-surface hover:border-accent/30 hover:bg-accent-soft/60'
        }`}
      >
        <span
          className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
            isProfileActive
              ? 'bg-accent text-accent-foreground'
              : 'bg-accent-soft text-accent'
          }`}
          aria-hidden
        >
          {isLoadingUser ? '…' : initials}
        </span>

        <span className="flex min-w-0 flex-1 flex-col">
          {isLoadingUser ? (
            <>
              <span className="truncate text-sm font-medium text-muted">Loading…</span>
              <span className="mt-0.5 truncate text-xs text-muted">Fetching account</span>
            </>
          ) : (
            <>
              <span className="truncate text-sm font-medium text-foreground">
                {user?.displayName ?? 'Unknown'}
              </span>
              <span className="mt-0.5 truncate text-xs text-muted">
                {user?.email ?? 'No email'}
              </span>
            </>
          )}
        </span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute bottom-0 left-full z-50 ml-1 min-w-40 rounded border border-border bg-surface py-1 shadow-sm"
        >
          <Link
            role="menuitem"
            to={ROUTES.PROFILE}
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-foreground hover:bg-accent-soft hover:text-accent"
          >
            Profile
          </Link>
        </div>
      ) : null}
    </div>
  )
}
