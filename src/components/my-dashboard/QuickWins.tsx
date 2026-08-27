"use client";

import React from "react";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Zap, Clock, CheckCircle, ArrowUpRight } from "lucide-react";

interface QuickWinItem {
  id: string;
  topic: string;
  reason: string;
  timeRequired: string;
  marksReward: string;
}

interface QuickWinsProps {
  items?: QuickWinItem[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

export function QuickWins({ items = [], isLoading = false, isEmpty = false }: QuickWinsProps) {
  if (isLoading) {
    return <CardSkeleton />;
  }

  if (isEmpty || items.length === 0) {
    return (
      <EmptyState
        icon={<Zap className="w-6 h-6 text-slate-400" />}
        title="No Immediate Quick Wins"
        description="All quick-revision high-ROI chapters have already been reviewed."
      />
    );
  }

  return (
    <div className="bg-white rounded-[12px] p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#059669]" />
            High-ROI Quick Wins
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Minimal formulas, 100% predictable questions, fastest score boosts
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#059669]">
          Fast Scoring
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-sm font-bold text-slate-900">{item.topic}</h4>
              <span className="text-xs font-mono font-bold text-[#059669] bg-white px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                {item.marksReward}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{item.reason}</p>
            <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Est. Time: <strong className="text-slate-800">{item.timeRequired}</strong>
              </span>
              <span className="text-[11px] font-semibold text-[#059669] flex items-center gap-0.5">
                Practice Now <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
