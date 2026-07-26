import { NextResponse } from "next/server";
import { getRunStatus } from "@/lib/k6Runner";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getRunStatus());
}
