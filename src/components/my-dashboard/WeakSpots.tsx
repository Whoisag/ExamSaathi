"use client";

import React from "react";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertCircle, ArrowRight, ShieldAlert } from "lucide-react";

interface WeakSpotItem {
  id: string;
  topic: string;
  reason: string;
  suggestedAction: string;
  urgency: string;
  marksImpact: number;
}

interface WeakSpotsProps {
  items?: WeakSpotItem[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

export function WeakSpots({ items = [], isLoading = false, isEmpty = false }: WeakSpotsProps) {
  if (isLoading) {
    return <CardSkeleton />;
  }

  if (isEmpty || items.length === 0) {
    return (
      <EmptyState
        icon={<ShieldAlert className="w-6 h-6 text-[#059669]" />}
        title="Zero Critical Vulnerabilities"
        description="None of your high-yield chapters currently trigger risk thresholds."
      />
    );
  }

  return (
    <div className="bg-white border-2 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000000] space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-neutral-100 gap-2">
        <div>
          <h3 className="font-headline text-base sm:text-lg text-black flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#FF4D00]" />
            HIGH-STAKES WEAK SPOTS
          </h3>
          <p className="font-meta text-xs text-neutral-500 mt-0.5">
            Chapters with low mock accuracy where questions are virtually guaranteed
          </p>
        </div>
        <span className="font-meta text-[10px] font-bold px-2.5 py-1 bg-black text-[#FF4D00] border border-black shadow-[2px_2px_0px_0px_#FF4D00] self-start sm:self-auto">
          ATTENTION REQUIRED
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
              <span className="font-meta text-xs font-bold text-black bg-[#FF4D00] px-2 py-0.5 border border-black shrink-0">
                +{item.marksImpact} MARKS AT RISK
              </span>
            </div>
            <p className="font-sans text-xs text-neutral-700 leading-relaxed">{item.reason}</p>
            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-meta">
              <span className="font-bold text-black flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-[#FF4D00]" />
                ACTION: {item.suggestedAction}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#FF4D00]">
                {item.urgency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
