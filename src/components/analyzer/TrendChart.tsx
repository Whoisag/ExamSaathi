"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface TrendPoint {
  year: number;
  questions: number;
  difficultyRating: number;
}

interface TrendChartProps {
  data: TrendPoint[];
  isLoading?: boolean;
}

export function TrendChart({ data, isLoading = false }: TrendChartProps) {
  if (isLoading) {
    return (
      <div className="border-brutal bg-white p-6 animate-pulse space-y-4">
        <div className="h-5 bg-neutral-300 w-1/3"></div>
        <div className="h-64 bg-neutral-100 flex items-end gap-3 p-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 bg-neutral-300 h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-brutal bg-white p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-brutal-b pb-3 mb-4">
          <h3 className="font-headline text-lg text-black">
            HISTORICAL SHIFT PYQ VELOCITY
          </h3>
          <div className="flex items-center gap-3 font-meta text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#FF4D00]"></span>
              <span>QUESTIONS</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-black"></span>
              <span>DIFFICULTY /10</span>
            </span>
          </div>
        </div>

        <div className="w-full" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height={220} minWidth={0} minHeight={220}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e5e5e5" />
              <XAxis
                dataKey="year"
                stroke="#000000"
                tick={{ fill: "#000000", fontSize: 11, fontFamily: "var(--font-space-mono)" }}
              />
              <YAxis
                stroke="#000000"
                tick={{ fill: "#000000", fontSize: 11, fontFamily: "var(--font-space-mono)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000000",
                  border: "2px solid #000000",
                  borderRadius: "0px",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="questions"
                stroke="#FF4D00"
                strokeWidth={3}
                dot={{ r: 4, stroke: "#000000", strokeWidth: 2, fill: "#FF4D00" }}
                name="Total Questions"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="difficultyRating"
                stroke="#000000"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, stroke: "#000000", strokeWidth: 1, fill: "#FFFFFF" }}
                name="Difficulty Index"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border-brutal-t pt-3 mt-4 flex justify-between items-center font-meta text-[11px] text-neutral-500">
        <span>TREND: STEADY UPWARD ACCELERATION</span>
        <span className="font-bold text-black">+25% POST-2024 REDUCTION</span>
      </div>
    </div>
  );
}
