"use client";

import React from "react";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertCircle, ArrowRight, ShieldAlert, Sparkles, Loader2, RefreshCw } from "lucide-react";

interface WeakSpotItem {
  id: string;
  topic: string;
  subject?: string;
  reason: string;
  suggestedAction: string;
  urgency: string;
  marksImpact: number;
}

interface WeakSpotsProps {
  items?: WeakSpotItem[];
  isLoading?: boolean;
  isAnalyzing?: boolean;
  isEmpty?: boolean;
  onReanalyze?: () => void;
}

export function WeakSpots({
  items = [],
  isLoading = false,
  isAnalyzing = false,
  isEmpty = false,
  onReanalyze,
}: WeakSpotsProps) {
  if (isLoading) {
    return <CardSkeleton />;
  }

  if (isEmpty || items.length === 0) {
    return (
      <EmptyState
        icon={<ShieldAlert className="w-6 h-6 text-[#059669]" />}
        title="Zero Critical Vulnerabilities"
        description="None of your high-yield chapters currently trigger risk thresholds in this subject."
      />
    );
  }

  return (
    <div className="bg-white border-2 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000000] space-y-4 font-sans relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-neutral-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-headline text-base sm:text-lg text-black flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#FF4D00]" />
              HIGH-STAKES WEAK SPOTS
            </h3>
            <span className="font-meta text-[9px] bg-orange-100 text-black border border-black px-1.5 py-0.5 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#FF4D00]" />
              GEMINI ANALYZED
            </span>
          </div>
          <p className="font-meta text-xs text-neutral-500 mt-0.5">
            Chapters with low mock accuracy where questions are virtually guaranteed
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onReanalyze && (
            <button
              type="button"
              onClick={onReanalyze}
              disabled={isAnalyzing}
              className="font-meta text-[10px] font-bold px-2.5 py-1 bg-white hover:bg-neutral-100 text-black border border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1 cursor-pointer disabled:opacity-60"
              title="Run live Gemini diagnostic on current topic confidence"
            >
              {isAnalyzing ? (
                <Loader2 className="w-3 h-3 animate-spin text-[#FF4D00]" />
              ) : (
                <RefreshCw className="w-3 h-3 text-black" />
              )}
              <span>{isAnalyzing ? "ANALYZING..." : "RE-ANALYZE"}</span>
            </button>
          )}

          <a
            href="/assistant?prepHub=1&mode=remediate"
            className="font-meta text-[10px] font-bold px-2.5 py-1 bg-[#FF4D00] text-black border border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-black" />
            <span>AI REMEDIATE ALL</span>
          </a>
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
              <span className="font-meta text-xs font-bold text-black bg-[#FF4D00] px-2 py-0.5 border border-black shrink-0 whitespace-nowrap">
                +{item.marksImpact} MARKS AT RISK
              </span>
            </div>
            <p className="font-sans text-xs text-neutral-700 leading-relaxed">{item.reason}</p>
            <div className="pt-2 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-meta gap-2">
              <a
                href="/dashboard/practice"
                className="font-bold text-black hover:text-[#FF4D00] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5 text-[#FF4D00] shrink-0" />
                <span>ACTION: {item.suggestedAction}</span>
              </a>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <a
                  href={`/assistant?prepHub=1&chapter=${encodeURIComponent(item.topic)}&prompt=${encodeURIComponent(`I have a critical weak spot in ${item.topic}. ${item.reason} Can you explain the core concepts step-by-step and provide 3 high-yield practice questions with solutions?`)}`}
                  className="px-2 py-0.5 bg-black text-white hover:bg-[#FF4D00] hover:text-black border border-black text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-[1px_1px_0px_0px_#000000]"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#FF4D00]" />
                  <span>AI TUTOR</span>
                </a>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#FF4D00]">
                  {item.urgency}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
