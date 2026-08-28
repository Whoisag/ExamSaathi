"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface WeightageItem {
  name: string;
  value: number;
  count: number;
  color: string;
}

interface WeightagePieChartProps {
  data: WeightageItem[];
  isLoading?: boolean;
}

export function WeightagePieChart({ data, isLoading = false }: WeightagePieChartProps) {
  if (isLoading) {
    return (
      <div className="border-brutal bg-white p-6 animate-pulse space-y-4">
        <div className="h-5 bg-neutral-300 w-1/3"></div>
        <div className="h-56 bg-neutral-100 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full border-4 border-neutral-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-brutal bg-white p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-brutal-b pb-3 mb-4">
          <h3 className="font-headline text-lg text-black">
            SUBTOPIC WEIGHTAGE DISTRIBUTION
          </h3>
          <span className="font-meta text-[10px] bg-black text-white px-2 py-0.5 font-bold">
            HISTORICAL RATIO
          </span>
        </div>

        {/* Pie Chart Container with immediate rendering */}
        <div className="w-full flex items-center justify-center" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height={220} minWidth={0} minHeight={220}>
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="#000000"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000000",
                  border: "2px solid #000000",
                  borderRadius: "0px",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "12px",
                }}
                formatter={(value: any) => [`${value}% weightage`, "Share"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Custom Brutalist Legend */}
      <div className="border-brutal-t pt-4 mt-2 space-y-2 font-meta text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate pr-2">
              <span
                className="w-3 h-3 border border-black flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="truncate text-neutral-800">{item.name}</span>
            </div>
            <div className="font-bold text-black flex-shrink-0">
              <span>{item.value}%</span>
              <span className="text-neutral-500 font-normal ml-1.5">({item.count} Qs)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
