import { useLocation, useMatches, type UIMatch } from "react-router-dom";
import type { NotWrapperRouteObject } from "../../navigation/types";

type PageHeaderHandle = Pick<NotWrapperRouteObject, "crumb" | "description">;

export type Crumb = {
  label: string;
  to?: string;
};

function hasCrumbHandle(handle: unknown): handle is PageHeaderHandle {
  return (
    typeof handle === "object" &&
    handle !== null &&
    "crumb" in handle &&
    (typeof (handle as PageHeaderHandle).crumb === "string" ||
      typeof (handle as PageHeaderHandle).crumb === "function")
  );
}

function resolveCrumb(handle: PageHeaderHandle, state: unknown): string | undefined {
  const resolved = typeof handle.crumb === "function" ? handle.crumb(state) : handle.crumb;
  return resolved && resolved.length > 0 ? resolved : undefined;
}

function resolveDescription(handle: PageHeaderHandle, state: unknown): string | undefined {
  const resolved =
    typeof handle.description === "function" ? handle.description(state) : handle.description;
  return resolved && resolved.length > 0 ? resolved : undefined;
}

/**
 * Builds navbar breadcrumbs from matched routes that declare `handle.crumb`.
 * Description comes from the deepest match that resolves a non-empty description.
 */
export function usePageHeader(): { crumbs: Crumb[]; description?: string } {
  const matches = useMatches();
  const { state } = useLocation();

  const crumbMatches = matches.filter((m): m is UIMatch<unknown, PageHeaderHandle> =>
    hasCrumbHandle(m.handle),
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
}
