"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SyllabusChapter, ChapterStatus, getSyllabusForExam } from "@/data/plannerData";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ExternalLink,
  Sigma,
  Zap,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

interface SyllabusCoverageTrackerProps {
  currentExam: "jee-main" | "cbse-12";
  onAssignDateToChapter: (chapterName: string, dateStr: string, subject: string) => void;
  chapterStatuses: Record<string, ChapterStatus>;
  onUpdateChapterStatus: (chapterId: string, status: ChapterStatus) => void;
}

export function SyllabusCoverageTracker({
  currentExam,
  onAssignDateToChapter,
  chapterStatuses,
  onUpdateChapterStatus,
}: SyllabusCoverageTrackerProps) {
  const [selectedSubject, setSelectedSubject] = useState<"All" | "Physics" | "Chemistry" | "Mathematics">("All");
  const [selectedClass, setSelectedClass] = useState<"All" | 11 | 12>("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | ChapterStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const rawSyllabus = useMemo(() => {
    return getSyllabusForExam(currentExam);
  }, [currentExam]);

  // Merge with user's persisted status
  const syllabus = useMemo(() => {
    return rawSyllabus.map((ch) => ({
      ...ch,
      status: chapterStatuses[ch.id] || ch.status,
    }));
  }, [rawSyllabus, chapterStatuses]);

  // Filtered chapters
  const filteredChapters = useMemo(() => {
    return syllabus.filter((ch) => {
      if (selectedSubject !== "All" && ch.subject !== selectedSubject) return false;
      if (selectedClass !== "All" && ch.classLevel !== selectedClass) return false;
      if (selectedStatus !== "All" && ch.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ch.name.toLowerCase().includes(q) ||
          ch.description.toLowerCase().includes(q) ||
          ch.subject.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [syllabus, selectedSubject, selectedClass, selectedStatus, searchQuery]);

  // Overall stats
  const totalCount = syllabus.length;
  const masteredCount = syllabus.filter((c) => c.status === "mastered").length;
  const revisingCount = syllabus.filter((c) => c.status === "revising").length;
  const pendingCount = syllabus.filter((c) => c.status === "pending").length;
  const progressPct = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  const cycleStatus = (ch: SyllabusChapter) => {
    const next: Record<ChapterStatus, ChapterStatus> = {
      pending: "revising",
      revising: "mastered",
      mastered: "pending",
    };
    const newStatus = next[ch.status];
    onUpdateChapterStatus(ch.id, newStatus);
    toast.success(`Updated ${ch.name} to ${newStatus.toUpperCase()}`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Syllabus HUD Summary */}
      <div className="bg-white border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2 border-black">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-meta text-[10px] font-bold text-[#FF4D00] uppercase tracking-wider">
                // COMPLETE OFFICIAL SYLLABUS CATALOG
              </span>
              <span className="font-meta text-[9px] px-2 py-0.5 bg-black text-white font-bold">
                {currentExam === "cbse-12" ? "CBSE CLASS 12 BOARDS ONLY" : "FULL JEE (CLASS 11 + 12)"}
              </span>
            </div>
            <h3 className="font-headline text-xl sm:text-2xl text-black">
              Syllabus Coverage &amp; Mastery Matrix
            </h3>
            <p className="font-sans text-xs text-neutral-600 mt-1 max-w-2xl">
              Track all {totalCount} chapters across Physics, Chemistry, and Mathematics. Assign target dates, monitor exam weightage, and link directly to PYQ drills.
            </p>
          </div>

          {/* Quick Gauge */}
          <div className="flex items-center gap-4 bg-neutral-50 p-3 border-2 border-black shrink-0">
            <div className="text-right">
              <div className="font-headline text-2xl sm:text-3xl text-black leading-none">
                {progressPct}%
              </div>
              <div className="font-meta text-[9px] text-neutral-500 font-bold uppercase mt-0.5">
                SYLLABUS MASTERED
              </div>
            </div>
            <div className="w-28 sm:w-36 h-3 bg-neutral-200 border border-black overflow-hidden relative">
              <div
                style={{ width: `${progressPct}%` }}
                className="h-full bg-[#FF4D00] shadow-[0_0_8px_rgba(255,77,0,0.5)] transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 pt-3 text-center">
          <div className="p-2 border border-emerald-500 bg-emerald-50 text-emerald-950 font-meta">
            <span className="text-base sm:text-lg font-headline font-bold block text-emerald-800">{masteredCount}</span>
            <span className="text-[9px] font-bold uppercase">Mastered</span>
          </div>
          <div className="p-2 border border-amber-500 bg-amber-50 text-amber-950 font-meta">
            <span className="text-base sm:text-lg font-headline font-bold block text-amber-800">{revisingCount}</span>
            <span className="text-[9px] font-bold uppercase">In Revision</span>
          </div>
          <div className="p-2 border border-neutral-400 bg-neutral-100 text-neutral-800 font-meta">
            <span className="text-base sm:text-lg font-headline font-bold block text-neutral-700">{pendingCount}</span>
            <span className="text-[9px] font-bold uppercase">Pending</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border-2 border-black p-3.5 sm:p-4 shadow-[4px_4px_0px_0px_#000000] space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters by name, concepts, or derivations..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border-2 border-black text-xs font-sans focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Subject Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {(["All", "Physics", "Chemistry", "Mathematics"] as const).map((sub) => {
              const active = selectedSubject === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 font-meta text-xs font-bold border-2 border-black transition-colors cursor-pointer ${
                    active ? "bg-[#FF4D00] text-black" : "bg-neutral-100 text-black hover:bg-neutral-200"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter Row: Class & Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-neutral-200 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {currentExam === "jee-main" && (
              <div className="flex items-center gap-1">
                <span className="font-meta text-[10px] text-neutral-500 font-bold uppercase">CLASS:</span>
                {(["All", 11, 12] as const).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setSelectedClass(cls)}
                    className={`px-2 py-0.5 font-meta text-[10px] font-bold border border-black ${
                      selectedClass === cls ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100"
                    }`}
                  >
                    {cls === "All" ? "ALL" : `CLASS ${cls}`}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1">
              <span className="font-meta text-[10px] text-neutral-500 font-bold uppercase">STATUS:</span>
              {(["All", "mastered", "revising", "pending"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2 py-0.5 font-meta text-[10px] font-bold border border-black uppercase ${
                    selectedStatus === st ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="font-meta text-xs text-neutral-600 font-bold">
            SHOWING: {filteredChapters.length} OF {totalCount} CHAPTERS
          </div>
        </div>
      </div>

      {/* Chapters Grid / List */}
      <div className="space-y-3">
        {filteredChapters.map((ch) => {
          const statusBg = {
            mastered: "bg-emerald-100 border-emerald-600 text-emerald-900",
            revising: "bg-amber-100 border-amber-600 text-amber-900",
            pending: "bg-neutral-100 border-neutral-400 text-neutral-700",
          }[ch.status];

          const statusBadgeText = {
            mastered: "MASTERED",
            revising: "REVISING",
            pending: "NOT STARTED",
          }[ch.status];

          return (
            <div
              key={ch.id}
              className={`p-4 sm:p-5 border-2 border-black bg-white shadow-[3px_3px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#FF4D00] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4`}
            >
              {/* Left Info */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-meta text-[10px] font-bold px-2 py-0.5 bg-black text-white">
                    {ch.subject.toUpperCase()}
                  </span>
                  <span className="font-meta text-[10px] font-bold px-2 py-0.5 bg-neutral-100 border border-black text-black">
                    CLASS {ch.classLevel}
                  </span>
                  <span className="font-meta text-[10px] font-bold px-1.5 py-0.5 bg-neutral-50 text-neutral-600 border border-neutral-300">
                    WEIGHTAGE: {ch.weightagePercent}%
                  </span>
                  <span className={`font-meta text-[9px] font-bold px-1.5 py-0.5 border ${
                    ch.pyqFrequency === "Critical" ? "bg-red-50 text-red-700 border-red-300" : "bg-blue-50 text-blue-700 border-blue-300"
                  }`}>
                    {ch.pyqFrequency} Frequency
                  </span>
                </div>

                <h4 className="font-headline text-base sm:text-lg text-black leading-snug">
                  {ch.name}
                </h4>

                <p className="font-sans text-xs text-neutral-600 leading-relaxed max-w-3xl">
                  {ch.description}
                </p>

                {/* Target Date Picker */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-meta text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#FF4D00]" />
                    Target Revision Date:
                  </span>
                  <input
                    type="date"
                    defaultValue={ch.targetDate || ""}
                    onChange={(e) => {
                      if (e.target.value) {
                        onAssignDateToChapter(ch.name, e.target.value, ch.subject);
                        toast.success(`Scheduled ${ch.name} for ${e.target.value}!`);
                      }
                    }}
                    className="bg-neutral-50 border border-black px-2 py-0.5 text-xs font-meta cursor-pointer hover:bg-white"
                  />
                </div>
              </div>

              {/* Right Status & Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                {/* Status Toggle Button */}
                <button
                  type="button"
                  onClick={() => cycleStatus(ch)}
                  className={`px-3 py-1.5 border-2 font-meta text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#000000] ${statusBg}`}
                  title="Click to toggle status (Not Started -> Revising -> Mastered)"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{statusBadgeText}</span>
                </button>

                {/* Direct Action Links */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/practice?exam=${currentExam}&subject=${ch.subject.toLowerCase()}&chapter=${encodeURIComponent(ch.name)}`}
                    className="px-2.5 py-1 bg-black text-white hover:bg-[#FF4D00] hover:text-black border-2 border-black font-meta text-[11px] font-bold transition-colors flex items-center gap-1 shadow-[2px_2px_0px_0px_#000000]"
                  >
                    <Zap className="w-3 h-3 text-[#FF4D00]" />
                    <span>DRILL PYQs</span>
                  </Link>

                  <Link
                    href={`/formulas/${currentExam}/${ch.subject.toLowerCase()}`}
                    className="px-2.5 py-1 bg-white text-black hover:bg-neutral-100 border-2 border-black font-meta text-[11px] font-bold transition-colors flex items-center gap-1 shadow-[2px_2px_0px_0px_#000000]"
                  >
                    <Sigma className="w-3 h-3" />
                    <span>FORMULAS</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
