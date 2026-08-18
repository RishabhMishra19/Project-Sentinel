/**
 * Formats an ISO / parseable date-time for display.
 * Returns `empty` when value is nullish; returns the raw string when unparseable.
 */
export const formatDateTime = (
  value: string | null | undefined,
  empty = "—",
): string => {
  if (!value) {
    return empty;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};
