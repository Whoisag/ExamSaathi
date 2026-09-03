"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  PlannedExam,
  OFFICIAL_UPCOMING_EXAMS,
  ChapterStatus,
  downloadIcsFile,
  COMPLETE_SYLLABUS,
} from "@/data/plannerData";
import { PlannerCalendarView } from "@/components/planner/PlannerCalendarView";
import { UpcomingExamsTimeline } from "@/components/planner/UpcomingExamsTimeline";
import { SyllabusCoverageTracker } from "@/components/planner/SyllabusCoverageTracker";
import { AddExamModal } from "@/components/planner/AddExamModal";
import {
  CalendarDays,
  ListTodo,
  BookOpen,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

const PLANNER_EXAM_TABS = [
  { id: "jee-main", shortName: "JEE MAIN 2026", scope: "Class 11 + 12 Full Syllabus" },
  { id: "cbse-12", shortName: "CBSE CLASS 12 BOARDS", scope: "Class 12 Boards Only" },
];

function PlannerPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawExam = searchParams?.get("exam") || "jee-main";
  const [currentExam, setCurrentExam] = useState<"jee-main" | "cbse-12">(
    rawExam === "cbse-12" ? "cbse-12" : "jee-main"
  );

  const [activeTab, setActiveTab] = useState<"calendar" | "timeline" | "syllabus">("calendar");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split("T")[0]);

  // Load custom exams from localStorage
  const [customExams, setCustomExams] = useState<PlannedExam[]>([]);
  const [chapterStatuses, setChapterStatuses] = useState<Record<string, ChapterStatus>>({});

  useEffect(() => {
    try {
      const savedExams = localStorage.getItem("examsaathi_planned_exams");
      if (savedExams) {
        const parsed = JSON.parse(savedExams);
        const filtered = Array.isArray(parsed) ? parsed.filter((e: PlannedExam) => !e.id.startsWith("off-")) : [];
        setCustomExams(filtered);
        localStorage.setItem("examsaathi_planned_exams", JSON.stringify(filtered));
      }
      const savedStatuses = localStorage.getItem("examsaathi_chapter_statuses");
      if (savedStatuses) {
        setChapterStatuses(JSON.parse(savedStatuses));
      }
      const savedTarget = localStorage.getItem("examsaathi_target_exam");
      if (savedTarget === "cbse-12" || savedTarget === "jee-main") {
        setCurrentExam(savedTarget);
      }
    } catch {
      // ignore
    }
  }, []);

  // Combined exams (Official + Custom)
  const allExams = useMemo(() => {
    return [...OFFICIAL_UPCOMING_EXAMS, ...customExams];
  }, [customExams]);

  const handleAddExam = (newExam: PlannedExam) => {
    const updated = [newExam, ...customExams];
    setCustomExams(updated);
    try {
      localStorage.setItem("examsaathi_planned_exams", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleDeleteExam = (id: string) => {
    const updated = customExams.filter((e) => e.id !== id);
    setCustomExams(updated);
    try {
      localStorage.setItem("examsaathi_planned_exams", JSON.stringify(updated));
      toast.success("Exam milestone removed.");
    } catch {
      // ignore
    }
  };

  const handleToggleStatus = (id: string) => {
    const isOfficial = OFFICIAL_UPCOMING_EXAMS.some((e) => e.id === id);
    if (isOfficial) {
      toast("Official milestone status toggled in your session.", { icon: "📅" });
      return;
    }
    const updated = customExams.map((e) =>
      e.id === id ? { ...e, status: (e.status === "completed" ? "upcoming" : "completed") as any } : e
    );
    setCustomExams(updated);
    try {
      localStorage.setItem("examsaathi_planned_exams", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAssignDateToChapter = (chapterName: string, dateStr: string, subject: string) => {
    const newRevisionBlock: PlannedExam = {
      id: `rev-${Date.now()}`,
      title: `Revision Sprint: ${chapterName}`,
      examType: "revision",
      examCategory: currentExam,
      startDate: dateStr,
      timeSlot: "Target Revision Sprint",
      targetScore: "100% PYQ Accuracy",
      subjects: [subject as any],
      status: "upcoming",
      notes: `Dedicated revision and formula recall sprint for ${chapterName}.`,
      isOfficial: false,
      color: "#7c3aed",
      badgeLabel: "REVISION SPRINT",
    };
    handleAddExam(newRevisionBlock);
    setSelectedDate(dateStr);
    setActiveTab("calendar");
  };

  const handleUpdateChapterStatus = (chapterId: string, status: ChapterStatus) => {
    const updated = { ...chapterStatuses, [chapterId]: status };
    setChapterStatuses(updated);
    try {
      localStorage.setItem("examsaathi_chapter_statuses", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Next Major Exam Calculation
  const nextMajorExam = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const upcoming = [...allExams]
      .filter((e) => e.startDate >= todayStr)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
    return upcoming || allExams[0] || null;
  }, [allExams]);

  const daysToNextExam = useMemo(() => {
    if (!nextMajorExam) return null;
    const diff = new Date(nextMajorExam.startDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [nextMajorExam]);

  // Syllabus stats
  const activeSyllabus = useMemo(() => {
    return currentExam === "cbse-12"
      ? COMPLETE_SYLLABUS.filter((c) => c.classLevel === 12)
      : COMPLETE_SYLLABUS;
  }, [currentExam]);

  const masteredChaptersCount = useMemo(() => {
    return activeSyllabus.filter((c) => (chapterStatuses[c.id] || c.status) === "mastered").length;
  }, [activeSyllabus, chapterStatuses]);

  const syllabusPercent = Math.round((masteredChaptersCount / activeSyllabus.length) * 100);

  return (
    <AppShell
      currentExam={currentExam}
      title="Academic Exam Planner &amp; Calendar"
      subtitle="Track your upcoming board and national examination dates, calendar shifts, coaching mocks, and 100% whole syllabus coverage."
      breadcrumbs={[{ label: "Planner" }]}
      actionSlot={
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => downloadIcsFile(allExams)}
            className="px-3 py-1.5 bg-black text-white hover:bg-white hover:text-black border-2 border-black font-meta text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000]"
            title="Download .ics file to import into Google Calendar or Apple Calendar"
          >
            <Calendar className="w-3.5 h-3.5 text-[#FF4D00]" />
            <span className="hidden sm:inline">SYNC iCAL</span>
          </button>


          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-black text-white hover:bg-white hover:text-black border-2 border-black font-meta text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000]"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF4D00]" />
            <span>+ ADD EXAM / MOCK</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Exam Switcher Bar */}
        <div className="grid grid-cols-2 bg-black text-white p-1.5 border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
          {PLANNER_EXAM_TABS.map((tab) => {
            const isSelected = currentExam === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setCurrentExam(tab.id as any);
                  localStorage.setItem("examsaathi_target_exam", tab.id);
                  router.push(`/planner?exam=${tab.id}`);
                }}
                className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wider uppercase whitespace-nowrap transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-[#FF4D00] text-black shadow-[2px_2px_0px_0px_#FFFFFF]"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <span>{tab.shortName}</span>
                <span
                  className={`text-[9px] font-meta px-1.5 py-0.5 border hidden sm:inline-block ${
                    isSelected
                      ? "bg-black text-[#FF4D00] border-black font-bold"
                      : "bg-neutral-800 text-neutral-400 border-neutral-700"
                  }`}
                >
                  {tab.scope}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4-KPI Command HUD Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* KPI 1: Next Major Exam Countdown */}
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between border-l-6 border-l-[#FF4D00]">
            <div>
              <span className="font-meta text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                // NEXT UPCOMING EXAM
              </span>
              <div className="font-headline text-xl sm:text-2xl text-black truncate">
                {nextMajorExam ? nextMajorExam.title : "No Exam Scheduled"}
              </div>
              <p className="font-meta text-[11px] text-neutral-600 mt-0.5">
                {nextMajorExam
                  ? new Date(nextMajorExam.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Add your first milestone"}
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-neutral-100 flex items-center justify-between">
              <span className="font-meta text-xs text-[#FF4D00] font-bold">
                {daysToNextExam !== null ? `T-minus ${daysToNextExam} Days` : "Clean Slate"}
              </span>
              {daysToNextExam !== null && <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-ping"></span>}
            </div>
          </div>

          {/* KPI 2: Syllabus Mastery Meter */}
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between border-l-6 border-l-black">
            <div>
              <span className="font-meta text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                // WHOLE SYLLABUS READINESS
              </span>
              <div className="font-headline text-2xl sm:text-3xl text-black">
                {syllabusPercent}%
              </div>
              <p className="font-meta text-[11px] text-neutral-600 mt-0.5">
                {masteredChaptersCount} of {activeSyllabus.length} Chapters Mastered
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-neutral-100">
              <div className="w-full h-2 bg-neutral-200 border border-black overflow-hidden">
                <div
                  style={{ width: `${syllabusPercent}%` }}
                  className="h-full bg-[#FF4D00] shadow-[0_0_8px_rgba(255,77,0,0.5)]"
                ></div>
              </div>
            </div>
          </div>

          {/* KPI 3: Total Scheduled Events */}
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between border-l-6 border-l-blue-600">
            <div>
              <span className="font-meta text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                // TRACKED MILESTONES
              </span>
              <div className="font-headline text-2xl sm:text-3xl text-black">
                {allExams.length}
              </div>
              <p className="font-meta text-[11px] text-neutral-600 mt-0.5">
                Official Dates + Custom Mock Drills
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-meta font-bold text-blue-700">
              <span>{allExams.filter((e) => e.examType === "mock-test").length} Coaching Mocks</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* KPI 4: Target Goal & Strategy */}
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between border-l-6 border-l-emerald-600">
            <div>
              <span className="font-meta text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                // TARGET BENCHMARK
              </span>
              <div className="font-headline text-xl sm:text-2xl text-emerald-800">
                {currentExam === "cbse-12" ? "95%+ BOARDS" : "99.2+ %ILE"}
              </div>
              <p className="font-meta text-[11px] text-neutral-600 mt-0.5">
                Top NIT/IIT / Board Distinction
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-meta font-bold text-emerald-700">
              <span>Zero-Bias Strategy</span>
              <Zap className="w-3.5 h-3.5 text-[#FF4D00]" />
            </div>
          </div>
        </div>

        {/* View Mode Switcher Tabs */}
        <div className="bg-black text-white p-2 border-2 border-black flex items-center justify-between gap-3 shadow-[4px_4px_0px_0px_#000000]">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("calendar")}
              className={`px-4 py-2 font-headline text-xs tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border ${
                activeTab === "calendar"
                  ? "bg-[#FF4D00] text-black border-[#FF4D00] font-bold"
                  : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>CALENDAR VIEW</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("timeline")}
              className={`px-4 py-2 font-headline text-xs tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border ${
                activeTab === "timeline"
                  ? "bg-[#FF4D00] text-black border-[#FF4D00] font-bold"
                  : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>UPCOMING EXAMS TIMELINE</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("syllabus")}
              className={`px-4 py-2 font-headline text-xs tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border ${
                activeTab === "syllabus"
                  ? "bg-[#FF4D00] text-black border-[#FF4D00] font-bold"
                  : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>WHOLE SYLLABUS TRACKER ({activeSyllabus.length} CHAPTERS)</span>
            </button>
          </div>

          <span className="font-meta text-xs text-[#FF4D00] font-bold pr-2 hidden md:inline">
            // LIVE PLANNER ENGINE
          </span>
        </div>

        {/* Tab Contents */}
        {activeTab === "calendar" && (
          <PlannerCalendarView
            exams={allExams}
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
            onOpenAddModal={(dateStr) => {
              if (dateStr) setSelectedDate(dateStr);
              setIsAddModalOpen(true);
            }}
            onToggleStatus={handleToggleStatus}
            onDeleteExam={handleDeleteExam}
          />
        )}

        {activeTab === "timeline" && (
          <UpcomingExamsTimeline
            exams={allExams}
            onToggleStatus={handleToggleStatus}
            onDeleteExam={handleDeleteExam}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            currentExam={currentExam}
          />
        )}

        {activeTab === "syllabus" && (
          <SyllabusCoverageTracker
            currentExam={currentExam}
            onAssignDateToChapter={handleAssignDateToChapter}
            chapterStatuses={chapterStatuses}
            onUpdateChapterStatus={handleUpdateChapterStatus}
          />
        )}

        {/* Add Exam Modal */}
        <AddExamModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddExam={handleAddExam}
          defaultDate={selectedDate}
          defaultExamCategory={currentExam}
        />
      </div>
    </AppShell>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-black font-headline">Loading Academic Planner...</div>}>
      <PlannerPageContent />
    </Suspense>
  );
}
