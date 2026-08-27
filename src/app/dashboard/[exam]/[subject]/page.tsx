"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TopicHeatmap } from "@/components/dashboard/TopicHeatmap";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { TopicPredictor } from "@/components/dashboard/TopicPredictor";
import { GapAlert } from "@/components/dashboard/GapAlert";
import {
  EXAMS,
  ExamId,
  MOCK_HEATMAP_DATA,
  MOCK_TREND_DATA,
  MOCK_TREND_TOPICS,
  MOCK_PREDICTIONS,
  MOCK_GAP_ALERTS,
} from "@/data/mock";
import { Sparkles, SlidersHorizontal, Eye, RefreshCw } from "lucide-react";

export default function DashboardSubjectPage() {
  const params = useParams();
  const rawExam = (params?.exam as string) || "jee-main";
  const rawSubject = (params?.subject as string) || "physics";

  const examId = (rawExam in EXAMS ? rawExam : "jee-main") as ExamId;
  const exam = EXAMS[examId] || EXAMS["jee-main"];

  // Normalize subject name
  const matchedSubject =
    exam.subjects.find((s) => s.toLowerCase() === rawSubject.toLowerCase()) ||
    exam.subjects[0] ||
    "Physics";

  // State toggles for testing isLoading (skeleton) and empty states as required
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [simulateEmpty, setSimulateEmpty] = useState(false);

  // Retrieve mock data
  const heatmapKey = `${examId}-${matchedSubject.toLowerCase()}`;
  const heatmapData = MOCK_HEATMAP_DATA[heatmapKey] || MOCK_HEATMAP_DATA["jee-main-physics"];

  const handleToggleLoading = () => {
    setSimulateLoading(true);
    setTimeout(() => setSimulateLoading(false), 1200);
  };

  return (
    <AppShell
      currentExam={examId}
      currentSubject={matchedSubject}
      title={`${exam.shortName} • ${matchedSubject} Analytics`}
      subtitle={`Comprehensive historical PYQ frequency trends, predictive shift weightage, and cyclic recurrence anomalies.`}
      breadcrumbs={[
        { label: exam.shortName, href: "/" },
        { label: matchedSubject },
      ]}
      actionSlot={
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={handleToggleLoading}
            disabled={simulateLoading}
            className="px-2.5 py-1 rounded-lg text-slate-700 hover:bg-white hover:shadow-2xs transition-all font-medium flex items-center gap-1"
            title="Simulate Skeleton Loading State"
          >
            <RefreshCw className={`w-3 h-3 text-[#3730A3] ${simulateLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Test Loading</span>
          </button>
          <button
            onClick={() => setSimulateEmpty(!simulateEmpty)}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1 ${
              simulateEmpty
                ? "bg-[#EA580C] text-white shadow-2xs font-bold"
                : "text-slate-700 hover:bg-white hover:shadow-2xs"
            }`}
            title="Simulate Empty State"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Test Empty</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top 2-Column Section: Topic Predictor + Gap Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Component 1: TopicPredictor */}
          <TopicPredictor
            predictions={MOCK_PREDICTIONS}
            isLoading={simulateLoading}
            isEmpty={simulateEmpty}
          />

          {/* Component 2: GapAlert */}
          <GapAlert
            alerts={MOCK_GAP_ALERTS}
            isLoading={simulateLoading}
            isEmpty={simulateEmpty}
          />
        </div>

        {/* Component 3: TopicHeatmap */}
        <TopicHeatmap
          data={heatmapData}
          isLoading={simulateLoading}
          isEmpty={simulateEmpty}
        />

        {/* Component 4: TrendChart */}
        <TrendChart
          data={MOCK_TREND_DATA}
          topics={MOCK_TREND_TOPICS}
          isLoading={simulateLoading}
          isEmpty={simulateEmpty}
        />
      </div>
    </AppShell>
  );
}
