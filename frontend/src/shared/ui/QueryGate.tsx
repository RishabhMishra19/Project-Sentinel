import type { ReactNode } from "react";

type QueryGateProps = {
  isLoading: boolean;
  isError: boolean;
  /** Shown when `isError` is true. Defaults to "Something went wrong". */
  errorMessage?: string;
  /** Shown when `isLoading` is true. Defaults to "Loading…". */
  loadingMessage?: string;
  /** Extra classes on the loading/error container (fills available flex space). */
  className?: string;
  children: ReactNode;
};

/**
 * Renders children only when the query is ready.
 * Loading/error fill available space and center the status message.
 * Parent should give the gate height (e.g. `flex flex-1 flex-col min-h-0`).
 */
export const QueryGate = ({
  isLoading,
  isError,
  errorMessage = "Something went wrong",
  loadingMessage = "Loading…",
  className,
  children,
}: QueryGateProps) => {
  if (isLoading || isError) {
    return (
      <div
        className={["flex min-h-0 flex-1 items-center justify-center", className]
          .filter(Boolean)
          .join(" ")}
      >
        <p className={`text-sm ${isError ? "text-danger" : "text-muted"}`}>
          {isError ? errorMessage : loadingMessage}
        </p>
      </div>
    );
  }

  return children;
};
