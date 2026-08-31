import { SelectFilter } from "../../../shared/ui/filters/controls";
import { formatDouble } from "../../../shared/utils/numberUtils";
import { SimpleLineChart, type LineChartPoint, type SimpleLineChartProps } from "./SimpleLineChart";

export interface ChartLine<T extends Record<string, unknown>> {
    dataKey: keyof T;
    name: string;
    color: string;
}

interface ChartProps<T extends LineChartPoint> extends SimpleLineChartProps<T> {
    isLoading?: boolean;
    title: string;
    className?: string;
    selectFiels?: {
        options: { label: string; value: string }[];
        value: string;
        onChange: (val: string) => void;
    };
}

export const DashboardChart = <T extends LineChartPoint>({
    isLoading = false,
    title,
    className = "",
    selectFiels,
    ...simpleLineChartProps
}: ChartProps<T>) => {
    return (
        <div className={`h-full w-[49%] rounded-md bg-background px-5 py-2 my-2 ${className}`}>
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
                <div className="flex flex-col">
                    <span className="text-[12px] font-medium text-foreground">{title}</span>
                    {selectFiels && (
                        <div className="w-[170px]">
                            <SelectFilter
                                options={selectFiels.options}
                                value={selectFiels.value}
                                onChange={(val) => !!val && selectFiels.onChange(val)}
                                classname="text-[9px] h-[22px]"
                                hideAnyOption
                            />
                        </div>
                    )}
                </div>
                {/* Legend */}
                <div className="flex flex-col gap-x-3 gap-y-1 text-[8px]">
                    {simpleLineChartProps.lines.map((line) => (
                        <LineCurrentMetric
                            key={String(line.dataKey)}
                            color={line.color}
                            name={line.name}
                            dataKey={String(line.dataKey)}
                            data={simpleLineChartProps.data}
                        />
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="h-[150px]">
                {isLoading ? (
                    <>Loading...</>
                ) : (
                    <SimpleLineChart
                        showXAxis={true}
                        showYAxis={true}
                        showGradient={false}
                        showGrid={true}
                        height={150}
                        {...simpleLineChartProps}
                    />
                )}
            </div>
        </div>
    );
};

interface LineCurrentMetricProps {
    color: React.CSSProperties["color"];
    name: string;
    dataKey: string;
    data: Record<string, any>[];
    unit?: string;
}
const LineCurrentMetric = ({ color, name, dataKey, data }: LineCurrentMetricProps) => {
    const avgVal = data.length
        ? data.reduce((sum, value) => sum + value[dataKey], 0) / data.length
        : 0;
    const firstVal = (data[0]?.[dataKey] ?? 0) as number;
    const trend = firstVal > avgVal ? "-" : firstVal < avgVal ? "+" : "";
    const trendArrow = firstVal > avgVal ? "↓" : firstVal < avgVal ? "↑" : "";
    const trendPercentage = formatDouble(
        (Math.abs(avgVal * 1.0 - firstVal) * 100) / Math.max(1, firstVal),
    );

    return (
        <div className="text-foreground flex">
            <span
                className="mr-1"
                style={{
                    color: color,
                }}
            >
                ●
            </span>
            <span className="min-w-[60px]">{name} : </span>
            <span
                className={`${trend === "+" ? "text-green-800" : trend === "-" ? "text-red-800" : "text-foreground"} font-bold`}
            >
                {trend} {trendPercentage}% {trendArrow}
            </span>
            <span className="ml-1 text-foreground">vs Last 30m</span>
        </div>
    );
};
