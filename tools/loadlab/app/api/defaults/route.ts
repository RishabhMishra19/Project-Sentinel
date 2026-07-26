import { NextResponse } from "next/server";
import { DEFAULTS } from "@/lib/config";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    controlUrl: DEFAULTS.controlUrl,
    ingestUrl: DEFAULTS.ingestUrl,
    workerUrl: DEFAULTS.workerUrl,
    email: DEFAULTS.email,
    password: DEFAULTS.password,
    tenants: DEFAULTS.tenants,
    products: DEFAULTS.products,
    services: DEFAULTS.services,
  });
}
