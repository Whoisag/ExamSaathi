"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendDataPoint } from "@/data/mock";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { TrendingUp, Filter } from "lucide-react";

interface TrendTopic {
  key: string;
  name: string;
  color: string;
}

interface TrendChartProps {
  data?: TrendDataPoint[] | null;
  topics?: TrendTopic[];
  isLoading?: boolean;
  isEmpty?: boolean;
  title?: string;
  subtitle?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-3.5 border-2 border-black shadow-[4px_4px_0px_0px_#FF4D00] font-meta text-xs space-y-2">
        <p className="font-bold text-white border-b border-neutral-800 pb-1 flex items-center justify-between gap-4">
          <span>EXAM YEAR:</span>
          <span className="text-[#FF4D00] font-mono font-bold">{label}</span>
        </p>
        <div className="space-y-1.5">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5 text-neutral-300 font-medium truncate max-w-[140px]">
                <span
                  className="w-2.5 h-2.5 shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </span>
              <span className="font-mono font-bold text-[#FF4D00]">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function TrendChart({
  data,
  topics = [],
  isLoading = false,
  isEmpty = false,
  title = "Topic Weightage Trends Over Time",
  subtitle = "Multi-year percentage of total question paper marks",
}: TrendChartProps) {
  // Topic active filter toggle state
  const [activeTopics, setActiveTopics] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    topics.forEach((t) => {
      initial[t.key] = true;
    });
    return initial;
  });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (isEmpty || !data || data.length === 0) {
    return (
      <EmptyState
        icon={<TrendingUp className="w-6 h-6 text-neutral-400" />}
        title="No Trend Data Available"
        description="Unable to generate historical line chart for the selected subject."
      />
    );
  }

  const toggleTopic = (key: string) => {
    setActiveTopics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-4 sm:p-6 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-neutral-100">
        <div>
          <h3 className="font-headline text-base sm:text-xl text-black flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FF4D00]" />
            {title}
          </h3>
          <p className="font-meta text-xs text-neutral-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Filter Toggle Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-meta text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> TOGGLE:
          </span>
          {topics.map((t) => {
            const isVisible = activeTopics[t.key] ?? true;
            return (
              <button
                key={t.key}
                onClick={() => toggleTopic(t.key)}
                className={`px-3 py-1 font-meta text-xs transition-all flex items-center gap-1.5 border-2 border-black ${
                  isVisible
                    ? "bg-black text-white shadow-[2px_2px_0px_0px_#000000]"
                    : "bg-neutral-100 text-neutral-400 border-neutral-300 opacity-60"
                }`}
              >
                <span
                  className="w-2 h-2"
                  style={{ backgroundColor: isVisible ? t.color : "#94a3b8" }}
                />
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recharts Responsive Line Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#94a3b8"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              unit="%"
              domain={[0, "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              formatter={(value) => {
                const topic = topics.find((t) => t.key === value);
                return <span className="text-slate-700 font-medium">{topic?.name || value}</span>;
              }}
            />
            {topics.map((t) => {
              const isVisible = activeTopics[t.key] ?? true;
              return (
                <Line
                  key={t.key}
                  type="monotone"
                  dataKey={t.key}
                  name={t.key}
                  stroke={t.color}
                  strokeWidth={isVisible ? 2.5 : 0}
                  dot={isVisible ? { r: 3.5, fill: t.color } : false}
                  activeDot={isVisible ? { r: 6, stroke: "#ffffff", strokeWidth: 2 } : false}
                  hide={!isVisible}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
