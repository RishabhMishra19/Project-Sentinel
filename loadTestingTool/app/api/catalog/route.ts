import { NextResponse } from "next/server";
import { getCatalogStatus } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET() {
  const status = await getCatalogStatus();
  return NextResponse.json(status);
}
