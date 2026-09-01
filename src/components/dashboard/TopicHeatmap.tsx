"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
    if (count === 0) return "bg-neutral-100 text-neutral-400";
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "bg-orange-50 text-neutral-800 hover:bg-orange-100 font-medium";
    if (ratio <= 0.5) return "bg-orange-200 text-black hover:bg-orange-300 font-semibold";
    if (ratio <= 0.75) return "bg-[#FF4D00]/80 text-black hover:bg-[#FF4D00] font-bold";
    return "bg-black text-[#FF4D00] hover:bg-neutral-900 font-bold";
  };

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-4 sm:p-6 space-y-4 font-sans">
      {/* Header with Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-neutral-100">
        <div>
          <h3 className="font-headline text-base sm:text-xl text-black flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#FF4D00]" />
            {title}
          </h3>
          <p className="font-meta text-xs text-neutral-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Count / Percentage Switcher */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setDisplayMode("count")}
            className={`flex items-center gap-1 px-3 py-1.5 font-meta text-xs transition-all border-2 border-black ${
              displayMode === "count"
                ? "bg-black text-[#FF4D00] font-bold shadow-[2px_2px_0px_0px_#000000]"
                : "bg-white text-black hover:bg-[#FF4D00] hover:text-black"
            }`}
          >
            <Hash className="w-3 h-3" />
            COUNT
          </button>
          <button
            onClick={() => setDisplayMode("percentage")}
            className={`flex items-center gap-1 px-3 py-1.5 font-meta text-xs transition-all border-2 border-black ${
              displayMode === "percentage"
                ? "bg-black text-[#FF4D00] font-bold shadow-[2px_2px_0px_0px_#000000]"
                : "bg-white text-black hover:bg-[#FF4D00] hover:text-black"
            }`}
          >
            <Percent className="w-3 h-3" />
            PERCENTAGE
          </button>
        </div>
      </div>

      {/* Hover Info Tooltip Banner */}
      {hoveredCell && (
        <div className="bg-black border-2 border-black text-white p-3 font-meta text-xs flex items-center justify-between shadow-[2px_2px_0px_0px_#FF4D00]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF4D00] inline-block"></span>
            <span className="font-bold text-[#FF4D00]">{hoveredCell.topicName}</span>
            <span className="text-neutral-400">({hoveredCell.year})</span>
          </span>
          <span className="font-bold text-white font-mono">
            {hoveredCell.count} QUESTIONS ({hoveredCell.percentage}% OF SHIFT)
          </span>
        </div>
      )}

      {/* Responsive Matrix Grid */}
      <div className="overflow-x-auto w-full no-scrollbar pb-1 border-2 border-black">
        <table className="w-full border-collapse text-left min-w-[580px]">
          <thead>
            <tr className="border-b-2 border-black bg-black text-white font-meta text-[11px]">
              <th className="py-2.5 px-3 font-bold border-r border-neutral-700 w-52">
                TOPIC / CHAPTER
              </th>
              {years.map((year) => (
                <th key={year} className="py-2.5 px-2 text-center border-r border-neutral-700 last:border-r-0">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black text-xs">
            {topics.map((topic) => (
              <tr key={topic.id} className="hover:bg-neutral-50 transition-colors">
                <td className="py-2.5 px-3 font-bold text-black border-r-2 border-black bg-white">
                  <div className="truncate max-w-[200px]" title={topic.name}>
                    {topic.name}
                  </div>
                  <span className="text-[10px] font-meta text-neutral-500 font-normal">{topic.category}</span>
                </td>
                {years.map((year, index) => {
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
                      className={`py-2 px-1 text-center border-r border-black last:border-r-0 transition-all cursor-pointer select-none ${getCellBgColor(
                        cell.count
                      )} ${isHovered ? "ring-2 ring-inset ring-black shadow-sm z-10" : ""}`}
                    >
                      <motion.span 
                        className="block text-[11px] font-mono font-bold"
                        initial={{ opacity: 0, scale: 0.85 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ delay: index * 0.015, duration: 0.25, ease: 'easeOut' }}
                        whileHover={{ scale: 1.08, transition: { duration: 0.15 } }}
                        style={{ willChange: 'transform' }}
                      >
                        {displayMode === "count" ? `${cell.count}Q` : `${cell.percentage}%`}
                      </motion.span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between pt-1 font-meta text-[10px] text-neutral-600">
        <span>0-1 QS (LOW)</span>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-3 bg-neutral-100 inline-block border border-black" />
          <span className="w-4 h-3 bg-orange-50 inline-block border border-black" />
          <span className="w-4 h-3 bg-orange-200 inline-block border border-black" />
          <span className="w-4 h-3 bg-[#FF4D00] inline-block border border-black" />
          <span className="w-4 h-3 bg-black inline-block border border-black" />
        </div>
        <span className="font-bold text-black">4-6 QS (HIGH YIELD)</span>
      </div>
    </div>
  );
}
