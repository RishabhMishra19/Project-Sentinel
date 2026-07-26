export type InventoryRequest = {
  controlUrl: string;
  email: string;
  password: string;
};

export type InventoryCounts = {
  tenants: number;
  products: number;
  services: number;
  endpoints: number;
  fetchedAt: string;
};
