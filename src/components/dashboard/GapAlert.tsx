"use client";

import React from "react";
import { GapAlertItem } from "@/data/mock";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertTriangle, Clock, Calendar, CheckCircle2 } from "lucide-react";

interface GapAlertProps {
  alerts?: GapAlertItem[] | null;
  isLoading?: boolean;
  isEmpty?: boolean;
  title?: string;
  subtitle?: string;
}

export function GapAlert({
  alerts,
  isLoading = false,
  isEmpty = false,
  title = "Recurrence Gap Alerts",
  subtitle = "High-probability topics overdue based on historical cyclic patterns",
}: GapAlertProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isEmpty || !alerts || alerts.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircle2 className="w-6 h-6 text-[#059669]" />}
        title="No Gap Anomalies"
        description="All standard curriculum topics are currently within expected cyclic distribution intervals."
      />
    );
  }

  return (
    <div className="bg-white rounded-[12px] p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-[#D97706] border border-amber-200">
          {alerts.length} Overdue Topics
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/40 to-orange-50/20 space-y-2.5"
          >
            {/* Title & Badge */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {alert.topicName}
                </h4>
                <p className="text-xs text-slate-600 font-mono mt-0.5">{alert.subtopic}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                  alert.predictedUrgency === "High"
                    ? "bg-[#EA580C] text-white"
                    : "bg-[#D97706] text-white"
                }`}
              >
                {alert.predictedUrgency} Priority
              </span>
            </div>

            {/* Gap Stats Pill Badges */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Last appeared: <strong>{alert.lastAppearedYear}</strong>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Cycle: <strong>Every {alert.recurrenceCycleYears} yrs</strong>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100/70 border border-amber-200 text-amber-900 font-bold">
                ⚠️ Overdue by {alert.overdueByYears} yrs
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[#059669] font-bold ml-auto">
                +{alert.marksAtStake} Marks at Stake
              </span>
            </div>

            {/* Explanation */}
            <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-amber-200/40">
              {alert.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
