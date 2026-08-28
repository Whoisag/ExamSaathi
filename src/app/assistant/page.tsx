"use client";

import React, { useState } from "react";
import { BrutalistHeader } from "@/components/layout/BrutalistHeader";
import { ChatInterface } from "@/components/assistant/ChatInterface";
import { MOCK_ASSISTANT_MESSAGES, MOCK_SUGGESTED_PROMPTS } from "@/data/mock";
import { RefreshCw, Sparkles, Terminal } from "lucide-react";

export default function AssistantPage() {
  const [isLoading, setIsLoading] = useState(false);

  const toggleSkeleton = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-[#FF4D00] selection:text-white font-sans">
      <BrutalistHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-brutal-b pb-6 mb-8 gap-4">
          <div>
            <div className="font-meta text-xs text-[#FF4D00] font-bold mb-1">
              // NEURAL AGENT // AUDIT CHAT INTERFACE
            </div>
            <h1 className="font-headline text-3xl sm:text-5xl text-black tracking-tight">
              EXAM STRATEGY ASSISTANT
            </h1>
            <p className="text-sm text-neutral-600 mt-2 max-w-2xl font-medium">
              Consult with your analytical AI mentor on PYQ shift anomalies, high-yield formula requirements, and customized revision planning.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSkeleton}
              className="border-brutal px-3.5 py-2 font-meta text-xs hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>TEST SKELETON</span>
            </button>
            <div className="border-brutal bg-[#FF4D00] text-black px-3.5 py-2 font-meta text-xs font-bold">
              UI PREVIEW ONLY
            </div>
          </div>
        </div>

        {/* Chat UI Component accepting messages & prompts via props */}
        <ChatInterface
          initialMessages={MOCK_ASSISTANT_MESSAGES}
          suggestedPrompts={MOCK_SUGGESTED_PROMPTS}
          isLoading={isLoading}
        />
      </main>

      {/* Footer */}
      <footer className="border-brutal-t p-6 text-center font-meta text-xs text-neutral-500 mt-12">
        EXAMSAATHI AI ASSISTANT • PURE PROPS-DRIVEN SHELL • NO EXTERNAL API CALLS
      </footer>
    </div>
  );
}
