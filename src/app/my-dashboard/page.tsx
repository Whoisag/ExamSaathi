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
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={handleToggleLoading}
            disabled={simulateLoading}
            className="px-2.5 py-1 rounded-lg text-slate-700 hover:bg-white transition-all font-medium flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 text-[#3730A3] ${simulateLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Skeleton</span>
          </button>
          <button
            onClick={() => setSimulateEmpty(!simulateEmpty)}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1 ${
              simulateEmpty
                ? "bg-[#EA580C] text-white font-bold"
                : "text-slate-700 hover:bg-white"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Empty</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Readiness Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Readiness Score */}
          <div className="bg-white rounded-[12px] p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider">Exam Readiness</span>
              <Target className="w-4 h-4 text-[#3730A3]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {readinessScore}%
              </span>
              <span className="text-xs text-[#059669] font-semibold">+6% this week</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#3730A3] h-full rounded-full transition-all duration-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>

          {/* Metric 2: Mastered Chapters */}
          <div className="bg-white rounded-[12px] p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider">Mastered High-Yield</span>
              <Trophy className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#059669] font-mono">
                {masteredCount}
              </span>
              <span className="text-xs text-slate-400">/ {totalTopics} chapters</span>
            </div>
            <p className="text-[11px] text-slate-500">Average mock test accuracy 88%</p>
          </div>

          {/* Metric 3: Critical Gaps */}
          <div className="bg-white rounded-[12px] p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider">Attention Required</span>
              <Flame className="w-4 h-4 text-[#EA580C]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#EA580C] font-mono">
                {weakCount}
              </span>
              <span className="text-xs text-slate-400">Weak Topics</span>
            </div>
            <p className="text-[11px] text-slate-500">~20 marks at stake in upcoming session</p>
          </div>

          {/* Metric 4: In Active Revision */}
          <div className="bg-white rounded-[12px] p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider">In Revision Loop</span>
              <RotateCcw className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#D97706] font-mono">
                {revisingCount}
              </span>
              <span className="text-xs text-slate-400">Topics</span>
            </div>
            <p className="text-[11px] text-slate-500">Next scheduled revision: Today</p>
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
