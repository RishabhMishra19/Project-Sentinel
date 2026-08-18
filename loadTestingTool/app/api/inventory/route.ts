import { NextResponse } from "next/server";
import { DEFAULTS } from "@/lib/config";
import { fetchInventory } from "@/lib/inventory";
import type { InventoryRequest } from "@/lib/inventoryTypes";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<InventoryRequest>;
    const input: InventoryRequest = {
      controlUrl: body.controlUrl?.trim() || DEFAULTS.controlUrl,
      email: body.email?.trim() || DEFAULTS.email,
      password: body.password || DEFAULTS.password,
    };
    const counts = await fetchInventory(input);
    return NextResponse.json(counts);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Inventory fetch failed";
    const detail =
      err && typeof err === "object" && "body" in err
        ? String((err as { body: string }).body)
        : undefined;
    return NextResponse.json({ error: message, detail }, { status: 500 });
  }
}
