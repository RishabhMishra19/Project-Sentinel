import type { RouteObject } from "react-router-dom";
import type { AuthSessionUser, TenantSummary } from "../features/auth/dto/response/auth.response";

type NotWrapperRouteObjectProperties = {
  crumb: string | ((state: unknown) => string);
  description: string | ((state: unknown) => string);
  navigation?: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    order: number;
  };
};

type WrapperRouteObject = { isWrapperRoute: true };
export type NotWrapperRouteObject = { isWrapperRoute?: false } & NotWrapperRouteObjectProperties;

export type SentinelRouteObject = RouteObject & {
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
