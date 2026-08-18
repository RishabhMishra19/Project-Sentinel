import { NextResponse } from "next/server";
import { stopRun } from "@/lib/k6Runner";

export const runtime = "nodejs";

export async function POST() {
  const status = await stopRun();
  return NextResponse.json(status);
}
