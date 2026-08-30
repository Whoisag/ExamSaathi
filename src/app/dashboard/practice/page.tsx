"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PracticeQuestionList } from "@/components/dashboard/PracticeQuestionList";
import { EXAMS, ExamId } from "@/data/mock";
import { Dumbbell, Sparkles, BookOpen, Layers, RefreshCw } from "lucide-react";

function PracticeContent() {
  const searchParams = useSearchParams();
  const rawExam = searchParams?.get("exam") || "cbse-12";
  const [currentExam, setCurrentExam] = useState<ExamId>(() => {
    if (rawExam && rawExam in EXAMS) return rawExam as ExamId;
    return "cbse-12";
  });

  useEffect(() => {
    if (rawExam && rawExam in EXAMS) {
      setCurrentExam(rawExam as ExamId);
      return;
    }
    try {
      const stored = localStorage.getItem("exam_saathi_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.targetExam && u.targetExam in EXAMS) {
          setCurrentExam(u.targetExam as ExamId);
        }
      }
    } catch {
      // fallback
    }
  }, [rawExam]);

  const examInfo = EXAMS[currentExam] || EXAMS["cbse-12"];

  return (
    <AppShell
      currentExam={currentExam}
      currentSubject="Physics"
      title={`${examInfo.shortName} • AI Practice Drills`}
      subtitle="Synthetic exam questions calibrated against real shift weightages, syllabus rationalization, and recurrence gaps."
      breadcrumbs={[
        { label: "Exams", href: "/dashboard/exams" },
        { label: examInfo.shortName, href: `/dashboard/exams/${currentExam}/chapters` },
        { label: "AI Practice" },
      ]}
    >
      <div className="space-y-8">
        {/* Practice Banner */}
        <div className="border-2 border-black bg-black text-white p-6 sm:p-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#FF4D00] text-black font-meta text-[11px] px-2.5 py-0.5 font-bold uppercase">
                  {examInfo.shortName} REPOSITORY
                </span>
                <span className="font-meta text-xs text-neutral-400">
                  // AI PRACTICE DRILL ENGINE
                </span>
              </div>
              <h2 className="font-headline text-2xl sm:text-4xl text-white tracking-tight">
                TARGETED SYLLABUS PRACTICE
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-2 max-w-2xl leading-relaxed">
                Filter drills by subject, chapter, or difficulty. Each question is tagged with empirical weightage metrics and AI synthesis badges.
              </p>
            </div>

            <div className="border-2 border-[#FF4D00] bg-neutral-900 px-4 py-3 font-meta text-xs flex items-center gap-2 self-start md:self-auto shrink-0 shadow-[3px_3px_0px_0px_#FF4D00]">
              <Sparkles className="w-4 h-4 text-[#FF4D00]" />
              <span className="text-white font-bold">2026 DRILL PROTOCOL</span>
            </div>
          </div>
        </div>

        {/* Practice Question List with client-side filters */}
        <PracticeQuestionList />
      </div>
    </AppShell>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FF4D00] flex items-center justify-center p-8">
          <div className="border-2 border-black bg-white p-8 font-headline text-lg">
            LOADING PRACTICE DRILLS...
          </div>
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}
