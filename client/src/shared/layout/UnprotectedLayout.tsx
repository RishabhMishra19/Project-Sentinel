import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '../theme'

export function UnprotectedLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex flex-col justify-between bg-brand-panel px-8 py-12 text-brand-panel-foreground md:w-1/2 md:border-r md:border-brand-panel-border md:px-12 lg:px-16">
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex items-center gap-3">
            <img src="/logo-light.svg" alt="" width={40} height={40} className="shrink-0" />
            <h1 className="text-4xl font-semibold tracking-tight">Sentinel</h1>
          </div>
          <p className="mt-4 max-w-md text-base leading-relaxed text-brand-panel-muted">
            A full-stack demo for managing API endpoints and access in one place — Spring Boot,
            React, Postgres, Redis, and Kafka wired together with JWT auth.
          </p>
          <ul className="mt-8 max-w-md space-y-3 text-sm text-brand-panel-muted">
            <li className="flex gap-3">
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-panel-muted"
                aria-hidden
              />
              Secure sign-in with short-lived access tokens and refresh cookies
            </li>
            <li className="flex gap-3">
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-panel-muted"
                aria-hidden
              />
              Central place to explore protected routes and API access patterns
            </li>
            <li className="flex gap-3">
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-panel-muted"
                aria-hidden
              />
              Built as a resume/demo stack you can run locally with Docker Compose
            </li>
          </ul>
        </div>
        <footer className="mt-10 border-t border-brand-panel-border pt-6 md:mt-12">
          <p className="text-xs uppercase tracking-wider text-brand-panel-muted">Built by</p>
          <p className="mt-1 text-sm font-medium text-brand-panel-foreground">Rishabh Mishra</p>
          <p className="mt-0.5 text-sm text-brand-panel-muted">
            Full-stack engineer · Spring Boot & React
          </p>
        </footer>
      </aside>
      <div className="relative flex flex-1 items-center justify-center bg-background px-4 py-10 md:w-1/2">
        <ThemeToggle variant="icon" className="absolute top-4 right-4 z-10" />
        <Outlet />
      </div>
    </div>
  )
}
