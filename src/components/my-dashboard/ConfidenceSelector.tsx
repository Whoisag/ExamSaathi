"use client";

import React from "react";
import { UserTopicConfidence } from "@/data/mock";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckCircle2, AlertTriangle, HelpCircle, Check, Clock } from "lucide-react";

interface ConfidenceSelectorProps {
  topics?: UserTopicConfidence[];
  onConfidenceChange?: (id: string, newConfidence: "mastered" | "revising" | "weak") => void;
  isLoading?: boolean;
  isEmpty?: boolean;
}

export function ConfidenceSelector({
  topics = [],
  onConfidenceChange,
  isLoading = false,
  isEmpty = false,
}: ConfidenceSelectorProps) {
  if (isLoading) {
    return <TableSkeleton rows={6} />;
  }

  if (isEmpty || topics.length === 0) {
    return (
      <EmptyState
        icon={<HelpCircle className="w-6 h-6 text-slate-400" />}
        title="No Tracked Topics"
        description="Select chapters to begin tracking your personal syllabus confidence and mastery level."
      />
    );
  }

  return (
    <div className="bg-white rounded-[12px] p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3730A3]" />
            Self-Assessed Confidence Tracker
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Classify your current mastery to dynamically calibrate your revision queue
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 font-semibold text-[#059669]">
            <span className="w-2 h-2 rounded-full bg-[#059669]" />
            Mastered ({topics.filter((t) => t.confidence === "mastered").length})
          </span>
          <span className="flex items-center gap-1 font-semibold text-[#D97706]">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            Revising ({topics.filter((t) => t.confidence === "revising").length})
          </span>
          <span className="flex items-center gap-1 font-semibold text-[#EA580C]">
            <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
            Weak ({topics.filter((t) => t.confidence === "weak").length})
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs min-w-[540px]">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Topic / Chapter</th>
              <th className="py-3 px-3 text-center">Mock Accuracy</th>
              <th className="py-3 px-3 text-center">Last Active</th>
              <th className="py-3 px-4 text-right">Confidence Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topics.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900">
                  {item.topicName}
                  <span className="block text-[11px] text-slate-400 font-normal">
                    {item.chapter} • {item.subject}
                  </span>
                </td>

                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-block font-mono font-bold px-2 py-0.5 rounded ${
                      item.accuracyRate >= 80
                        ? "bg-emerald-50 text-[#059669]"
                        : item.accuracyRate >= 60
                        ? "bg-amber-50 text-[#D97706]"
                        : "bg-orange-50 text-[#EA580C]"
                    }`}
                  >
                    {item.accuracyRate}%
                  </span>
                </td>

                <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px]">
                  <span className="flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.lastRevisedDaysAgo}d ago
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 gap-0.5">
                    {/* Mastered Button */}
                    <button
                      onClick={() => onConfidenceChange?.(item.id, "mastered")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                        item.confidence === "mastered"
                          ? "bg-[#059669] text-white shadow-2xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {item.confidence === "mastered" && <Check className="w-3 h-3" />}
                      Mastered
                    </button>

                    {/* Revising Button */}
                    <button
                      onClick={() => onConfidenceChange?.(item.id, "revising")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                        item.confidence === "revising"
                          ? "bg-[#D97706] text-white shadow-2xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {item.confidence === "revising" && <Check className="w-3 h-3" />}
                      Revising
                    </button>

                    {/* Weak Button */}
                    <button
                      onClick={() => onConfidenceChange?.(item.id, "weak")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                        item.confidence === "weak"
                          ? "bg-[#EA580C] text-white shadow-2xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {item.confidence === "weak" && <Check className="w-3 h-3" />}
                      Weak
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
