"use client";

import React from "react";
import { GapAlertItem } from "@/data/mock";
import { MarkdownMath } from "@/components/ui/MarkdownMath";
import { AlertTriangle, ShieldAlert } from "lucide-react";

interface GapAlertCardProps {
  gapAlerts: GapAlertItem[];
  isLoading?: boolean;
}

export function GapAlertCard({
  gapAlerts,
  isLoading = false,
}: GapAlertCardProps) {
  if (isLoading) {
    return (
      <div className="border-brutal bg-white p-6 animate-pulse space-y-4">
        <div className="h-6 bg-neutral-300 w-1/3"></div>
        <div className="h-24 bg-neutral-100 border-2 border-neutral-200"></div>
        <div className="h-24 bg-neutral-100 border-2 border-neutral-200"></div>
      </div>
    );
  }

  return (
    <div className="border-brutal bg-white p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-brutal-b pb-3 mb-5 gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#FF4D00]" />
          <h3 className="font-headline text-xl text-black">
            CYCLIC RECURRENCE GAP ANOMALIES
          </h3>
        </div>
        <span className="bg-black text-[#FF4D00] font-meta text-xs px-2.5 py-1 font-bold border border-black self-start sm:self-auto">
          {gapAlerts.length} CYCLIC OVERDUES
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gapAlerts.map((gap) => (
          <div
            key={gap.id}
            className="border-brutal bg-neutral-50 p-5 flex flex-col justify-between relative group hover:bg-white transition-colors"
          >
            <div>
              <div className="flex items-center justify-between border-brutal-b pb-2 mb-3">
                <span className="font-meta text-xs font-bold text-black flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#FF4D00]" />
                  PRIORITY: {gap.predictedUrgency.toUpperCase()}
                </span>
                <span className="bg-[#FF4D00] text-black font-meta text-xs px-2 py-0.5 font-bold">
                  +{gap.marksAtStake} {gap.marksAtStake === 1 ? "MARK" : "MARKS"} AT STAKE
                </span>
              </div>

              <h4 className="font-headline text-lg text-black mb-1 group-hover:text-[#FF4D00] transition-colors">
                <MarkdownMath content={gap.topicName} />
              </h4>
              <div className="text-xs text-neutral-600 font-sans mb-4">
                // <MarkdownMath content={gap.subtopic} />
              </div>

              <div className="grid grid-cols-3 gap-2 bg-white p-2.5 border border-neutral-300 font-meta text-[11px] mb-4 text-center">
                <div>
                  <span className="text-neutral-500 block text-[10px]">LAST TESTED</span>
                  <span className="font-bold text-black">{gap.lastAppearedYear}</span>
                </div>
                <div className="border-x border-neutral-200">
                  <span className="text-neutral-500 block text-[10px]">MEAN CYCLE</span>
                  <span className="font-bold text-black">{gap.recurrenceCycleYears} Yrs</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">OVERDUE BY</span>
                  <span className="font-bold text-[#FF4D00]">+{gap.overdueByYears} Yrs</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed border-t border-neutral-200 pt-3">
              {gap.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
