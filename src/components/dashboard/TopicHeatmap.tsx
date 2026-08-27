"use client";

import React, { useState } from "react";
import { HeatmapData } from "@/data/mock";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Grid, Hash, Percent, Info } from "lucide-react";

interface TopicHeatmapProps {
  data?: HeatmapData | null;
  isLoading?: boolean;
  isEmpty?: boolean;
  title?: string;
  subtitle?: string;
}

export function TopicHeatmap({
  data,
  isLoading = false,
  isEmpty = false,
  title = "Topic Frequency Heatmap",
  subtitle = "Historical distribution across verified question papers (2019 - 2025)",
}: TopicHeatmapProps) {
  const [displayMode, setDisplayMode] = useState<"count" | "percentage">("count");
  const [hoveredCell, setHoveredCell] = useState<{
    topicName: string;
    year: number;
    count: number;
    percentage: number;
  } | null>(null);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (isEmpty || !data || data.topics.length === 0) {
    return (
      <EmptyState
        icon={<Grid className="w-6 h-6 text-slate-400" />}
        title="No Heatmap Data Available"
        description="Historical topic distribution data is currently unavailable for this subject selection."
      />
    );
  }

  const { years, topics } = data;

  // Calculate maximum count to normalize cell color intensity
  const maxCount = Math.max(
    1,
    ...topics.flatMap((t) =>
      years.map((y) => t.yearsData[y]?.count || 0)
    )
  );

  const getCellBgColor = (count: number) => {
    if (count === 0) return "bg-slate-50 text-slate-300";
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "bg-indigo-50 text-[#3730A3] hover:bg-indigo-100 font-medium";
    if (ratio <= 0.5) return "bg-indigo-100 text-[#3730A3] hover:bg-indigo-200 font-semibold";
    if (ratio <= 0.75) return "bg-indigo-300 text-indigo-950 hover:bg-indigo-400 font-bold";
    return "bg-[#3730A3] text-white hover:bg-[#312E81] font-bold";
  };

  return (
    <div className="bg-white rounded-[12px] p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      {/* Header with Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#3730A3]" />
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Count / Percentage Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto shrink-0">
          <button
            onClick={() => setDisplayMode("count")}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              displayMode === "count"
                ? "bg-white text-[#3730A3] shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Hash className="w-3 h-3" />
            Question Count
          </button>
          <button
            onClick={() => setDisplayMode("percentage")}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              displayMode === "percentage"
                ? "bg-white text-[#3730A3] shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Percent className="w-3 h-3" />
            % Weightage
          </button>
        </div>
      </div>

      {/* Interactive Tooltip Banner */}
      <div className="min-h-[38px] px-3.5 py-2 rounded-lg bg-indigo-50/50 border border-indigo-100/70 text-xs flex items-center justify-between transition-all">
        {hoveredCell ? (
          <div className="flex items-center gap-3 text-slate-700 flex-wrap">
            <span className="font-bold text-[#3730A3]">{hoveredCell.topicName}</span>
            <span className="text-slate-400">|</span>
            <span>Year: <strong>{hoveredCell.year}</strong></span>
            <span className="text-slate-400">|</span>
            <span>Questions: <strong>{hoveredCell.count} Qs</strong></span>
            <span className="text-slate-400">|</span>
            <span>Weightage: <strong>{hoveredCell.percentage}%</strong></span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="w-3.5 h-3.5 text-[#3730A3]" />
            <span>Hover or tap any cell to inspect year-specific question counts and shift weightage.</span>
          </div>
        )}
      </div>

      {/* Heatmap Grid Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse min-w-[580px]">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-2.5 px-3 min-w-[200px] border-r border-slate-200">Topic / Chapter</th>
              {years.map((year) => (
                <th key={year} className="py-2.5 px-2 text-center border-r border-slate-200 last:border-r-0">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {topics.map((topic) => (
              <tr key={topic.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-medium text-slate-900 border-r border-slate-200 bg-white">
                  <div className="truncate max-w-[220px]" title={topic.name}>
                    {topic.name}
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">{topic.category}</span>
                </td>
                {years.map((year) => {
                  const cell = topic.yearsData[year] || { count: 0, percentage: 0 };
                  const isHovered =
                    hoveredCell?.topicName === topic.name && hoveredCell?.year === year;

                  return (
                    <td
                      key={year}
                      onMouseEnter={() =>
                        setHoveredCell({
                          topicName: topic.name,
                          year,
                          count: cell.count,
                          percentage: cell.percentage,
                        })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`py-2 px-1 text-center border-r border-slate-200 last:border-r-0 transition-all cursor-pointer select-none ${getCellBgColor(
                        cell.count
                      )} ${isHovered ? "ring-2 ring-inset ring-[#EA580C] shadow-sm z-10" : ""}`}
                    >
                      <span className="block text-[11px] font-mono">
                        {displayMode === "count" ? `${cell.count}Q` : `${cell.percentage}%`}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
        <span>Low frequency (0-1 Qs)</span>
        <div className="flex items-center gap-1">
          <span className="w-4 h-3 rounded-xs bg-slate-100 inline-block border border-slate-200" />
          <span className="w-4 h-3 rounded-xs bg-indigo-50 inline-block" />
          <span className="w-4 h-3 rounded-xs bg-indigo-100 inline-block" />
          <span className="w-4 h-3 rounded-xs bg-indigo-300 inline-block" />
          <span className="w-4 h-3 rounded-xs bg-[#3730A3] inline-block" />
        </div>
        <span>High yield (4-6 Qs)</span>
      </div>
    </div>
  );
}
