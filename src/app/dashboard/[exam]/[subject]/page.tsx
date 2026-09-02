"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import { downloadStudyGuidePdf } from "@/lib/pdfGenerator";
import {
  Sparkles,
  SlidersHorizontal,
  Eye,
  RefreshCw,
  Zap,
  Flame,
  Target,
  FileText,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardSubjectPage() {
  const params = useParams();
  const router = useRouter();
  const { shouldAnimate } = useMotion();
  const rawExam = (params?.exam as string) || "jee-main";
  const rawSubject = (params?.subject as string) || "physics";

  const examId = (rawExam in EXAMS ? rawExam : "jee-main") as ExamId;
  const exam = EXAMS[examId] || EXAMS["jee-main"];

  // Normalize subject name
  const availableSubjects = exam.subjects.filter((s) => s.toLowerCase() !== "biology");
  const matchedSubject =
    availableSubjects.find((s) => s.toLowerCase() === rawSubject.toLowerCase()) ||
    availableSubjects[0] ||
    "Physics";

  const [predictions, setPredictions] = useState(MOCK_PREDICTIONS);
  const [gapAlerts, setGapAlerts] = useState(MOCK_GAP_ALERTS);

  // State toggles for testing isLoading (skeleton) and empty states
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

  const handleDownloadSubjectPdf = () => {
    toast.success(`Compiling official ${matchedSubject} revision guide...`);
    downloadStudyGuidePdf({
      title: `${matchedSubject} — ${exam.shortName} Master Study Guide`,
      subject: matchedSubject,
      exam: exam.shortName,
      chapter: matchedSubject,
    });
  };

  return (
    <AppShell
      currentExam={examId}
      currentSubject={matchedSubject}
      title={`${exam.shortName} • ${matchedSubject} Analytics`}
      subtitle="Comprehensive historical PYQ frequency trends, predictive shift weightage, and cyclic recurrence anomalies."
      breadcrumbs={[
        { label: exam.shortName, href: "/" },
        { label: matchedSubject },
      ]}
      actionSlot={
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadSubjectPdf}
            className="border-2 border-black bg-black text-[#FF4D00] px-3.5 py-1.5 font-meta text-xs hover:bg-[#FF4D00] hover:text-black transition-all flex items-center gap-1.5 font-bold shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
            title="Download chapter revision cheatsheet"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1-CLICK</span> PDF
          </button>
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
        {/* ── Interactive Kinetic Subject Switcher ────────────────────────── */}
        <div className="bg-black text-white p-1.5 border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="font-meta text-[10px] font-bold text-neutral-400 px-2 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#FF4D00]" /> SUBJECT:
            </span>
            {availableSubjects.map((s) => {
              const isSelected = s.toLowerCase() === matchedSubject.toLowerCase();
              return (
                <Link
                  key={s}
                  href={`/dashboard/${examId}/${s.toLowerCase()}`}
                  className={`px-4 py-2 text-xs font-meta font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                    isSelected
                      ? "bg-[#FF4D00] text-black shadow-[2px_2px_0px_0px_#FFFFFF]"
                      : "text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800"
                  }`}
                >
                  <span>{s}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2 pr-2 text-neutral-400 font-meta text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-ping" />
            <span className="text-[#FF4D00] font-bold">2026 SHIFT ENGINE LIVE</span>
          </div>
        </div>

        {/* ── Kinetic Intelligence Command HUD Strip (4 KPIs) ─────────────── */}
        <motion.div variants={cardVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Shift Predictability */}
          <div className="bg-white border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 transition-all space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF4D00]/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between text-xs font-meta text-neutral-500">
              <span className="font-bold text-black uppercase tracking-wider">PYQ Predictability</span>
              <Sparkles className="w-4 h-4 text-[#FF4D00]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline text-black tracking-tight">94.2%</span>
              <span className="text-xs font-meta text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 border border-emerald-500">HIGH YIELD</span>
            </div>
            <div className="w-full bg-neutral-100 border border-black h-2 overflow-hidden">
              <div className="bg-[#FF4D00] h-full w-[94.2%]" />
            </div>
            <p className="font-meta text-[10px] text-neutral-600 leading-snug">
              Top 5 recurring clusters account for ~70% marks
            </p>
          </div>

          {/* KPI 2: Verified Questions Database */}
          <div className="bg-white border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 transition-all space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs font-meta text-neutral-500">
              <span className="font-bold text-black uppercase tracking-wider">Historical PYQs</span>
              <Target className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline text-black tracking-tight">2,840+</span>
              <span className="text-xs font-meta text-neutral-600 font-bold">SHIFTS</span>
            </div>
            <div className="flex items-center gap-1.5 font-meta text-[11px] text-neutral-700">
              <span className="w-2 h-2 bg-[#FF4D00]" />
              <span>Covering 2019 – 2025 verified papers</span>
            </div>
            <p className="font-meta text-[10px] text-neutral-500 leading-snug">
              Cleaned, tagged &amp; categorized with syllabus filters
            </p>
          </div>

          {/* KPI 3: Overdue Anomalies */}
          <div className="bg-white border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 transition-all space-y-2 relative overflow-hidden group border-l-4 border-l-[#FF4D00]">
            <div className="flex items-center justify-between text-xs font-meta text-neutral-500">
              <span className="font-bold text-black uppercase tracking-wider">Cycle Gaps</span>
              <Flame className="w-4 h-4 text-[#FF4D00]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline text-[#FF4D00] tracking-tight">{gapAlerts.length} Overdue</span>
            </div>
            <div className="flex items-center gap-1.5 font-meta text-[11px] text-neutral-700">
              <span className="text-[#FF4D00] font-bold">⚡ HIGH PRIORITY</span>
              <span>Topics absent &gt;2 cycles</span>
            </div>
            <p className="font-meta text-[10px] text-neutral-500 leading-snug">
              Statistically overdue for 2026 examination shifts
            </p>
          </div>

          {/* KPI 4: Expected Score Recovery */}
          <div className="bg-black text-white border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 transition-all space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-meta text-neutral-400">
              <span className="font-bold text-[#FF4D00] uppercase tracking-wider">Score ROI Boost</span>
              <Award className="w-4 h-4 text-[#FF4D00]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline text-white tracking-tight">+28 to +44</span>
              <span className="text-xs font-meta text-[#FF4D00] font-bold">MARKS</span>
            </div>
            <p className="font-meta text-[10px] text-neutral-300 leading-snug">
              Mastering the top 3 high-yield topics guarantees maximum incremental marks.
            </p>
          </div>
        </motion.div>

        {/* ── Top 2-Column Section: Topic Predictor + Gap Alerts ────────────── */}
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

        {/* ── Component 3: TopicHeatmap ────────────────────────────────────── */}
        <motion.div variants={cardVariants}>
          <TopicHeatmap
            data={heatmapData}
            isLoading={simulateLoading}
            isEmpty={simulateEmpty}
          />
        </motion.div>

        {/* ── Component 4: TrendChart ──────────────────────────────────────── */}
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
