"use client";

import { GlassCard } from "@/components/layout/glass-card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SolarChargeProps } from "./widget-types";
import { cn } from "@/lib/utils";

const DEFAULT_DATA = [
  { date: "Mon", value: 8.2 },
  { date: "Tue", value: 10.1 },
  { date: "Wed", value: 12.4 },
  { date: "Thu", value: 9.8 },
  { date: "Fri", value: 11.2 },
  { date: "Sat", value: 14.0 },
  { date: "Sun", value: 12.4 },
];

export function SolarChargeWidget({
  title = "Solar Charge Collected Today",
  value = 12.4,
  unit = "kWh",
  data = DEFAULT_DATA,
  size = "md",
  className,
}: SolarChargeProps & { className?: string }) {
  return (
    <GlassCard
      className={cn(
        "p-4",
        size === "lg" && "p-5",
        size === "sm" && "p-3",
        className
      )}
    >
      <h3 className="text-card-title font-medium mb-2">{title}</h3>
      <p className="text-2xl font-bold text-accent-orange mb-4">
        {value} {unit}
      </p>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              formatter={(v: number) => [`${v} ${unit}`, "Value"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--accent-orange)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
