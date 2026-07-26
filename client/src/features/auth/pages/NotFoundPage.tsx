import { Link } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { ROUTE_PATHS } from "../../../navigation";
import { resolvePostLoginPath } from "../../../navigation/utils";

export const NotFoundPage = () => {
  const user = useAppSelector((state) => state.session.user);
  const activeTenant = useAppSelector((state) => state.session.activeTenant);

  const homePath = user ? resolvePostLoginPath(user, activeTenant) : `/${ROUTE_PATHS.login}`;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-chrome p-3">
      <div className="mx-auto flex w-full max-w-lg flex-col items-start gap-4 rounded-xl border border-border bg-surface p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-muted">404</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Page not found</h1>
        <p className="text-sm text-muted">
          The page you are looking for does not exist or may have moved.
        </p>
        <Link
          to={homePath}
          className="rounded bg-accent px-3 py-2 text-sm text-accent-foreground hover:opacity-90"
        >
          {user ? "Go home" : "Go to login"}
        </Link>
      </div>
    </div>
  );
};
