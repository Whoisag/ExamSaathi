"use client";

import React from "react";
import { TopicPrediction } from "@/data/mock";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sparkles, TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react";

interface TopicPredictorProps {
  predictions?: TopicPrediction[] | null;
  isLoading?: boolean;
  isEmpty?: boolean;
  title?: string;
  subtitle?: string;
}

export function TopicPredictor({
  predictions,
  isLoading = false,
  isEmpty = false,
  title = "Predicted High-Yield Topics",
  subtitle = "Ranked likelihood for upcoming 2026 examination shifts",
}: TopicPredictorProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isEmpty || !predictions || predictions.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles className="w-6 h-6 text-slate-400" />}
        title="No Predictions Available"
        description="Predictive model outputs have not been generated for the selected subject."
      />
    );
  }

  const getTrendBadge = (trend: TopicPrediction["trend"]) => {
    switch (trend) {
      case "rising":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#EA580C] border border-orange-200/60">
            <TrendingUp className="w-3 h-3" />
            Rising
          </span>
        );
      case "falling":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            <TrendingDown className="w-3 h-3" />
            Falling
          </span>
        );
      case "stable":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-[#3730A3] border border-indigo-200/60">
            <Minus className="w-3 h-3" />
            Stable
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-[12px] p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#EA580C]" />
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          Top {predictions.length} High-Yield
        </span>
      </div>

      <div className="space-y-3">
        {predictions.map((item) => (
          <div
            key={item.id}
            className="p-3.5 sm:p-4 rounded-xl border border-slate-200/90 hover:border-indigo-300 transition-all bg-slate-50/50 hover:bg-white space-y-2.5 group"
          >
            {/* Header: Rank + Title + Trend Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                    item.rank === 1
                      ? "bg-[#3730A3] text-white shadow-xs"
                      : item.rank === 2
                      ? "bg-indigo-100 text-[#3730A3] font-bold"
                      : item.rank === 3
                      ? "bg-orange-100 text-[#EA580C] font-bold"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  #{item.rank}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#3730A3] transition-colors leading-snug">
                    {item.topicName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                    <span className="font-medium text-slate-600">{item.category}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-800">{item.expectedQuestions}</span>
                    <span>•</span>
                    <span className="text-[#059669] font-semibold">{item.shiftCoverage}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">{getTrendBadge(item.trend)}</div>
            </div>

            {/* Probability Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] font-medium">
                  Appearance Probability in Shift
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {item.predictedProbability}%
                </span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.predictedProbability}%`,
                    backgroundColor:
                      item.predictedProbability >= 90
                        ? "#3730A3"
                        : item.predictedProbability >= 80
                        ? "#059669"
                        : "#EA580C",
                  }}
                />
              </div>
            </div>

            {/* Reasoning Note */}
            <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100/90 leading-relaxed">
              💡 {item.trendReason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
