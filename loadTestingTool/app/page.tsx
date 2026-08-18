"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { InventoryCounts } from "@/lib/inventoryTypes";
import type { PipelineMetrics } from "@/lib/metricsTypes";
import type { CatalogStatus, RunStatus, SetupResult } from "@/lib/types";

const defaultSeed = {
  controlUrl: "http://localhost:8080",
  ingestUrl: "http://localhost:8081",
  workerUrl: "http://localhost:8082",
  email: "rishabhpndt19@gmail.com",
  password: "Admin@123",
  tenants: 3,
  products: 2,
  services: 3,
};

function fmtCount(value: number | null | undefined): string {
  if (value == null) {
    return "—";
  }
  return Math.round(value).toLocaleString();
}

function fmtMs(value: number | null | undefined): string {
  if (value == null) {
    return "—";
  }
  return `${value < 10 ? value.toFixed(2) : value.toFixed(1)} ms`;
}

function fmtAvg(value: number | null | undefined): string {
  if (value == null) {
    return "—";
  }
  return value < 10 ? value.toFixed(2) : value.toFixed(1);
}

const defaultLoad = {
  rps: 100,
  totalRequests: 10_000,
  errorPct: 5,
  p50Ms: 40,
  p95Ms: 200,
  pathCardinality: 20,
};

export default function HomePage() {
  const [seed, setSeed] = useState(defaultSeed);
  const [load, setLoad] = useState(defaultLoad);
  const [catalog, setCatalog] = useState<CatalogStatus | null>(null);
  const [inventory, setInventory] = useState<InventoryCounts | null>(null);
  const [inventoryBusy, setInventoryBusy] = useState(false);
  const [inventoryErr, setInventoryErr] = useState<string | null>(null);
  const [setupBusy, setSetupBusy] = useState(false);
  const [setupMsg, setSetupMsg] = useState<string | null>(null);
  const [setupErr, setSetupErr] = useState<string | null>(null);
  const [run, setRun] = useState<RunStatus | null>(null);
  const [runErr, setRunErr] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [metricsBusy, setMetricsBusy] = useState(false);
  const [metricsErr, setMetricsErr] = useState<string | null>(null);

  const estDurationSec = useMemo(
    () => Math.max(1, Math.ceil(load.totalRequests / Math.max(1, load.rps))),
    [load.totalRequests, load.rps],
  );
  const catalogServices = seed.tenants * seed.products * seed.services;

  const refreshCatalog = useCallback(async () => {
    const res = await fetch("/api/catalog");
    const data = (await res.json()) as CatalogStatus;
    setCatalog(data);
  }, []);

  const refreshInventory = useCallback(async () => {
    setInventoryBusy(true);
    setInventoryErr(null);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          controlUrl: seed.controlUrl,
          email: seed.email,
          password: seed.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || "Failed to load inventory");
      }
      setInventory(data as InventoryCounts);
    } catch (err) {
      setInventoryErr(err instanceof Error ? err.message : "Failed to load inventory");
    } finally {
      setInventoryBusy(false);
    }
  }, [seed.controlUrl, seed.email, seed.password]);

  const refreshRun = useCallback(async () => {
    const res = await fetch("/api/runs/status");
    const data = (await res.json()) as RunStatus;
    setRun(data);
  }, []);

  const refreshMetrics = useCallback(async (opts?: { quiet?: boolean }) => {
    if (!opts?.quiet) {
      setMetricsBusy(true);
    }
    setMetricsErr(null);
    try {
      const res = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingestUrl: seed.ingestUrl,
          workerUrl: seed.workerUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load metrics");
      }
      setMetrics(data as PipelineMetrics);
    } catch (err) {
      setMetricsErr(err instanceof Error ? err.message : "Failed to load metrics");
    } finally {
      if (!opts?.quiet) {
        setMetricsBusy(false);
      }
    }
  }, [seed.ingestUrl, seed.workerUrl]);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/defaults");
        if (res.ok) {
          const data = (await res.json()) as Partial<typeof defaultSeed>;
          setSeed((prev) => ({
            ...prev,
            controlUrl: data.controlUrl ?? prev.controlUrl,
            ingestUrl: data.ingestUrl ?? prev.ingestUrl,
            workerUrl: data.workerUrl ?? prev.workerUrl,
            email: data.email ?? prev.email,
            password: data.password ?? prev.password,
            tenants: data.tenants ?? prev.tenants,
            products: data.products ?? prev.products,
            services: data.services ?? prev.services,
          }));
        }
      } catch {
        // keep local defaults
      } finally {
        void refreshCatalog();
        void refreshRun();
      }
    })();
  }, [refreshCatalog, refreshRun]);

  useEffect(() => {
    void refreshInventory();
    void refreshMetrics();
  }, [refreshInventory, refreshMetrics]);

  useEffect(() => {
    if (!run?.running) {
      return;
    }
    const id = setInterval(() => {
      void refreshRun();
    }, 1000);
    return () => clearInterval(id);
  }, [run?.running, refreshRun]);

  useEffect(() => {
    const id = setInterval(() => {
      void refreshMetrics({ quiet: true });
    }, run?.running ? 1500 : 4000);
    return () => clearInterval(id);
  }, [run?.running, refreshMetrics]);

  useEffect(() => {
    if (run?.running === false && run.finishedAt) {
      void refreshInventory();
      void refreshMetrics({ quiet: true });
    }
  }, [run?.running, run?.finishedAt, refreshInventory, refreshMetrics]);

  async function onSeed(e: FormEvent) {
    e.preventDefault();
    setSetupBusy(true);
    setSetupMsg(null);
    setSetupErr(null);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seed),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || "Seed failed");
      }
      const result = data as SetupResult;
      setSetupMsg(
        `Seeded ${result.tenants} tenant(s), ${result.products} product(s), ${result.services} service(s).`,
      );
      await refreshCatalog();
      await refreshInventory();
    } catch (err) {
      setSetupErr(err instanceof Error ? err.message : "Seed failed");
    } finally {
      setSetupBusy(false);
    }
  }

  async function onStart(e: FormEvent) {
    e.preventDefault();
    setRunErr(null);
    try {
      const res = await fetch("/api/runs/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(load),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to start");
      }
      setRun(data as RunStatus);
    } catch (err) {
      setRunErr(err instanceof Error ? err.message : "Failed to start");
    }
  }

  async function onStop() {
    setRunErr(null);
    const res = await fetch("/api/runs/stop", { method: "POST" });
    const data = (await res.json()) as RunStatus;
    setRun(data);
    await refreshInventory();
  }

  return (
    <main>
      <header className="hero">
        <h1>Sentinel Loadlab</h1>
        <p>
          Seed many tenants/products/services, then send a fixed total of{" "}
          <code>POST /v1/events</code> calls (spread across all services + fake endpoints) into
          Kafka <code>sentinel.request-events</code>.
        </p>
      </header>

      <section className="stats" aria-label="Current catalog counts">
        <div className="stat">
          <span className="label">Tenants</span>
          <span className="value">{inventoryBusy && !inventory ? "…" : (inventory?.tenants ?? "—")}</span>
        </div>
        <div className="stat">
          <span className="label">Products</span>
          <span className="value">{inventoryBusy && !inventory ? "…" : (inventory?.products ?? "—")}</span>
        </div>
        <div className="stat">
          <span className="label">Services</span>
          <span className="value">{inventoryBusy && !inventory ? "…" : (inventory?.services ?? "—")}</span>
        </div>
        <div className="stat">
          <span className="label">Endpoints</span>
          <span className="value">{inventoryBusy && !inventory ? "…" : (inventory?.endpoints ?? "—")}</span>
        </div>
        <div className="stats-actions">
          <button
            className="btn secondary"
            type="button"
            onClick={() => void refreshInventory()}
            disabled={inventoryBusy}
          >
            {inventoryBusy ? "Refreshing…" : "Refresh counts"}
          </button>
        </div>
      </section>
      <p className="stats-meta">
        Live counts from Control API (all tenants).
        {inventory?.fetchedAt ? ` Last updated ${inventory.fetchedAt}.` : ""}
        {inventoryErr ? ` Error: ${inventoryErr}` : ""}
        {" "}Endpoints stay 0 until the worker consumes events and creates them.
      </p>

      <section className="stats metrics" aria-label="Pipeline Prometheus metrics">
        <div className="stat">
          <span className="label">Ingest published</span>
          <span className="value">
            {metricsBusy && !metrics ? "…" : fmtCount(metrics?.ingest.eventsPublished)}
          </span>
        </div>
        <div className="stat">
          <span className="label">Ingest requests</span>
          <span className="value">
            {metricsBusy && !metrics ? "…" : fmtCount(metrics?.ingest.requests)}
          </span>
        </div>
        <div className="stat">
          <span className="label">Avg publish</span>
          <span className="value">
            {metricsBusy && !metrics ? "…" : fmtMs(metrics?.ingest.avgPublishMs)}
          </span>
        </div>
        <div className="stat">
          <span className="label">Worker processed</span>
          <span className="value">
            {metricsBusy && !metrics ? "…" : fmtCount(metrics?.worker.eventsProcessed)}
          </span>
        </div>
        <div className="stat">
          <span className="label">Batches ok</span>
          <span className="value">
            {metricsBusy && !metrics ? "…" : fmtCount(metrics?.worker.batchesProcessed)}
          </span>
        </div>
        <div className="stat">
          <span className="label">Batches failed</span>
          <span className="value">
            {metricsBusy && !metrics ? "…" : fmtCount(metrics?.worker.batchesFailed)}
          </span>
        </div>
        <div className="stat">
          <span className="label">Avg batch size</span>
          <span className="value">
            {metricsBusy && !metrics ? "…" : fmtAvg(metrics?.worker.avgBatchSize)}
          </span>
        </div>
        <div className="stat">
          <span className="label">Avg batch time</span>
          <span className="value">
            {metricsBusy && !metrics ? "…" : fmtMs(metrics?.worker.avgBatchMs)}
          </span>
        </div>
        <div className="stat">
          <span className="label">Avg per event</span>
          <span className="value">
            {metricsBusy && !metrics ? "…" : fmtMs(metrics?.worker.avgPerEventMs)}
          </span>
        </div>
        <div className="stats-actions">
          <button
            className="btn secondary"
            type="button"
            onClick={() => void refreshMetrics()}
            disabled={metricsBusy}
          >
            {metricsBusy ? "Refreshing…" : "Refresh metrics"}
          </button>
        </div>
      </section>
      <p className="stats-meta">
        Custom Micrometer metrics from{" "}
        <code>/actuator/prometheus</code> on ingest + worker.
        {metrics?.fetchedAt ? ` Last updated ${metrics.fetchedAt}.` : ""}
        {metricsErr ? ` Error: ${metricsErr}` : ""}
        {!metricsErr && metrics?.ingest.error ? ` Ingest: ${metrics.ingest.error}.` : ""}
        {!metricsErr && metrics?.worker.error ? ` Worker: ${metrics.worker.error}.` : ""}
      </p>

      <div className="grid">
        <section className="panel">
          <h2>1. Seed catalog</h2>
          <form onSubmit={onSeed}>
            <div className="fields">
              <label className="full">
                Control URL
                <input
                  value={seed.controlUrl}
                  onChange={(e) => setSeed({ ...seed, controlUrl: e.target.value })}
                />
              </label>
              <label className="full">
                Ingest URL
                <input
                  value={seed.ingestUrl}
                  onChange={(e) => setSeed({ ...seed, ingestUrl: e.target.value })}
                />
              </label>
              <label className="full">
                Worker URL
                <input
                  value={seed.workerUrl}
                  onChange={(e) => setSeed({ ...seed, workerUrl: e.target.value })}
                />
              </label>
              <label>
                Admin email
                <input
                  value={seed.email}
                  onChange={(e) => setSeed({ ...seed, email: e.target.value })}
                />
              </label>
              <label>
                Admin password
                <input
                  type="password"
                  value={seed.password}
                  onChange={(e) => setSeed({ ...seed, password: e.target.value })}
                />
              </label>
              <label>
                Tenants
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={seed.tenants}
                  onChange={(e) => setSeed({ ...seed, tenants: Number(e.target.value) })}
                />
              </label>
              <label>
                Products / tenant
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={seed.products}
                  onChange={(e) => setSeed({ ...seed, products: Number(e.target.value) })}
                />
              </label>
              <label>
                Services / product
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={seed.services}
                  onChange={(e) => setSeed({ ...seed, services: Number(e.target.value) })}
                />
              </label>
            </div>
            <div className="actions">
              <button className="btn" type="submit" disabled={setupBusy}>
                {setupBusy ? "Seeding…" : "Seed catalog"}
              </button>
            </div>
          </form>
          {setupMsg && <p className="status ok">{setupMsg}</p>}
          {setupErr && <p className="status err">{setupErr}</p>}
          <p className="status">
            Will create ~<strong>{catalogServices}</strong> services (
            {seed.tenants}×{seed.products}×{seed.services}). Catalog:{" "}
            <strong>
              {catalog?.exists
                ? `${catalog.serviceCount} service(s) · ${catalog.createdAt}`
                : "not seeded yet"}
            </strong>
          </p>
        </section>

        <section className="panel">
          <h2>2. Load /v1/events</h2>
          <form onSubmit={onStart}>
            <div className="fields">
              <label>
                Total requests
                <input
                  type="number"
                  min={1}
                  max={10_000_000}
                  value={load.totalRequests}
                  onChange={(e) => setLoad({ ...load, totalRequests: Number(e.target.value) })}
                />
              </label>
              <label>
                RPS (up to 10000/sec)
                <input
                  type="number"
                  min={1}
                  max={10_000}
                  value={load.rps}
                  onChange={(e) => setLoad({ ...load, rps: Number(e.target.value) })}
                />
              </label>
              <label>
                Error %
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={load.errorPct}
                  onChange={(e) => setLoad({ ...load, errorPct: Number(e.target.value) })}
                />
              </label>
              <label>
                p50 durationMs
                <input
                  type="number"
                  min={0}
                  value={load.p50Ms}
                  onChange={(e) => setLoad({ ...load, p50Ms: Number(e.target.value) })}
                />
              </label>
              <label>
                p95 durationMs
                <input
                  type="number"
                  min={0}
                  value={load.p95Ms}
                  onChange={(e) => setLoad({ ...load, p95Ms: Number(e.target.value) })}
                />
              </label>
              <label>
                Path cardinality (endpoints)
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={load.pathCardinality}
                  onChange={(e) =>
                    setLoad({ ...load, pathCardinality: Number(e.target.value) })
                  }
                />
              </label>
            </div>
            <div className="actions">
              <button className="btn" type="submit" disabled={!!run?.running}>
                Start load
              </button>
              <button
                className="btn danger"
                type="button"
                onClick={() => void onStop()}
                disabled={!run?.running}
              >
                Stop
              </button>
            </div>
          </form>
          {runErr && <p className="status err">{runErr}</p>}
          <p className="status">
            ~<strong>{estDurationSec}s</strong> at {load.rps}/sec ·{" "}
            <strong>{load.totalRequests.toLocaleString()}</strong> requests (= events) · 1 event per
            POST · spread across all seeded services + {load.pathCardinality} endpoint paths
          </p>
        </section>
      </div>

      <section className="panel log-panel">
        <h2>Run output</h2>
        <div className="meta">
          <span className="pill">
            <span className={`dot ${run?.running ? "on" : ""}`} />
            {run?.running ? "running" : "idle"}
          </span>
          {run?.startedAt && <span>started {run.startedAt}</span>}
          {run?.finishedAt && <span>finished {run.finishedAt}</span>}
          {run?.exitCode !== null && run?.exitCode !== undefined && (
            <span>exit {run.exitCode}</span>
          )}
          {run?.error && <span className="status err">{run.error}</span>}
        </div>
        <pre className="log">{run?.logTail || "Seed catalog, then start a load run. k6 output appears here."}</pre>
      </section>
    </main>
  );
}
