/**
 * Formats an ISO / parseable date-time for display.
 * Returns `empty` when value is nullish; returns the raw string when unparseable.
 */
export const formatDateTime = (value: string | null | undefined, empty = "—"): string => {
  if (!value) {
    return empty;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

export const isoToDatetimeLocal = (iso: string | null): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const datetimeLocalToIso = (local: string): string | null => {
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};
