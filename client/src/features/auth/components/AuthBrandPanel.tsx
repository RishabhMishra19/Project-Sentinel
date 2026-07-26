const HIGHLIGHTS = [
  "Secure sign-in with short-lived access tokens and refresh cookies",
  "Central place to explore protected routes and API access patterns",
  "Built as a resume/demo stack you can run locally with Docker Compose",
] as const;

/** Left brand panel for guest/auth screens (login layout). */
export function AuthBrandPanel() {
  return (
    <aside className="flex flex-col justify-between rounded-2xl bg-brand-panel px-8 py-12 text-brand-panel-foreground shadow-sm md:w-1/2 md:px-12 lg:px-16">
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex items-center gap-3">
          <img
            src="/logo-light.svg"
            alt=""
            width={40}
            height={40}
            className="shrink-0"
          />
          <h1 className="text-4xl font-semibold tracking-tight">Sentinel</h1>
        </div>
        <p className="mt-4 max-w-md text-base leading-relaxed text-brand-panel-muted">
          A full-stack demo for managing API endpoints and access in one place —
          Spring Boot, React, Postgres, Redis, and Kafka wired together with JWT
          auth.
        </p>
        <ul className="mt-8 max-w-md space-y-3 text-sm text-brand-panel-muted">
          {HIGHLIGHTS.map((text) => (
            <li key={text} className="flex gap-3">
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-panel-muted"
                aria-hidden
              />
              {text}
            </li>
          ))}
        </ul>
      </div>
      <footer className="mt-10 border-t border-brand-panel-border pt-6 md:mt-12">
        <p className="text-xs uppercase tracking-wider text-brand-panel-muted">
          Built by
        </p>
        <p className="mt-1 text-sm font-medium text-brand-panel-foreground">
          Rishabh Mishra
        </p>
        <p className="mt-0.5 text-sm text-brand-panel-muted">
          Full-stack engineer · Spring Boot & React
        </p>
      </footer>
    </aside>
  );
}
