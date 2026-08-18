export type NavigationItem = {
  id: string;
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isAdminOnly?: boolean;
  isTenantRequired?: boolean;
};

export type Crumb = {
  label: string;
  to?: string;
};
