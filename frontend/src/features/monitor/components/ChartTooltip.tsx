import type { TooltipContentProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { formatDouble } from "../../../shared/utils/numberUtils";

export const ChartTooltip = ({ active, payload }: TooltipContentProps<ValueType, NameType>) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const timestamp = payload?.[0]?.payload?.timestamp;

    return (
        <div className="rounded-md border border-border bg-[#0b1220] px-2 py-1.5 shadow-lg">
            <div className="mb-0.5 text-[8px] text-background">{timestamp}</div>
            {payload.map((entry, index) => (
                <div
                    key={`${String(entry.dataKey)}-${index}`}
                    className="flex items-center gap-1.5"
                >
                    <span
                        className="h-1.5 w-1.5 rounded-full text-background"
                        style={{
                            backgroundColor: entry.color,
                        }}
                    />
                    <span
                        className="text-[9px] font-medium"
                        style={{
                            color: entry.color,
                        }}
                    >
                        {String(entry.name ?? entry.dataKey)}
                    </span>
                    <span className="text-[9px] text-background">
                        {typeof entry.value === "number" ? formatDouble(entry.value) : entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};
