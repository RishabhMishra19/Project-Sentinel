import { promises as fs } from "node:fs";
import { CATALOG_PATH } from "./config";
import type { Catalog, CatalogStatus } from "./types";

export async function readCatalog(): Promise<Catalog | null> {
  try {
    const raw = await fs.readFile(CATALOG_PATH, "utf8");
    return JSON.parse(raw) as Catalog;
  } catch {
    return null;
  }
}

export async function writeCatalog(catalog: Catalog): Promise<void> {
  await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog, null, 2), "utf8");
}

export async function getCatalogStatus(): Promise<CatalogStatus> {
  const catalog = await readCatalog();
  if (!catalog) {
    return {
      exists: false,
      createdAt: null,
      ingestBaseUrl: null,
      serviceCount: 0,
    };
  }
  return {
    exists: true,
    createdAt: catalog.createdAt,
    ingestBaseUrl: catalog.ingestBaseUrl,
    serviceCount: catalog.services.length,
  };
}
