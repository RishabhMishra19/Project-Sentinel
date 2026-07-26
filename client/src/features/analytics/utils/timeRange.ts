import type { AnalyticsBucket } from "../dto/request/analytics.request";

export type TimePreset = "1h" | "6h" | "24h" | "7d" | "30d" | "90d";

const PRESET_MS: Record<TimePreset, number> = {
  "1h": 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
};

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function rangeFromPreset(preset: TimePreset): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getTime() - PRESET_MS[preset]);
  return { from: from.toISOString(), to: to.toISOString() };
}

/** Default granularity for a range (also used when presets/custom range are applied). */
export function suggestedBucket(fromIso: string, toIso: string): AnalyticsBucket {
  const span = new Date(toIso).getTime() - new Date(fromIso).getTime();
  if (span <= SIX_HOURS_MS) return "MINUTE";
  if (span <= THIRTY_DAYS_MS) return "HOUR";
  return "DAY";
}

export function parseBucket(raw: string | null): AnalyticsBucket | null {
  if (raw === "MINUTE" || raw === "HOUR" || raw === "DAY") return raw;
  return null;
}

/** ISO → value for <input type="datetime-local"> (local timezone). */
export function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** datetime-local value → ISO string. */
export function fromDatetimeLocalValue(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function clampLogsRange(
  fromIso: string,
  toIso: string,
): {
  from: string;
  to: string;
} {
  const to = new Date(toIso);
  let from = new Date(fromIso);
  const maxMs = 7 * 24 * 60 * 60 * 1000;
  if (to.getTime() - from.getTime() > maxMs) {
    from = new Date(to.getTime() - maxMs);
  }
  return { from: from.toISOString(), to: to.toISOString() };
}

export function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n);
}
