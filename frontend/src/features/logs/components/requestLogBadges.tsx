const statusClasses = (code: number) => {
  if (code >= 500) return "bg-danger/15 text-danger";
  if (code >= 400) return "bg-warning/15 text-warning";
  if (code >= 300) return "bg-accent-soft text-accent";
  return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
};

const methodClasses = (method: string) => {
  switch (method.toUpperCase()) {
    case "GET":
      return "bg-accent-soft text-accent";
    case "POST":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    case "PUT":
    case "PATCH":
      return "bg-warning/15 text-warning";
    case "DELETE":
      return "bg-danger/15 text-danger";
    default:
      return "bg-chrome text-muted";
  }
};

export const HttpMethodBadge = ({ method }: { method: string }) => (
  <span
    className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold tracking-wide ${methodClasses(method)}`}
  >
    {method}
  </span>
);

export const HttpStatusBadge = ({ statusCode }: { statusCode: number }) => (
  <span
    className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold tabular-nums ${statusClasses(statusCode)}`}
  >
    {statusCode}
  </span>
);
