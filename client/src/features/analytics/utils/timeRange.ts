import type { AnalyticsBucket } from "../dto/request/analytics.request";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/** Default granularity for a range (also used when presets/custom range are applied). */
export const suggestedBucket = (fromIso: string, toIso: string): AnalyticsBucket => {
  const span = new Date(toIso).getTime() - new Date(fromIso).getTime();
  if (span <= SIX_HOURS_MS) return "MINUTE";
  if (span <= THIRTY_DAYS_MS) return "HOUR";
  return "DAY";
};

export const parseBucket = (raw: string | null): AnalyticsBucket | null => {
  if (raw === "MINUTE" || raw === "HOUR" || raw === "DAY") return raw;
  return null;
};

export const clampLogsRange = (
  fromIso: string,
  toIso: string,
): {
  from: string;
  to: string;
} => {
  const to = new Date(toIso);
  let from = new Date(fromIso);
  const maxMs = 7 * 24 * 60 * 60 * 1000;
  if (to.getTime() - from.getTime() > maxMs) {
    from = new Date(to.getTime() - maxMs);
  }
  return { from: from.toISOString(), to: to.toISOString() };
};

export const formatRate = (rate: number): string => {
  return `${(rate * 100).toFixed(2)}%`;
};

export const formatNumber = (n: number): string => {
  return new Intl.NumberFormat().format(n);
};
