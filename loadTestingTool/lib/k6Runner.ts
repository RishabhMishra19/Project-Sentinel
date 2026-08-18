import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { DATA_DIR, K6_SCRIPT_PATH, ROOT_DIR, RUN_STATE_PATH } from "./config";
import { readCatalog } from "./catalog";
import type { LoadKnobs, RunStatus } from "./types";

function resolveK6Bin(): string {
  const local = path.join(ROOT_DIR, ".bin", "k6");
  if (existsSync(local)) {
    return local;
  }
  return "k6";
}

type RunnerState = {
  child: ChildProcessWithoutNullStreams | null;
  status: RunStatus;
};

declare global {
  var __loadlabRunner: RunnerState | undefined;
}

function getState(): RunnerState {
  if (!globalThis.__loadlabRunner) {
    globalThis.__loadlabRunner = {
      child: null,
      status: {
        running: false,
        startedAt: null,
        finishedAt: null,
        exitCode: null,
        logTail: "",
        error: null,
      },
    };
  }
  return globalThis.__loadlabRunner;
}

const MAX_LOG_CHARS = 40_000;

function appendLog(chunk: string): void {
  const state = getState();
  state.status.logTail = (state.status.logTail + chunk).slice(-MAX_LOG_CHARS);
}

async function persistStatus(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const { status } = getState();
  await fs.writeFile(RUN_STATE_PATH, JSON.stringify(status, null, 2), "utf8");
}

export function getRunStatus(): RunStatus {
  return { ...getState().status };
}

export async function startRun(knobs: LoadKnobs): Promise<RunStatus> {
  const state = getState();
  if (state.child) {
    const err = new Error("A load run is already active");
    (err as Error & { code: string }).code = "RUN_ACTIVE";
    throw err;
  }

  const catalog = await readCatalog();
  if (!catalog || catalog.services.length === 0) {
    const err = new Error("Catalog is missing. Seed first.");
    (err as Error & { code: string }).code = "NO_CATALOG";
    throw err;
  }

  const rps = clamp(knobs.rps, 1, 10_000);
  const totalRequests = clamp(knobs.totalRequests, 1, 10_000_000);
  const errorPct = clamp(knobs.errorPct, 0, 100);
  const p50Ms = clamp(knobs.p50Ms, 0, 60_000);
  const p95Ms = clamp(knobs.p95Ms, p50Ms, 120_000);
  const pathCardinality = clamp(knobs.pathCardinality, 1, 200);
  const durationSec = Math.max(1, Math.ceil(totalRequests / rps));

  state.status = {
    running: true,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    exitCode: null,
    logTail:
      `Starting k6 across ${catalog.services.length} service(s): ` +
      `RPS=${rps} TOTAL_REQUESTS=${totalRequests} (~${durationSec}s) · 1 event per request\n`,
    error: null,
  };
  await persistStatus();

  const child = spawn(
    resolveK6Bin(),
    [
      "run",
      "-e",
      `RPS=${rps}`,
      "-e",
      `TOTAL_REQUESTS=${totalRequests}`,
      "-e",
      `ERROR_PCT=${errorPct}`,
      "-e",
      `P50_MS=${p50Ms}`,
      "-e",
      `P95_MS=${p95Ms}`,
      "-e",
      `PATH_CARDINALITY=${pathCardinality}`,
      "-e",
      `CATALOG_PATH=${process.cwd()}/catalog.json`,
      K6_SCRIPT_PATH,
    ],
    {
      cwd: process.cwd(),
      env: process.env,
    },
  );

  state.child = child;

  child.stdout.on("data", (buf: Buffer) => appendLog(buf.toString("utf8")));
  child.stderr.on("data", (buf: Buffer) => appendLog(buf.toString("utf8")));

  child.on("error", (err) => {
    state.status.error = err.message;
    state.status.running = false;
    state.status.finishedAt = new Date().toISOString();
    state.child = null;
    void persistStatus();
  });

  child.on("close", (code) => {
    state.status.running = false;
    state.status.exitCode = code;
    state.status.finishedAt = new Date().toISOString();
    appendLog(`\n[k6 exited with code ${code}]\n`);
    state.child = null;
    void persistStatus();
  });

  return getRunStatus();
}

export async function stopRun(): Promise<RunStatus> {
  const state = getState();
  if (!state.child) {
    return getRunStatus();
  }
  appendLog("\n[stopping k6…]\n");
  state.child.kill("SIGTERM");
  return getRunStatus();
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, Math.trunc(value)));
}
