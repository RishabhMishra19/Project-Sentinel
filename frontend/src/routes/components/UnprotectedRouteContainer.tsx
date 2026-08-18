import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { AuthBrandPanel } from "../../features/auth/components/AuthBrandPanel";
import { ThemeToggle } from "../../shared/theme";

export const UnprotectedRouteContainer = () => {
  const state = useAppSelector((state) => state.session.state);

  if (state !== "NO_AUTH") {
    return <Navigate to={"/"} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col gap-3 bg-chrome p-3 md:flex-row">
      <AuthBrandPanel />
      <div className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-surface px-4 py-10 shadow-sm md:w-1/2">
        <ThemeToggle className="absolute top-4 right-4 z-10" />
        <Outlet />
      </div>
    </div>
  );
};
