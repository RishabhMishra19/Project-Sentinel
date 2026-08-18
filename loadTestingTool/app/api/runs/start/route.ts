import { NextResponse } from "next/server";
import { DEFAULTS } from "@/lib/config";
import { startRun } from "@/lib/k6Runner";
import type { LoadKnobs } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LoadKnobs>;
    const knobs: LoadKnobs = {
      rps: body.rps ?? DEFAULTS.rps,
      totalRequests: body.totalRequests ?? DEFAULTS.totalRequests,
      errorPct: body.errorPct ?? DEFAULTS.errorPct,
      p50Ms: body.p50Ms ?? DEFAULTS.p50Ms,
      p95Ms: body.p95Ms ?? DEFAULTS.p95Ms,
      pathCardinality: body.pathCardinality ?? DEFAULTS.pathCardinality,
    };
    const status = await startRun(knobs);
    return NextResponse.json(status);
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code: string }).code)
        : undefined;
    const status = code === "RUN_ACTIVE" ? 409 : code === "NO_CATALOG" ? 400 : 500;
    const message = err instanceof Error ? err.message : "Failed to start run";
    return NextResponse.json({ error: message, code }, { status });
  }
}
