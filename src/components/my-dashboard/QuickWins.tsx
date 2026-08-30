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
    <div className="bg-white border-2 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000000] space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-neutral-100 gap-2">
        <div>
          <h3 className="font-headline text-base sm:text-lg text-black flex items-center gap-2">
            <Zap className="w-4 h-4 text-black" />
            HIGH-ROI QUICK WINS
          </h3>
          <p className="font-meta text-xs text-neutral-500 mt-0.5">
            Minimal formulas, 100% predictable questions, fastest score boosts
          </p>
        </div>
        <span className="font-meta text-[10px] font-bold px-2.5 py-1 bg-[#FF4D00] text-black border border-black shadow-[2px_2px_0px_0px_#000000] self-start sm:self-auto">
          FAST SCORING
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 border-2 border-black bg-white hover:bg-neutral-50 transition-all space-y-2.5 shadow-[2px_2px_0px_0px_#000000]"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-headline text-sm text-black">{item.topic}</h4>
              <span className="font-meta text-xs font-bold text-white bg-black px-2 py-0.5 border border-black shrink-0">
                {item.marksReward}
              </span>
            </div>
            <p className="font-sans text-xs text-neutral-700 leading-relaxed">{item.reason}</p>
            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-meta">
              <span className="text-neutral-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-black" />
                EST. TIME: <strong className="text-black">{item.timeRequired}</strong>
              </span>
              <span className="font-bold text-black hover:text-[#FF4D00] flex items-center gap-0.5 transition-colors">
                [PRACTICE NOW <ArrowUpRight className="w-3 h-3" />]
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
