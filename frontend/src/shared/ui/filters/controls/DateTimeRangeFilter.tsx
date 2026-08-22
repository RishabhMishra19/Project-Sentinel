import { inputClassName } from "../styles";
import type { FilterValue } from "../types";

export type DateTimeRangePreset = "1h" | "6h" | "24h" | "3d" | "7d";

const DATE_TIME_RANGE_PRESETS: DateTimeRangePreset[] = ["1h", "6h", "24h", "3d", "7d"];

export const DATE_TIME_PRESET_SUMMARY: Record<DateTimeRangePreset, string> = {
  "1h": "Last 1 hour",
  "6h": "Last 6 hours",
  "24h": "Last 24 hours",
  "3d": "Last 3 days",
  "7d": "Last 7 days",
};

const PRESET_MS: Record<DateTimeRangePreset, number> = {
  "1h": 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "3d": 3 * 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
};

/** Date → value for <input type="datetime-local"> (local timezone). */
const toDatetimeLocalValue = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const dateTimeRangeFromPreset = (
  preset: DateTimeRangePreset,
): { from: string; to: string } => {
  const to = new Date();
  const from = new Date(to.getTime() - PRESET_MS[preset]);
  return {
    from: toDatetimeLocalValue(from),
    to: toDatetimeLocalValue(to),
  };
};

export const matchDateTimeRangePreset = (value: {
  from: string | null;
  to: string | null;
}): DateTimeRangePreset | null => {
  if (!value.from || !value.to) return null;
  const fromMs = new Date(value.from).getTime();
  const toMs = new Date(value.to).getTime();
  if (Number.isNaN(fromMs) || Number.isNaN(toMs)) return null;

  const span = toMs - fromMs;
  const nowDrift = Math.abs(Date.now() - toMs);
  // Relative presets expect `to` ≈ now; allow a couple minutes of drift.
  if (nowDrift > 2 * 60 * 1000) return null;

  for (const preset of DATE_TIME_RANGE_PRESETS) {
    if (Math.abs(span - PRESET_MS[preset]) < 60 * 1000) return preset;
  }
  return null;
};

type DateTimeRangeFilterProps = {
  value: FilterValue<"dateTimeRange">;
  onChange: (value: FilterValue<"dateTimeRange">) => void;
  classname?: string;
};

const chipClassName = (active: boolean) =>
  `shrink-0 rounded border px-1.5 py-1 text-xs font-medium ${
    active
      ? "border-accent bg-accent-soft text-accent"
      : "border-border text-foreground hover:bg-chrome"
  }`;

export const DateTimeRangeFilter = ({ value, onChange, classname }: DateTimeRangeFilterProps) => {
  const range = value ?? { from: null, to: null };
  const matchedPreset = matchDateTimeRangePreset(range);
  const isCustom = matchedPreset == null;

  return (
    <div className={`flex flex-col gap-3 ${classname}`}>
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] text-muted">Last</p>
        <div className="flex flex-nowrap gap-1">
          {DATE_TIME_RANGE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(dateTimeRangeFromPreset(preset))}
              className={chipClassName(matchedPreset === preset)}
            >
              {preset}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              if (isCustom) return;
              onChange({ from: null, to: null });
            }}
            className={chipClassName(isCustom)}
          >
            Custom
          </button>
        </div>
        {!isCustom && matchedPreset ? (
          <p className="text-[11px] text-muted">
            {DATE_TIME_PRESET_SUMMARY[matchedPreset]}
            {range.from && range.to ? ` (${range.from} – ${range.to})` : null}
          </p>
        ) : null}
      </div>

      {isCustom ? (
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-1 text-xs text-muted">
            From
            <input
              type="datetime-local"
              className={inputClassName}
              value={range.from ?? ""}
              onChange={(event) =>
                onChange({
                  from: event.target.value || null,
                  to: range.to,
                })
              }
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted">
            To
            <input
              type="datetime-local"
              className={inputClassName}
              value={range.to ?? ""}
              onChange={(event) =>
                onChange({
                  from: range.from,
                  to: event.target.value || null,
                })
              }
            />
          </label>
        </div>
      ) : null}
    </div>
  );
};
