export type CatalogService = {
  serviceId: string;
  apiKey: string;
  instanceId: string;
  tenantId: string;
  productId: string;
  name: string;
};

export type Catalog = {
  ingestBaseUrl: string;
  controlBaseUrl: string;
  createdAt: string;
  services: CatalogService[];
};

export type CatalogStatus = {
  exists: boolean;
  createdAt: string | null;
  ingestBaseUrl: string | null;
  serviceCount: number;
};

export type SetupRequest = {
  controlUrl: string;
  ingestUrl: string;
  email: string;
  password: string;
  tenants: number;
  products: number;
  services: number;
};

export type SetupResult = {
  tenants: number;
  products: number;
  services: number;
  createdAt: string;
};

export type LoadKnobs = {
  rps: number;
  totalRequests: number;
  errorPct: number;
  p50Ms: number;
  p95Ms: number;
  pathCardinality: number;
};

export type RunStatus = {
  running: boolean;
  startedAt: string | null;
  finishedAt: string | null;
  exitCode: number | null;
  logTail: string;
  error: string | null;
};
