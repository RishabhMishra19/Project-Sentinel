import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useId } from "react";
import type { Percent } from "recharts/types/util/types";
import { ChartTooltip } from "./ChartTooltip";

export interface LineChartPoint extends Record<string, unknown> {
    timestamp: string;
}

export interface ChartLine<T extends LineChartPoint> {
    dataKey: keyof T;
    name: string;
    color?: string;
}

export interface SimpleLineChartProps<T extends LineChartPoint> {
    data: T[];
    lines: ChartLine<T>[];
    gradientColor?: string;
    width?: Percent | number;
    height?: Percent | number;
    fontSize?: number;
    fontColor?: React.CSSProperties["color"];
    showGrid?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    showTooltip?: boolean;
    showGradient?: boolean;
    className?: string;
}

export const SimpleLineChart = <T extends LineChartPoint>({
    data,
    lines,
    gradientColor = "#3c6ef5",
    width = "100%",
    height = "100%",
    fontSize = 8,
    fontColor = "#59687d",
    showGrid = false,
    showXAxis = false,
    showYAxis = false,
    showTooltip = true,
    showGradient = true,
    className = "",
}: SimpleLineChartProps<T>) => {
    const gradientId = useId().replace(/:/g, "");

    return (
        <div className={`min-h-[50px] min-w-full ${className}`}>
            <ResponsiveContainer width={width} height={height}>
                <AreaChart
                    data={data}
                    margin={{
                        top: 2,
                        right: 0,
                        left: !showYAxis ? 0 : 2,
                        bottom: 0,
                    }}
                >
                    {showGradient && (
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={gradientColor} stopOpacity={0.8} />

                                <stop offset="60%" stopColor={gradientColor} stopOpacity={0.5} />

                                <stop offset="100%" stopColor={gradientColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                    )}

                    {showGrid && (
                        <CartesianGrid stroke="#1e2b3e" strokeDasharray="3 3" vertical={false} />
                    )}

                    {showXAxis && (
                        <XAxis
                            dataKey="timestamp"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: fontColor,
                                fontSize,
                            }}
                        />
                    )}

                    <YAxis
                        domain={[0, "auto"]}
                        hide={!showYAxis}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                        tick={{
                            fill: fontColor,
                            fontSize,
                        }}
                    />

                    {showTooltip && (
                        <Tooltip
                            contentStyle={{
                                background: "#0b1220",
                                border: "1px solid #26354d",
                                borderRadius: "6px",
                                fontSize: "10px",
                            }}
                            content={ChartTooltip}
                            shared={false}
                        />
                    )}
                    {lines.map((line) => (
                        <Area
                            key={String(line.dataKey)}
                            type="monotone"
                            dataKey={String(line.dataKey)}
                            stroke={line.color}
                            strokeWidth={2}
                            fill={`url(#${gradientId})`}
                            dot={{
                                r: 1,
                                fill: line.color,
                                stroke: line.color,
                            }}
                            activeDot={true}
                            isAnimationActive={true}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
