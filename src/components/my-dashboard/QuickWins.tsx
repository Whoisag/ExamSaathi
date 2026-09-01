"use client";

import React from "react";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Zap, Clock, CheckCircle, ArrowUpRight, Sparkles, Globe, Loader2 } from "lucide-react";

interface QuickWinItem {
  id: string;
  topic: string;
  subject?: string;
  reason: string;
  timeRequired: string;
  marksReward: string;
}

interface QuickWinsProps {
  items?: QuickWinItem[];
  isLoading?: boolean;
  isAnalyzing?: boolean;
  isEmpty?: boolean;
  webAnalysisEnabled?: boolean;
  onToggleWebAnalysis?: (enabled: boolean) => void;
}

export function QuickWins({
  items = [],
  isLoading = false,
  isAnalyzing = false,
  isEmpty = false,
  webAnalysisEnabled = false,
  onToggleWebAnalysis,
}: QuickWinsProps) {
  if (isLoading) {
    return <CardSkeleton />;
  }

  if (isEmpty || items.length === 0) {
    return (
      <EmptyState
        icon={<Zap className="w-6 h-6 text-slate-400" />}
        title="No Immediate Quick Wins"
        description="All quick-revision high-ROI chapters have already been reviewed in this subject."
      />
    );
  }

  return (
    <div className="bg-white border-2 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000000] space-y-4 font-sans relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-neutral-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-headline text-base sm:text-lg text-black flex items-center gap-2">
              <Zap className="w-4 h-4 text-black" />
              HIGH-ROI QUICK WINS
            </h3>
            {webAnalysisEnabled && (
              <span className="font-meta text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-500 px-1.5 py-0.5 font-bold uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-2.5 h-2.5 text-emerald-600" />
                WEB GROUNDED
              </span>
            )}
          </div>
          <p className="font-meta text-xs text-neutral-500 mt-0.5">
            Minimal formulas, 100% predictable questions, fastest score boosts
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <a
            href="/assistant?prepHub=1&mode=sprint"
            className="font-meta text-[10px] font-bold px-2.5 py-1 bg-black text-white hover:bg-[#FF4D00] hover:text-black border border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#FF4D00]" />
            <span>AI 30-MIN SPRINT</span>
          </a>
          <span className="font-meta text-[10px] font-bold px-2.5 py-1 bg-[#FF4D00] text-black border border-black shadow-[2px_2px_0px_0px_#000000]">
            FAST SCORING
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 border-2 border-black bg-white hover:bg-neutral-50 transition-all space-y-2.5 shadow-[2px_2px_0px_0px_#000000]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                {item.subject && (
                  <span className="inline-block font-meta text-[9px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-1.5 py-0.5 border border-neutral-300">
                    {item.subject}
                  </span>
                )}
                <h4 className="font-headline text-sm text-black">{item.topic}</h4>
              </div>
              <span className="font-meta text-xs font-bold text-white bg-black px-2 py-0.5 border border-black shrink-0 whitespace-nowrap">
                {item.marksReward}
              </span>
            </div>
            <p className="font-sans text-xs text-neutral-700 leading-relaxed">{item.reason}</p>
            <div className="pt-2 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-meta gap-2">
              <span className="text-neutral-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-black" />
                EST. TIME: <strong className="text-black">{item.timeRequired}</strong>
              </span>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <a
                  href={`/assistant?prepHub=1&chapter=${encodeURIComponent(item.topic)}&prompt=${encodeURIComponent(`Give me a quick 5-minute high-yield scoring drill for ${item.topic} (${item.marksReward}) with 2 predictable questions and answer keys.`)}`}
                  className="px-2 py-0.5 bg-neutral-100 hover:bg-[#FF4D00] hover:text-black text-black border border-black text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-[1px_1px_0px_0px_#000000]"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#FF4D00]" />
                  <span>AI DRILL</span>
                </a>
                <a
                  href="/dashboard/practice"
                  className="font-bold text-black hover:text-[#FF4D00] flex items-center gap-0.5 transition-colors cursor-pointer"
                >
                  [PRACTICE <ArrowUpRight className="w-3 h-3" />]
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
