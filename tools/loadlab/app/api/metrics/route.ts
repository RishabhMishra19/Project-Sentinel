import { NextResponse } from "next/server";
import { DEFAULTS } from "@/lib/config";
import { fetchPipelineMetrics } from "@/lib/metrics";
import type { MetricsRequest } from "@/lib/metricsTypes";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<MetricsRequest>;
    const input: MetricsRequest = {
      ingestUrl: body.ingestUrl?.trim() || DEFAULTS.ingestUrl,
      workerUrl: body.workerUrl?.trim() || DEFAULTS.workerUrl,
    };
    const metrics = await fetchPipelineMetrics(input);
    return NextResponse.json(metrics);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Metrics fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
