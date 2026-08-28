"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrutalistHeader } from "@/components/layout/BrutalistHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MOCK_EVALUATION_METRICS,
  MOCK_EVAL_CHART_DATA,
  EvaluationMetricRow,
} from "@/data/mock";
import { Award, BarChart2, Table as TableIcon, CheckCircle, RefreshCw, Eye, ArrowRight, ShieldCheck } from "lucide-react";

export default function EvaluationPage() {
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [simulateLoading, setSimulateLoading] = useState(false);

  const handleToggleLoading = () => {
    setSimulateLoading(true);
    setTimeout(() => setSimulateLoading(false), 600);
  };

  const metricsData: EvaluationMetricRow[] = showEmptyState ? [] : MOCK_EVALUATION_METRICS;
  const chartData = showEmptyState ? [] : MOCK_EVAL_CHART_DATA;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-[#FF4D00] selection:text-white font-sans">
      <BrutalistHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Top Breadcrumb & Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-brutal-b pb-6 mb-8 gap-4">
          <div>
            <div className="font-meta text-xs text-[#FF4D00] font-bold mb-1">
              // EMPIRICAL VALIDATION // HOLDOUT BACKTEST AUDIT
            </div>
            <h1 className="font-headline text-3xl sm:text-5xl text-black tracking-tight">
              MODEL EVALUATION & BENCHMARKS
            </h1>
            <p className="text-sm text-neutral-600 mt-2 max-w-2xl font-medium">
              Rigorous backtesting benchmarks across 15+ years of NTA and CBSE shift papers:
              Mean Absolute Error (MAE), Spearman Rank Correlation (ρ), and Precision@K.
            </p>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLoading}
              disabled={simulateLoading}
              className="border-brutal px-3 py-2 font-meta text-xs hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulateLoading ? "animate-spin text-[#FF4D00]" : ""}`} />
              <span>TEST SKELETON</span>
            </button>
            <button
              onClick={() => setShowEmptyState(!showEmptyState)}
              className={`border-brutal px-3.5 py-2 font-meta text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                showEmptyState
                  ? "bg-[#FF4D00] text-black"
                  : "bg-black text-white hover:bg-neutral-800"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showEmptyState ? "SHOW POPULATED" : "SHOW EMPTY STATE"}</span>
            </button>
          </div>
        </div>

        {/* 3 Brutalist Metric Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* MAE */}
          <div className="border-brutal bg-white p-6 relative">
            <div className="flex items-center justify-between border-brutal-b pb-2 mb-3">
              <span className="font-meta text-xs font-bold text-neutral-600">
                MEAN ABSOLUTE ERROR
              </span>
              <span className="bg-black text-white font-meta text-[10px] px-2 py-0.5 font-bold">
                LOW ERROR
              </span>
            </div>
            <div className="font-headline text-4xl sm:text-5xl text-black">
              0.48 <span className="text-xl text-[#FF4D00]">QS</span>
            </div>
            <p className="font-meta text-xs text-neutral-500 mt-2">
              Average prediction error within ±0.5 questions per chapter.
            </p>
          </div>

          {/* Spearman Rank */}
          <div className="border-brutal bg-white p-6 relative">
            <div className="flex items-center justify-between border-brutal-b pb-2 mb-3">
              <span className="font-meta text-xs font-bold text-neutral-600">
                SPEARMAN RANK CORRELATION
              </span>
              <span className="bg-[#FF4D00] text-black font-meta text-[10px] px-2 py-0.5 font-bold border border-black">
                STRONG RANK
              </span>
            </div>
            <div className="font-headline text-4xl sm:text-5xl text-black">
              ρ = 0.85
            </div>
            <p className="font-meta text-xs text-neutral-500 mt-2">
              Predicted topic priority order strongly correlates with actual papers.
            </p>
          </div>

          {/* Precision@5 */}
          <div className="border-brutal bg-white p-6 relative">
            <div className="flex items-center justify-between border-brutal-b pb-2 mb-3">
              <span className="font-meta text-xs font-bold text-neutral-600">
                PRECISION@5 (HIGH-YIELD)
              </span>
              <span className="bg-black text-[#FF4D00] font-meta text-[10px] px-2 py-0.5 font-bold">
                TOP ACCURACY
              </span>
            </div>
            <div className="font-headline text-4xl sm:text-5xl text-[#FF4D00]">
              88.0%
            </div>
            <p className="font-meta text-xs text-neutral-500 mt-2">
              Top 5 predicted subtopics appeared consistently across test shifts.
            </p>
          </div>
        </div>

        {/* Backtest Bar Chart */}
        <div className="border-brutal bg-white p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-brutal-b pb-3 mb-6 gap-2">
            <div>
              <span className="font-meta text-xs text-[#FF4D00] font-bold block">
                // CROSS-SESSION HOLDOUT EVALUATION
              </span>
              <h3 className="font-headline text-xl sm:text-2xl text-black">
                VALIDATED ERROR & ACCURACY BY EXAM TRACK
              </h3>
            </div>

            <div className="flex items-center gap-4 font-meta text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#FF4D00] border border-black"></span>
                <span>MAE (LOWER IS BETTER)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-black border border-black"></span>
                <span>SPEARMAN RHO (0-1.0)</span>
              </span>
            </div>
          </div>

          {simulateLoading ? (
            <div className="h-64 bg-neutral-100 animate-pulse flex items-end gap-4 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-1 bg-neutral-300 h-32"></div>
              ))}
            </div>
          ) : showEmptyState ? (
            <div className="border-brutal bg-neutral-50 p-12 text-center">
              <span className="font-headline text-xl text-black block mb-2">
                BENCHMARK DATA CLEARED
              </span>
              <p className="font-meta text-xs text-neutral-500 mb-4">
                Empty state active for validation testing.
              </p>
              <button
                onClick={() => setShowEmptyState(false)}
                className="bg-black text-white px-4 py-2 border-brutal font-meta text-xs hover:bg-[#FF4D00] hover:text-black cursor-pointer"
              >
                RESTORE BENCHMARK DATA
              </button>
            </div>
          ) : (
            <div className="w-full" style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height={260} minWidth={0} minHeight={260}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e5e5e5" />
                  <XAxis
                    dataKey="exam"
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
                  <Bar dataKey="mae" fill="#FF4D00" stroke="#000000" strokeWidth={2} name="MAE (Questions)" isAnimationActive={false} />
                  <Bar dataKey="spearman" fill="#000000" stroke="#000000" strokeWidth={2} name="Spearman Rho" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Backtest Benchmark Table */}
        <div className="border-brutal bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-brutal-b pb-4 mb-6 gap-2">
            <div>
              <span className="font-meta text-xs text-[#FF4D00] font-bold block">
                // HOLDOUT DATASET BENCHMARK REPOSITORY
              </span>
              <h3 className="font-headline text-xl sm:text-2xl text-black">
                HISTORICAL BACKTEST BENCHMARK TABLE
              </h3>
            </div>
            <span className="bg-black text-white font-meta text-xs px-3 py-1 font-bold self-start sm:self-auto">
              {metricsData.length} TEST BATCHES
            </span>
          </div>

          {simulateLoading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-neutral-100 border border-neutral-200"></div>
              ))}
            </div>
          ) : showEmptyState ? (
            <div className="border-brutal bg-neutral-50 p-12 text-center">
              <span className="font-headline text-xl text-black block mb-2">
                NO TEST BATCHES FOUND
              </span>
              <p className="font-meta text-xs text-neutral-500 mb-4">
                Toggle the controls above to reload verified empirical benchmarks.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border-brutal">
              <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
                <thead>
                  <tr className="bg-black text-white font-meta text-xs border-b-2 border-black">
                    <th className="p-3.5 border-r border-neutral-700">EVALUATION DATASET</th>
                    <th className="p-3.5 border-r border-neutral-700">SAMPLE SIZE</th>
                    <th className="p-3.5 border-r border-neutral-700 text-center">MAE (QUESTIONS)</th>
                    <th className="p-3.5 border-r border-neutral-700 text-center">SPEARMAN (ρ)</th>
                    <th className="p-3.5 border-r border-neutral-700 text-center">PRECISION@3</th>
                    <th className="p-3.5 border-r border-neutral-700 text-center">PRECISION@5</th>
                    <th className="p-3.5 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-neutral-200 bg-white">
                  {metricsData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50 font-meta">
                      <td className="p-3.5 font-bold text-black border-r border-neutral-200">
                        {row.examYear}
                      </td>
                      <td className="p-3.5 text-neutral-600 border-r border-neutral-200">
                        {row.sampleSize}
                      </td>
                      <td className="p-3.5 font-bold text-[#FF4D00] text-center border-r border-neutral-200">
                        {row.mae.toFixed(2)}
                      </td>
                      <td className="p-3.5 font-bold text-black text-center border-r border-neutral-200">
                        {row.spearmanRho.toFixed(2)}
                      </td>
                      <td className="p-3.5 text-center font-bold text-black border-r border-neutral-200">
                        {row.precisionAt3}%
                      </td>
                      <td className="p-3.5 text-center font-bold text-black border-r border-neutral-200">
                        {row.precisionAt5}%
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="bg-neutral-100 text-black border border-black px-2 py-0.5 text-[11px] font-bold inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-[#FF4D00]" />
                          <span>{row.status.toUpperCase()}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-brutal-t p-6 text-center font-meta text-xs text-neutral-500 mt-12">
        EXAMSAATHI EMPIRICAL VALIDATION SUITE • STRICT HOLDOUT BACKTEST STANDARDS
      </footer>
    </div>
  );
}
