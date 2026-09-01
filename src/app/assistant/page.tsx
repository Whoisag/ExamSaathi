"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ChatInterface } from "@/components/assistant/ChatInterface";
import { MOCK_ASSISTANT_MESSAGES, MOCK_SUGGESTED_PROMPTS, ExamId, EXAMS, serializePrepHubForAI } from "@/data/mock";
import { Zap } from "lucide-react";

function AssistantContent() {
  const searchParams = useSearchParams();
  const rawExam = searchParams?.get("exam") || "jee-main";
  const [currentExam, setCurrentExam] = useState<ExamId>(() => {
    if (rawExam && rawExam in EXAMS) return rawExam as ExamId;
    return "jee-main";
  });
  const chapter = searchParams?.get("chapter") || "General Strategy";
  const prepHub = searchParams?.get("prepHub");
  const mode = searchParams?.get("mode");
  const urlPrompt = searchParams?.get("prompt");
  const prepHubContext = (prepHub === "1" || mode) ? serializePrepHubForAI(currentExam) : "";

  const initialQuery = urlPrompt || (
    mode === "remediate" 
      ? "Please analyze my high-stakes weak spots from my Prep Hub and generate a step-by-step remediation plan with high-yield practice questions." 
      : mode === "sprint" 
      ? "Generate a 30-minute high-ROI quick win sprint with guaranteed-mark questions based on my Prep Hub status."
      : undefined
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("examsaathi_target_exam");
      if (saved && saved in EXAMS) setCurrentExam(saved as ExamId);
    } catch {}
  }, []);

  return (
    <AppShell
      currentExam={currentExam}
      title="AI Strategy Tutor"
      subtitle="Your Socratic AI mentor for PYQ shift analytics, formula breakdowns, and revision planning. Chats auto-save to your browser."
      breadcrumbs={[{ label: "AI Strategy Tutor" }]}
      hideSubjectsTab={true}
      actionSlot={
        <div className="flex items-center gap-2">
          <div className="border-2 border-black bg-[#FF4D00] text-black px-3 py-1.5 font-meta text-xs font-bold flex items-center gap-1 shadow-[2px_2px_0px_0px_#000000]">
            <Zap className="w-3.5 h-3.5" />
            <span>ACTIVE</span>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {(prepHub === "1" || mode) && (
          <div className="bg-[#FF4D00] text-black border-2 border-black p-2 text-center font-meta text-xs font-bold shadow-[2px_2px_0px_0px_#000000]">
            📊 Prep Hub Connected — AI has access to your readiness status
          </div>
        )}
        <ChatInterface
          initialMessages={MOCK_ASSISTANT_MESSAGES}
          suggestedPrompts={MOCK_SUGGESTED_PROMPTS}
          exam={currentExam}
          chapter={chapter}
          prepHubContext={prepHubContext}
          initialQuery={initialQuery}
        />
      </div>
    </AppShell>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="border-2 border-black bg-white p-8 shadow-[4px_4px_0px_0px_#000000] font-headline text-lg uppercase">
            Loading AI Tutor...
          </div>
        </div>
      }
    >
      <AssistantContent />
    </Suspense>
  );
}

