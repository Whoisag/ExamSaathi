"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { BrutalistHeader } from "@/components/layout/BrutalistHeader";
import { ChatInterface } from "@/components/assistant/ChatInterface";
import { MOCK_ASSISTANT_MESSAGES, MOCK_SUGGESTED_PROMPTS } from "@/data/mock";
import { RefreshCw, Sparkles, Zap } from "lucide-react";

export default function AssistantPage() {
  const searchParams = useSearchParams();
  const exam = searchParams?.get("exam") || "jee-main";
  const chapter = searchParams?.get("chapter") || "General Strategy";
  const [isLoading, setIsLoading] = useState(false);

  const toggleSkeleton = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="min-h-screen bg-[#FF4D00] text-black flex flex-col justify-between selection:bg-black selection:text-white font-sans">
      <BrutalistHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header Title Banner */}
        <div className="border-brutal bg-black text-white p-6 sm:p-8 mb-8 relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="font-meta text-xs text-[#FF4D00] font-bold mb-1">
              // NEURAL AGENT // LIVE SOCRATIC TUTOR
            </div>
            <h1 className="font-headline text-3xl sm:text-5xl text-white tracking-tight">
              AI STRATEGY ASSISTANT
            </h1>
            <p className="text-sm text-neutral-300 mt-2 max-w-2xl font-medium">
              Interact with your analytical AI mentor on PYQ shift anomalies, high-yield formula breakdowns, and customized revision planning.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSkeleton}
              className="border-brutal bg-white text-black px-3.5 py-2 font-meta text-xs hover:bg-[#FF4D00] transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>TEST SKELETON</span>
            </button>
            <div className="border-brutal bg-[#FF4D00] text-black px-3.5 py-2 font-meta text-xs font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Live Chat UI Component connected to /api/assistant */}
        <ChatInterface
          initialMessages={MOCK_ASSISTANT_MESSAGES}
          suggestedPrompts={MOCK_SUGGESTED_PROMPTS}
          isLoading={isLoading}
          exam={exam}
          chapter={chapter}
        />
      </main>

      {/* Footer */}
      <footer className="border-brutal-t bg-black text-white py-6 px-4 md:px-8 mt-12 font-meta text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>// EXAMSAATHI AI ASSISTANT • 2026 SHELL</div>
          <div className="text-neutral-400">
            POWERED BY OPENROUTER & HAIMAKER MULTI-PROVIDER AI
          </div>
        </div>
      </footer>
    </div>
  );
}
