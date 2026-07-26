import type { Catalog, CatalogService, SetupRequest, SetupResult } from "./types";
import { writeCatalog } from "./catalog";

class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string,
  ) {
    super(message);
  }
}

async function requestJson<T>(
  url: string,
  init: RequestInit & { token?: string; tenantId?: string } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (init.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }
  if (init.tenantId) {
    headers.set("X-Tenant-Id", init.tenantId);
  }

  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  if (!res.ok) {
    throw new HttpError(`${init.method ?? "GET"} ${url} failed (${res.status})`, res.status, text);
  }
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function runSetup(input: SetupRequest): Promise<SetupResult> {
  const tenants = clampInt(input.tenants, 1, 50);
  const products = clampInt(input.products, 1, 20);
  const services = clampInt(input.services, 1, 50);
  const control = input.controlUrl.replace(/\/$/, "");
  const ingest = input.ingestUrl.replace(/\/$/, "");
  const stamp = Date.now();

  const login = await requestJson<{ accessToken: string }>(`${control}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email: input.email, password: input.password }),
  });
  const token = login.accessToken;

  const catalogServices: CatalogService[] = [];

  for (let t = 1; t <= tenants; t++) {
    const tenantName = `Loadlab Tenant ${stamp}-${t}`;
    const slug = slugify(`loadlab-${stamp}-${t}`);
    const adminEmail = `loadlab-admin-${stamp}-${t}@example.com`;

    const tenant = await requestJson<{ id: string }>(`${control}/api/tenants`, {
      method: "POST",
      token,
      body: JSON.stringify({
        name: tenantName,
        slug,
        adminEmail,
        adminDisplayName: `Loadlab Admin ${t}`,
      }),
    });

    for (let p = 1; p <= products; p++) {
      const product = await requestJson<{ id: string }>(`${control}/api/products`, {
        method: "POST",
        token,
        tenantId: tenant.id,
        body: JSON.stringify({ name: `Loadlab Product ${t}-${p}` }),
      });

      for (let s = 1; s <= services; s++) {
        const serviceName = `Loadlab Service ${t}-${p}-${s}`;
        const service = await requestJson<{ id: string }>(
          `${control}/api/products/${product.id}/services`,
          {
            method: "POST",
            token,
            tenantId: tenant.id,
            body: JSON.stringify({ name: serviceName }),
          },
        );

        const key = await requestJson<{ apiKey: string }>(
          `${control}/api/products/${product.id}/services/${service.id}/api-keys`,
          {
            method: "POST",
            token,
            tenantId: tenant.id,
            body: JSON.stringify({ name: `loadlab-key-${t}-${p}-${s}` }),
          },
        );

        const instance = await requestJson<{ id: string }>(`${ingest}/v1/instances`, {
          method: "POST",
          headers: { Authorization: `Bearer ${key.apiKey}` },
        });

        catalogServices.push({
          serviceId: service.id,
          apiKey: key.apiKey,
          instanceId: instance.id,
          tenantId: tenant.id,
          productId: product.id,
          name: serviceName,
        });
      }
    }
  }

  const createdAt = new Date().toISOString();
  const catalog: Catalog = {
    ingestBaseUrl: ingest,
    controlBaseUrl: control,
    createdAt,
    services: catalogServices,
  };
  await writeCatalog(catalog);

  return {
    tenants,
    products: tenants * products,
    services: catalogServices.length,
    createdAt,
  };
}

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, Math.trunc(value)));
}
