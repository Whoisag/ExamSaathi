"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMotion, containerVariants, cardVariants } from "@/hooks/useMotion";
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
  const { shouldAnimate } = useMotion();
  const rawExam = (params?.exam as string) || "jee-main";
  const rawSubject = (params?.subject as string) || "physics";

  const examId = (rawExam in EXAMS ? rawExam : "jee-main") as ExamId;
  const exam = EXAMS[examId] || EXAMS["jee-main"];

  // Normalize subject name
  const matchedSubject =
    exam.subjects.find((s) => s.toLowerCase() === rawSubject.toLowerCase()) ||
    exam.subjects[0] ||
    "Physics";

  const [predictions, setPredictions] = useState(MOCK_PREDICTIONS);
  const [gapAlerts, setGapAlerts] = useState(MOCK_GAP_ALERTS);

  // State toggles for testing isLoading (skeleton) and empty states as required
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [simulateEmpty, setSimulateEmpty] = useState(false);

  // Retrieve heatmap data with fallback
  const heatmapKey = `${examId}-${matchedSubject.toLowerCase()}`;
  const heatmapData = MOCK_HEATMAP_DATA[heatmapKey] || MOCK_HEATMAP_DATA["jee-main-physics"];

  // Live fetch from /api/analyze
  useEffect(() => {
    let isMounted = true;
    async function loadAnalysis() {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exam: examId, chapter: matchedSubject.toLowerCase() }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.analysis) {
            if (Array.isArray(data.analysis.gapAlerts) && data.analysis.gapAlerts.length > 0) {
              setGapAlerts(data.analysis.gapAlerts);
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch /api/analyze for subject dashboard:", err);
      }
    }
    loadAnalysis();
    return () => {
      isMounted = false;
    };
  }, [examId, matchedSubject]);

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
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/practice?exam=${examId}&subject=${encodeURIComponent(matchedSubject)}`}
            className="border-2 border-black bg-white text-black px-3.5 py-1.5 font-meta text-xs hover:bg-[#FF4D00] transition-colors flex items-center gap-1.5 font-bold shadow-[2px_2px_0px_0px_#000000]"
          >
            <span>PRACTICE {matchedSubject.toUpperCase()}</span>
          </Link>
          <Link
            href={`/formulas/${examId}/${encodeURIComponent(matchedSubject.toLowerCase())}`}
            className="border-2 border-black bg-[#FF4D00] text-black px-3.5 py-1.5 font-meta text-xs hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 font-bold shadow-[2px_2px_0px_0px_#000000]"
          >
            <span>FORMULAS</span>
          </Link>
        </div>
      }
    >
      <motion.div className="space-y-6" variants={containerVariants} initial={shouldAnimate ? "hidden" : false} animate="show">
        {/* Top 2-Column Section: Topic Predictor + Gap Alerts */}
        <motion.div variants={cardVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Component 1: TopicPredictor */}
          <TopicPredictor
            predictions={predictions}
            isLoading={simulateLoading}
            isEmpty={simulateEmpty}
          />

          {/* Component 2: GapAlert */}
          <GapAlert
            alerts={gapAlerts}
            isLoading={simulateLoading}
            isEmpty={simulateEmpty}
          />
        </motion.div>

        {/* Component 3: TopicHeatmap */}
        <motion.div variants={cardVariants}>
          <TopicHeatmap
            data={heatmapData}
            isLoading={simulateLoading}
            isEmpty={simulateEmpty}
          />
        </motion.div>

        {/* Component 4: TrendChart */}
        <motion.div variants={cardVariants}>
          <TrendChart
            data={MOCK_TREND_DATA}
            topics={MOCK_TREND_TOPICS}
            isLoading={simulateLoading}
            isEmpty={simulateEmpty}
          />
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
