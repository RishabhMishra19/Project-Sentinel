import type { RouteObject } from "react-router-dom";
import type { AuthSessionUser, TenantSummary } from "../features/auth/dto/response/auth.response";

/** Typed React Router `handle` for page header (crumb + description). */
export type AppRouteHandle = {
  crumb: string | ((state: unknown) => string);
  description: string | ((state: unknown) => string);
};

type NotWrapperRouteObjectProperties = {
  handle: AppRouteHandle;
  navigation?: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    order: number;
  };
};

type WrapperRouteObject = { isWrapperRoute: true };
export type NotWrapperRouteObject = { isWrapperRoute?: false } & NotWrapperRouteObjectProperties;

export type SentinelRouteObject = Omit<RouteObject, "handle" | "children"> & {
  id: string;
  path: string;
  Component: React.ComponentType;
  children?: SentinelRouteObject[];
  indexOrder?: number;
  isAccessibleTo?: (
    isLoggedIn: boolean,
    user: AuthSessionUser | null,
    activeTenant: TenantSummary | null,
  ) => boolean;
} & (WrapperRouteObject | NotWrapperRouteObject);

export type SidebarItem = {
  id: string;
  label: string;
  path: string;
  order: number;
  isAccessibleTo: SentinelRouteObject["isAccessibleTo"];
  icon?: React.ComponentType<{ className?: string }>;
};
