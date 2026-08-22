const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

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

export const formatDate = (date: string | undefined | null) => {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "/");
};

export const isoToDatetimeLocal = (iso: string | null): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const isoToDateLocal = (iso: string | null): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
};

export const datetimeLocalToIso = (local: string): string | null => {
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

export const toDayStartIso = (value: string): string => {
  if (DATE_ONLY.test(value)) {
    return new Date(`${value}T00:00:00.000Z`).toISOString();
  }
  return value;
};

export const toExclusiveDayEndIso = (value: string): string => {
  if (DATE_ONLY.test(value)) {
    const d = new Date(`${value}T00:00:00.000Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString();
  }
  return value;
};

export const isValidDate = (dateString: string | undefined | null) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
