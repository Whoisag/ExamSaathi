"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PracticeQuestionList } from "@/components/dashboard/PracticeQuestionList";
import { EXAMS, ExamId } from "@/data/mock";
import { Zap, Sparkles, BookOpen } from "lucide-react";

const PREP_EXAM_TABS: { id: ExamId; shortName: string }[] = [
  { id: "jee-main", shortName: "JEE MAIN 2026" },
  { id: "cbse-12", shortName: "CBSE CLASS 12 BOARDS" },
];

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawExam = searchParams?.get("exam");
  const urlSubject = searchParams?.get("subject") || undefined;
  const urlChapter = searchParams?.get("chapter") || undefined;

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
      const saved = localStorage.getItem("examsaathi_target_exam");
      if (saved && saved in EXAMS) {
        setCurrentExam(saved as ExamId);
        return;
      }
      const stored = localStorage.getItem("exam_saathi_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.targetExam && u.targetExam in EXAMS) setCurrentExam(u.targetExam as ExamId);
      }
    } catch {
      // fallback
    }
  }, [rawExam]);

  const examInfo = EXAMS[currentExam] || EXAMS["cbse-12"];

  const handleSwitchExam = (examId: ExamId) => {
    setCurrentExam(examId);
    try {
      localStorage.setItem("examsaathi_target_exam", examId);
    } catch {
      // fallback
    }
  };

  return (
    <AppShell
      currentExam={currentExam}
      title="Practice Questions"
      subtitle={`${examInfo.shortName} — Chapter-wise drills with answers, hints, MCQ choices, and attempt tracking.`}
      breadcrumbs={[
        { label: "Exams", href: "/dashboard/exams" },
        { label: "Practice" },
      ]}
      actionSlot={
        <div className="flex items-center gap-2">
          <span className="font-meta text-[10px] font-bold px-3 py-1.5 bg-[#FF4D00] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            AI DRILL ENGINE
          </span>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Exam Switcher Bar */}
        <div className="grid grid-cols-2 bg-black text-white p-1 border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
          {PREP_EXAM_TABS.map((exam) => (
            <button
              key={exam.id}
              type="button"
              onClick={() => handleSwitchExam(exam.id)}
              className={`px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wider uppercase whitespace-nowrap transition-colors text-center cursor-pointer ${
                currentExam === exam.id
                  ? "bg-[#FF4D00] text-black"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              {exam.shortName}
            </button>
          ))}
        </div>

        {/* Practice Question List Component */}
        <PracticeQuestionList
          currentExam={currentExam}
          initialSubject={urlSubject}
          initialChapter={urlChapter}
        />
      </div>
    </AppShell>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="border-2 border-black bg-white p-8 shadow-[4px_4px_0px_0px_#000000] font-headline text-lg uppercase">
            Loading Practice Questions...
          </div>
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}

