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
      <div className="bg-white/95 backdrop-blur-md p-3.5 border border-slate-200 rounded-xl shadow-lg text-xs space-y-2">
        <p className="font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center justify-between gap-4">
          <span>Exam Year:</span>
          <span className="text-[#3730A3] font-mono">{label}</span>
        </p>
        <div className="space-y-1.5">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium truncate max-w-[140px]">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </span>
              <span className="font-mono font-bold text-slate-900">{entry.value}%</span>
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
        icon={<TrendingUp className="w-6 h-6 text-slate-400" />}
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
    <div className="bg-white rounded-[12px] p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#3730A3]" />
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Filter Toggle Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Toggle:
          </span>
          {topics.map((t) => {
            const isVisible = activeTopics[t.key] ?? true;
            return (
              <button
                key={t.key}
                onClick={() => toggleTopic(t.key)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                  isVisible
                    ? "bg-slate-50 border-slate-300 text-slate-800 shadow-2xs"
                    : "bg-slate-100/50 border-transparent text-slate-400 opacity-60"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
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
