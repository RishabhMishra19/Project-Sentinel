import { inputClassName } from "../styles";
import type { FilterValue } from "../types";

type DateRangePreset = "1d" | "3d" | "10d" | "1M" | "3M" | "1Y";

const DATE_RANGE_PRESETS: DateRangePreset[] = ["1d", "3d", "10d", "1M", "3M", "1Y"];

export const PRESET_SUMMARY: Record<DateRangePreset, string> = {
  "1d": "Last 1 day",
  "3d": "Last 3 days",
  "10d": "Last 10 days",
  "1M": "Last 1 month",
  "3M": "Last 3 months",
  "1Y": "Last 1 year",
};

const toDateInput = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const fromDateForPreset = (preset: DateRangePreset, to: Date): Date => {
  const from = new Date(to);
  switch (preset) {
    case "1d":
      from.setDate(from.getDate() - 1);
      break;
    case "3d":
      from.setDate(from.getDate() - 3);
      break;
    case "10d":
      from.setDate(from.getDate() - 10);
      break;
    case "1M":
      from.setMonth(from.getMonth() - 1);
      break;
    case "3M":
      from.setMonth(from.getMonth() - 3);
      break;
    case "1Y":
      from.setFullYear(from.getFullYear() - 1);
      break;
  }
  return from;
};

export const dateRangeFromPreset = (preset: DateRangePreset): { from: string; to: string } => {
  const to = new Date();
  const from = fromDateForPreset(preset, to);
  return { from: toDateInput(from), to: toDateInput(to) };
};

export const matchDateRangePreset = (value: {
  from: string | null;
  to: string | null;
}): DateRangePreset | null => {
  if (!value.from || !value.to) return null;
  for (const preset of DATE_RANGE_PRESETS) {
    const next = dateRangeFromPreset(preset);
    if (next.from === value.from && next.to === value.to) return preset;
  }
  return null;
};

type DateRangeFilterProps = {
  value: FilterValue<"dateRange">;
  onChange: (value: FilterValue<"dateRange">) => void;
};

const chipClassName = (active: boolean) =>
  `shrink-0 rounded border px-1.5 py-1 text-xs font-medium ${
    active
      ? "border-accent bg-accent-soft text-accent"
      : "border-border text-foreground hover:bg-chrome"
  }`;

export const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  const range = value ?? { from: null, to: null };
  const matchedPreset = matchDateRangePreset(range);
  const isCustom = matchedPreset == null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] text-muted">Last</p>
        <div className="flex flex-nowrap gap-1">
          {DATE_RANGE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(dateRangeFromPreset(preset))}
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
            {PRESET_SUMMARY[matchedPreset]}
            {range.from && range.to ? ` (${range.from} – ${range.to})` : null}
          </p>
        ) : null}
      </div>

      {isCustom ? (
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-1 text-xs text-muted">
            From
            <input
              type="date"
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
              type="date"
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
