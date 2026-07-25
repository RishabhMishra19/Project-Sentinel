import { Link } from 'react-router-dom'
import { ROUTES } from '../../../routes/paths'

export function UnauthorizedPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 rounded-xl border border-border bg-surface p-8">
      <p className="text-sm font-medium uppercase tracking-wide text-muted">403</p>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Unauthorized
      </h1>
      <p className="text-sm text-muted">
        You do not have access to that page. Switch context or return to your
        profile.
      </p>
      <Link
        to={ROUTES.PROFILE}
        className="rounded bg-accent px-3 py-2 text-sm text-accent-foreground hover:opacity-90"
      >
        Go to profile
      </Link>
    </div>
  )
}
