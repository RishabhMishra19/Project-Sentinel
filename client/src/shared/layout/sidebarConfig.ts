import {
  ADMIN_ONLY_ROUTES,
  TENANT_CONTEXT_ROUTES,
} from "../../routes/paths";

export type SidebarItem = {
  id: string;
  label: string;
  path: string;
};

export const ADMIN_SIDE_BAR_ITEMS: SidebarItem[] = [
  { id: "tenants", label: "Tenants", path: ADMIN_ONLY_ROUTES.TENANTS },
];

export const TENANT_SIDE_BAR_ITEMS: SidebarItem[] = [
  {
    id: "products",
    label: "Products",
    path: TENANT_CONTEXT_ROUTES.PRODUCTS,
  },
  {
    id: "services",
    label: "Services",
    path: TENANT_CONTEXT_ROUTES.SERVICES,
  },
  {
    id: "users",
    label: "Users",
    path: TENANT_CONTEXT_ROUTES.USERS,
  },
  {
    id: "settings",
    label: "Settings",
    path: TENANT_CONTEXT_ROUTES.SETTINGS,
  },
];
