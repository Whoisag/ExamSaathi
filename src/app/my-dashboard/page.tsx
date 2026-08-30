"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ConfidenceSelector } from "@/components/my-dashboard/ConfidenceSelector";
import { WeakSpots } from "@/components/my-dashboard/WeakSpots";
import { QuickWins } from "@/components/my-dashboard/QuickWins";
import {
  MOCK_USER_TOPICS,
  MOCK_WEAK_SPOTS,
  MOCK_QUICK_WINS,
  UserTopicConfidence,
} from "@/data/mock";
import {
  BookmarkCheck,
  Target,
  Trophy,
  Flame,
  Clock,
  RotateCcw,
  Eye,
  RefreshCw,
} from "lucide-react";

export default function MyDashboardPage() {
  const [topics, setTopics] = useState<UserTopicConfidence[]>(MOCK_USER_TOPICS);
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [simulateEmpty, setSimulateEmpty] = useState(false);

  const handleConfidenceChange = (
    id: string,
    newConfidence: "mastered" | "revising" | "weak"
  ) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, confidence: newConfidence } : t))
    );
  };

  const handleToggleLoading = () => {
    setSimulateLoading(true);
    setTimeout(() => setSimulateLoading(false), 1000);
  };

  // Calculations for summary stats
  const totalTopics = topics.length;
  const masteredCount = topics.filter((t) => t.confidence === "mastered").length;
  const revisingCount = topics.filter((t) => t.confidence === "revising").length;
  const weakCount = topics.filter((t) => t.confidence === "weak").length;
  const readinessScore = Math.round(
    ((masteredCount * 1.0 + revisingCount * 0.5) / Math.max(1, totalTopics)) * 100
  );

  return (
    <AppShell
      title="My Personal Prep Hub"
      subtitle="Track your syllabus mastery, resolve high-stakes vulnerabilities, and bank quick-win marks."
      breadcrumbs={[{ label: "My Dashboard" }]}
      actionSlot={
        <div className="flex items-center gap-1.5 bg-white p-1 border-2 border-black text-xs font-meta shadow-[2px_2px_0px_0px_#000000]">
          <button
            onClick={handleToggleLoading}
            disabled={simulateLoading}
            className="px-2.5 py-1 text-black hover:bg-[#FF4D00] transition-all font-bold flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 text-black ${simulateLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">SKELETON</span>
          </button>
          <button
            onClick={() => setSimulateEmpty(!simulateEmpty)}
            className={`px-2.5 py-1 transition-all font-bold flex items-center gap-1 ${
              simulateEmpty
                ? "bg-black text-[#FF4D00]"
                : "text-black hover:bg-[#FF4D00]"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">EMPTY</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Readiness Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          {/* Metric 1: Readiness Score */}
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-meta">
              <span className="font-bold uppercase tracking-wider text-black">Exam Readiness</span>
              <Target className="w-4 h-4 text-[#FF4D00]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-headline text-black">
                {readinessScore}%
              </span>
              <span className="text-xs font-meta text-emerald-600 font-bold">+6% this week</span>
            </div>
            <div className="w-full bg-neutral-100 border border-black h-2 overflow-hidden">
              <div
                className="bg-[#FF4D00] h-full transition-all duration-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>

          {/* Metric 2: Mastered Chapters */}
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-meta">
              <span className="font-bold uppercase tracking-wider text-black">Mastered High-Yield</span>
              <Trophy className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-headline text-black">
                {masteredCount}
              </span>
              <span className="text-xs font-meta text-neutral-600">/ {totalTopics} chapters</span>
            </div>
            <p className="font-meta text-[11px] text-neutral-500">Average mock test accuracy 88%</p>
          </div>

          {/* Metric 3: Critical Gaps */}
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-meta">
              <span className="font-bold uppercase tracking-wider text-black">Attention Required</span>
              <Flame className="w-4 h-4 text-[#FF4D00]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-headline text-[#FF4D00]">
                {weakCount}
              </span>
              <span className="text-xs font-meta text-neutral-600">Weak Topics</span>
            </div>
            <p className="font-meta text-[11px] text-neutral-500">~20 marks at stake in upcoming session</p>
          </div>

          {/* Metric 4: In Active Revision */}
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-meta">
              <span className="font-bold uppercase tracking-wider text-black">In Revision Loop</span>
              <RotateCcw className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-headline text-black">
                {revisingCount}
              </span>
              <span className="text-xs font-meta text-neutral-600">Topics</span>
            </div>
            <p className="font-meta text-[11px] text-neutral-500">Next scheduled revision: Today</p>
          </div>
        </div>

        {/* 2-Column Section: Weak Spots & Quick Wins */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeakSpots
            items={simulateEmpty ? [] : MOCK_WEAK_SPOTS}
            isLoading={simulateLoading}
            isEmpty={simulateEmpty}
          />
          <QuickWins
            items={simulateEmpty ? [] : MOCK_QUICK_WINS}
            isLoading={simulateLoading}
            isEmpty={simulateEmpty}
          />
        </div>

        {/* Confidence Selector Table */}
        <ConfidenceSelector
          topics={simulateEmpty ? [] : topics}
          onConfidenceChange={handleConfidenceChange}
          isLoading={simulateLoading}
          isEmpty={simulateEmpty}
        />
      </div>
    </AppShell>
  );
}
