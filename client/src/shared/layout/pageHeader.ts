import { useMatches, type UIMatch } from 'react-router-dom'

export type Crumb = {
  label: string
  to?: string
}

export type AppRouteHandle = {
  crumb: string
}

function hasCrumb(handle: unknown): handle is AppRouteHandle {
  return typeof handle === 'object' && handle !== null && 'crumb' in handle && typeof (handle as AppRouteHandle).crumb === 'string'
}

/**
 * Builds navbar breadcrumbs from matched routes that declare `handle.crumb`.
 * Nesting depth comes from the route tree; last crumb is the current page (no `to`).
 */
export function usePageHeader(): { crumbs: Crumb[] } {
  const matches = useMatches()

  const crumbMatches = matches.filter(
    (m): m is UIMatch<unknown, AppRouteHandle> => hasCrumb(m.handle),
  )

  const crumbs = crumbMatches.map((m, i, arr) => ({
    label: m.handle.crumb,
    to: i < arr.length - 1 ? m.pathname : undefined,
  }))

  return { crumbs }
}
