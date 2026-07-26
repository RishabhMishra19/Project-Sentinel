import type { UIMatch } from "react-router-dom";
import type { AppRouteHandle } from "../../navigation/types";

export type Crumb = {
  label: string;
  to?: string;
};

export type PageHeader = {
  crumbs: Crumb[];
  description?: string;
};

export type PageMatch = UIMatch<unknown, AppRouteHandle | undefined>;

const resolveCrumb = (handle: AppRouteHandle, state: unknown): string | undefined => {
  const resolved = typeof handle.crumb === "function" ? handle.crumb(state) : handle.crumb;
  return resolved && resolved.length > 0 ? resolved : undefined;
};

const resolveDescription = (handle: AppRouteHandle, state: unknown): string | undefined => {
  const resolved =
    typeof handle.description === "function" ? handle.description(state) : handle.description;
  return resolved && resolved.length > 0 ? resolved : undefined;
};

/**
 * Builds navbar breadcrumbs/description from typed `match.handle`
 * (`AppRouteHandle`: crumb + description).
 */
export const resolvePageHeader = (matches: PageMatch[], state: unknown): PageHeader => {
  const crumbMatches = matches.filter(
    (m): m is UIMatch<unknown, AppRouteHandle> => m.handle != null,
  );

  const crumbs = crumbMatches.flatMap((m, i, arr) => {
    const label = resolveCrumb(m.handle, state);
    if (label == null) return [];
    return [
      {
        label,
        to: i < arr.length - 1 ? m.pathname : undefined,
      },
    ];
  });

  const description = [...crumbMatches]
    .reverse()
    .map((m) => resolveDescription(m.handle, state))
    .find((value) => value != null);

  return { crumbs, description };
};
