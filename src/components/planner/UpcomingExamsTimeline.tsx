"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PlannedExam, ExamType } from "@/data/plannerData";
import {
  Clock,
  Target,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Plus,
  Trash2,
  Filter,
  Zap,
} from "lucide-react";

interface UpcomingExamsTimelineProps {
  exams: PlannedExam[];
  onToggleStatus: (id: string) => void;
  onDeleteExam: (id: string) => void;
  onOpenAddModal: () => void;
  currentExam: string;
}

export function UpcomingExamsTimeline({
  exams,
  onToggleStatus,
  onDeleteExam,
  onOpenAddModal,
  currentExam,
}: UpcomingExamsTimelineProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | ExamType>("all");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedExams = useMemo(() => {
    return [...exams].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [exams]);

  const filteredExams = useMemo(() => {
    if (selectedFilter === "all") return sortedExams;
    return sortedExams.filter((e) => e.examType === selectedFilter);
  }, [sortedExams, selectedFilter]);

  const getCountdown = (dateStr: string) => {
    const examDate = new Date(dateStr);
    examDate.setHours(0, 0, 0, 0);
    const diffMs = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Past Exam", urgent: false, days: diffDays };
    if (diffDays === 0) return { text: "TODAY // D-DAY", urgent: true, days: 0 };
    if (diffDays === 1) return { text: "TOMORROW", urgent: true, days: 1 };
    return { text: `T-minus ${diffDays} Days`, urgent: diffDays <= 14, days: diffDays };
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Action and Filter Bar */}
      <div className="bg-white border-2 border-black p-3.5 sm:p-4 shadow-[4px_4px_0px_0px_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="font-meta text-[10px] text-neutral-500 font-bold uppercase pr-1">FILTER:</span>
          {(
            [
              { id: "all", label: "ALL EVENTS" },
              { id: "national", label: "NATIONAL NTA" },
              { id: "cbse-board", label: "CBSE BOARDS" },
              { id: "pre-board", label: "PRE-BOARDS" },
              { id: "mock-test", label: "MOCK TESTS" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1 font-meta text-xs font-bold border-2 border-black transition-colors cursor-pointer whitespace-nowrap ${
                selectedFilter === tab.id ? "bg-[#FF4D00] text-black" : "bg-neutral-100 text-black hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-4 py-2 bg-black text-white hover:bg-[#FF4D00] hover:text-black border-2 border-black font-meta text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-[2px_2px_0px_0px_#000000]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD EXAM / MOCK</span>
        </button>
      </div>

      {/* Timeline Cards */}
      <div className="space-y-4">
        {filteredExams.length === 0 ? (
          <div className="bg-white border-2 border-black p-8 sm:p-12 text-center shadow-[4px_4px_0px_0px_#000000] space-y-3">
            <div className="w-12 h-12 bg-[#FF4D00] border-2 border-black mx-auto flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
              <Calendar className="w-6 h-6 text-black" />
            </div>
            <h4 className="font-headline text-lg sm:text-xl text-black">NO EXAMS SCHEDULED</h4>
            <p className="font-sans text-xs text-neutral-600 max-w-md mx-auto">
              Your exam schedule is currently clean. Add your upcoming school pre-boards, board papers, or coaching mock tests to track your live countdown and schedule revision.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenAddModal}
                className="px-5 py-2.5 bg-black text-white hover:bg-[#FF4D00] hover:text-black border-2 border-black font-meta text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2 shadow-[3px_3px_0px_0px_#000000]"
              >
                <Plus className="w-4 h-4" />
                <span>+ ADD YOUR FIRST EXAM / MOCK</span>
              </button>
            </div>
          </div>
        ) : (
          filteredExams.map((exam) => {
            const countdown = getCountdown(exam.startDate);
            const isCompleted = exam.status === "completed";

          return (
            <div
              key={exam.id}
              style={{ borderLeftColor: exam.color }}
              className={`p-4 sm:p-5 border-2 border-black border-l-8 bg-white shadow-[3px_3px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#FF4D00] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isCompleted ? "opacity-75 bg-neutral-50" : ""
              }`}
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    style={{ backgroundColor: exam.color }}
                    className="font-meta text-[9px] text-white px-2 py-0.5 font-bold uppercase"
                  >
                    {exam.badgeLabel}
                  </span>

                  {/* Countdown Badge */}
                  <span
                    className={`font-meta text-[10px] font-bold px-2 py-0.5 border border-black flex items-center gap-1 ${
                      countdown.urgent
                        ? "bg-[#FF4D00] text-black animate-pulse"
                        : "bg-black text-white"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {countdown.text}
                  </span>

                  <span className="font-meta text-[10px] text-neutral-500 font-bold">
                    {new Date(exam.startDate).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {exam.endDate && ` – ${new Date(exam.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                  </span>
                </div>

                <h4 className="font-headline text-lg sm:text-xl text-black leading-snug">
                  {exam.title}
                </h4>

                {exam.notes && (
                  <p className="font-sans text-xs text-neutral-600 leading-relaxed max-w-2xl">
                    {exam.notes}
                  </p>
                )}

                <div className="flex items-center gap-3 flex-wrap text-xs pt-1">
                  {exam.timeSlot && (
                    <span className="font-meta text-[11px] text-neutral-700 flex items-center gap-1 font-bold">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      {exam.timeSlot}
                    </span>
                  )}
                  {exam.targetScore && (
                    <span className="font-meta text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300 font-bold flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-emerald-600" />
                      Goal: {exam.targetScore}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    {exam.subjects.map((sub) => (
                      <span
                        key={sub}
                        className="font-meta text-[9px] bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 text-black"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Action Controls */}
              <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100 self-end lg:self-center">
                <Link
                  href={`/dashboard/practice?exam=${currentExam}`}
                  className="px-3 py-1.5 bg-black text-white hover:bg-[#FF4D00] hover:text-black border-2 border-black font-meta text-xs font-bold transition-colors flex items-center gap-1 shadow-[2px_2px_0px_0px_#000000]"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FF4D00]" />
                  <span>DRILL PYQs</span>
                </Link>

                <button
                  type="button"
                  onClick={() => onToggleStatus(exam.id)}
                  className={`px-3 py-1.5 border-2 border-black font-meta text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-black hover:bg-neutral-100"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isCompleted ? "COMPLETED" : "MARK DONE"}</span>
                </button>

                {!exam.isOfficial && (
                  <button
                    type="button"
                    onClick={() => onDeleteExam(exam.id)}
                    className="p-1.5 border-2 border-black bg-white hover:bg-red-500 hover:text-white text-black transition-colors cursor-pointer"
                    title="Delete Exam Milestone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
}
