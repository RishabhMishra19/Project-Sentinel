import type { InventoryCounts, InventoryRequest } from "./inventoryTypes";

class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string,
  ) {
    super(message);
  }
}

type Page<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
};

async function requestJson<T>(
  url: string,
  init: RequestInit & { token?: string; tenantId?: string } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) {
    headers.set("Content-Type", "application/json");
  }
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

function emptyQuery(page: number, size: number) {
  return {
    pageable: { page, size },
    sortConfigs: [],
    searchConfigs: [],
    filterConfigs: [],
  };
}

async function searchAllIds(
  url: string,
  token: string,
  tenantId: string | undefined,
  idKey: "id",
): Promise<{ total: number; ids: string[] }> {
  const first = await requestJson<Page<{ id: string }>>(url, {
    method: "POST",
    token,
    tenantId,
    body: JSON.stringify(emptyQuery(0, 100)),
  });
  const ids = first.content.map((row) => row[idKey]);
  const totalPages = Math.ceil(first.totalElements / 100);
  for (let page = 1; page < totalPages; page++) {
    const next = await requestJson<Page<{ id: string }>>(url, {
      method: "POST",
      token,
      tenantId,
      body: JSON.stringify(emptyQuery(page, 100)),
    });
    for (const row of next.content) {
      ids.push(row[idKey]);
    }
  }
  return { total: first.totalElements, ids };
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

export async function fetchInventory(input: InventoryRequest): Promise<InventoryCounts> {
  const control = input.controlUrl.replace(/\/$/, "");
  const login = await requestJson<{ accessToken: string }>(`${control}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email: input.email, password: input.password }),
  });
  const token = login.accessToken;

  const tenants = await searchAllIds(`${control}/api/tenants/search`, token, undefined, "id");

  let products = 0;
  let services = 0;
  let endpoints = 0;
  const allServiceIds: { tenantId: string; serviceId: string }[] = [];

  for (const tenantId of tenants.ids) {
    const productPage = await requestJson<Page<{ id: string }>>(`${control}/api/products/search`, {
      method: "POST",
      token,
      tenantId,
      body: JSON.stringify(emptyQuery(0, 1)),
    });
    products += productPage.totalElements;

    const serviceSearch = await searchAllIds(
      `${control}/api/services/search`,
      token,
      tenantId,
      "id",
    );
    services += serviceSearch.total;
    for (const serviceId of serviceSearch.ids) {
      allServiceIds.push({ tenantId, serviceId });
    }
  }

  const endpointCounts = await mapPool(allServiceIds, 8, async ({ tenantId, serviceId }) => {
    const list = await requestJson<unknown[]>(
      `${control}/api/services/${serviceId}/endpoints`,
      {
        method: "GET",
        token,
        tenantId,
      },
    );
    return Array.isArray(list) ? list.length : 0;
  });
  endpoints = endpointCounts.reduce((sum, n) => sum + n, 0);

  return {
    tenants: tenants.total,
    products,
    services,
    endpoints,
    fetchedAt: new Date().toISOString(),
  };
}
