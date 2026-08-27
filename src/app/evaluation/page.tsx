"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  MOCK_EVALUATION_METRICS,
  MOCK_EVAL_CHART_DATA,
  EvaluationMetricRow,
} from "@/data/mock";
import { TableSkeleton, ChartSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Award,
  BarChart2,
  Table as TableIcon,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Eye,
  Info,
} from "lucide-react";

export default function EvaluationPage() {
  // State switches for testing
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [simulateLoading, setSimulateLoading] = useState(false);

  const handleToggleLoading = () => {
    setSimulateLoading(true);
    setTimeout(() => setSimulateLoading(false), 1000);
  };

  const metricsData: EvaluationMetricRow[] = showEmptyState ? [] : MOCK_EVALUATION_METRICS;
  const chartData = showEmptyState ? [] : MOCK_EVAL_CHART_DATA;

  return (
    <AppShell
      title="Model Evaluation & Empirical Validation"
      subtitle="Rigorous backtesting benchmarks on past examination papers: Mean Absolute Error (MAE), Spearman Rank Correlation (ρ), and Precision@K."
      breadcrumbs={[{ label: "Model Evaluation" }]}
      actionSlot={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={handleToggleLoading}
              disabled={simulateLoading}
              className="px-2.5 py-1 rounded-lg text-slate-700 hover:bg-white transition-all font-medium flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 text-[#3730A3] ${simulateLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Skeleton</span>
            </button>
            <button
              onClick={() => setShowEmptyState(!showEmptyState)}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1 ${
                showEmptyState
                  ? "bg-[#EA580C] text-white font-bold"
                  : "text-slate-700 hover:bg-white"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{showEmptyState ? "Show Populated" : "Show Empty Tables"}</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-[12px] p-5 border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider">Mean Absolute Error</span>
              <span className="text-xs font-mono font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Low Error
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {showEmptyState ? "—" : "0.48 Qs"}
            </p>
            <p className="text-xs text-slate-500">Average error within ±0.5 questions per topic</p>
          </div>

          <div className="bg-white rounded-[12px] p-5 border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider">Spearman Rank Correlation</span>
              <span className="text-xs font-mono font-bold text-[#3730A3] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Strong Rank
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {showEmptyState ? "—" : "ρ = 0.85"}
            </p>
            <p className="text-xs text-slate-500">Predicted topic priority strongly correlates with reality</p>
          </div>

          <div className="bg-white rounded-[12px] p-5 border border-slate-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider">Precision@5 (High-Yield)</span>
              <span className="text-xs font-mono font-bold text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                Top Accuracy
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {showEmptyState ? "—" : "88.0%"}
            </p>
            <p className="text-xs text-slate-500">Top 5 predicted topics appeared in test shifts</p>
          </div>
        </div>

        {/* Section 1: Evaluation Metrics Table */}
        <div className="bg-white rounded-[12px] p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-[#3730A3]" />
                Historical Backtest Benchmark Table
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation results on holdout examination sets (models trained strictly on data prior to test year)
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-[#3730A3]">
              {metricsData.length} Test Batches
            </span>
          </div>

          {simulateLoading ? (
            <TableSkeleton rows={5} />
          ) : metricsData.length === 0 ? (
            <EmptyState
              icon={<TableIcon className="w-6 h-6 text-slate-400" />}
              title="Empty Evaluation Table"
              description="No benchmark test results have been recorded yet. Click 'Show Populated' to view sample backtest results or populate with real model JSON."
              actionText="Load Benchmark Data"
              onAction={() => setShowEmptyState(false)}
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Evaluation Dataset</th>
                    <th className="py-3 px-3">Sample Size</th>
                    <th className="py-3 px-3 text-center">MAE (Questions)</th>
                    <th className="py-3 px-3 text-center">Spearman (ρ)</th>
                    <th className="py-3 px-3 text-center">Precision@3</th>
                    <th className="py-3 px-3 text-center">Precision@5</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metricsData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.examYear}</td>
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">{row.sampleSize}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-[#059669]">
                        {row.mae.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-[#3730A3]">
                        {row.spearmanRho.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                        {row.precisionAt3}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                        {row.precisionAt5}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 2: Recharts Comparison Chart */}
        <div className="bg-white rounded-[12px] p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#EA580C]" />
                Precision@5 vs. Spearman Rank Across National Papers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualizing ranking stability and top-5 question appearance rates
              </p>
            </div>
          </div>

          {simulateLoading ? (
            <ChartSkeleton />
          ) : chartData.length === 0 ? (
            <EmptyState
              icon={<BarChart2 className="w-6 h-6 text-slate-400" />}
              title="Empty Metric Chart"
              description="Chart renders automatically once validation backtest metrics are provided."
              actionText="Load Benchmark Chart"
              onAction={() => setShowEmptyState(false)}
            />
          ) : (
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="exam"
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
                    domain={[0, 100]}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg text-xs space-y-1">
                            <p className="font-bold text-slate-800">{label}</p>
                            {payload.map((entry) => (
                              <p key={entry.name} style={{ color: entry.color }}>
                                {entry.name}: <strong>{entry.value}</strong>
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                  <Bar
                    dataKey="p5"
                    name="Precision@5 (%)"
                    fill="#3730A3"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                  <Bar
                    dataKey="spearman"
                    name="Spearman (x100)"
                    fill="#EA580C"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
