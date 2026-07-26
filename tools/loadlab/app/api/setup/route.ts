import { NextResponse } from "next/server";
import { runSetup } from "@/lib/setup";
import type { SetupRequest } from "@/lib/types";
import { DEFAULTS } from "@/lib/config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SetupRequest>;
    const input: SetupRequest = {
      controlUrl: body.controlUrl?.trim() || DEFAULTS.controlUrl,
      ingestUrl: body.ingestUrl?.trim() || DEFAULTS.ingestUrl,
      email: body.email?.trim() || DEFAULTS.email,
      password: body.password || DEFAULTS.password,
      tenants: body.tenants ?? DEFAULTS.tenants,
      products: body.products ?? DEFAULTS.products,
      services: body.services ?? DEFAULTS.services,
    };
    const result = await runSetup(input);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Setup failed";
    const detail =
      err && typeof err === "object" && "body" in err
        ? String((err as { body: string }).body)
        : undefined;
    return NextResponse.json({ error: message, detail }, { status: 500 });
  }
}
