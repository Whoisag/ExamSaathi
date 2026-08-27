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
    <div className="bg-white rounded-[12px] p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#EA580C]" />
            High-Stakes Weak Spots
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Chapters with low mock accuracy where questions are virtually guaranteed
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#EA580C]">
          Attention Required
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-orange-200/90 bg-orange-50/30 space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-sm font-bold text-slate-900">{item.topic}</h4>
              <span className="text-xs font-mono font-bold text-[#EA580C] bg-white px-2 py-0.5 rounded-md border border-orange-200 shrink-0">
                +{item.marksImpact} Marks at Risk
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{item.reason}</p>
            <div className="pt-2 border-t border-orange-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-[#EA580C]" />
                Action: {item.suggestedAction}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#EA580C]">
                {item.urgency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
