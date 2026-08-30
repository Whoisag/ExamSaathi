"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BrutalistHeader } from "@/components/layout/BrutalistHeader";
import { WeightagePieChart } from "@/components/analyzer/WeightagePieChart";
import { TrendChart } from "@/components/analyzer/TrendChart";
import { TopicPredictionList } from "@/components/analyzer/TopicPredictionList";
import { GeneratedQuestionCard } from "@/components/analyzer/GeneratedQuestionCard";
import { GapAlertCard } from "@/components/analyzer/GapAlertCard";
import { CbseDataFreshnessBanner } from "@/components/analyzer/CbseDataFreshnessBanner";
import { LoginPromptModal } from "@/components/ui/LoginPromptModal";
import { MarkdownMath } from "@/components/ui/MarkdownMath";
import { getMockAnalyzerData, ChapterAnalyzerData } from "@/data/mock";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Target,
  Bot,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function ChapterAnalyzerPage() {
  const params = useParams();
  const examSlug = (params?.exam as string) || "jee-main";
  const chapterSlug = (params?.chapter as string) || "modern-physics";

  const fallbackData = useMemo(() => {
    return getMockAnalyzerData(examSlug, chapterSlug);
  }, [examSlug, chapterSlug]);

  const [analyzerData, setAnalyzerData] = useState<ChapterAnalyzerData>(fallbackData);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<string>("loading");
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Live fetch from /api/analyze and /api/generate-questions
  useEffect(() => {
    let isMounted = true;
    setIsAiLoading(true);

    async function loadLiveData() {
      try {
        // 1. Fetch analysis & AI insights
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exam: examSlug, chapter: chapterSlug }),
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.analysis) {
              setAnalyzerData((prev) => ({
                ...prev,
                weightagePie: data.analysis.pieData || prev.weightagePie,
                trendChart:
                  data.analysis.trends?.map((t: any, i: number) => ({
                    year: Number(t.year) || 2020 + i,
                    questions: Object.values(t).reduce<number>(
                      (sum: number, v: any) => (typeof v === "number" ? sum + v : sum),
                      0
                    ),
                    difficultyRating: 7.2 + i * 0.1,
                  })) || prev.trendChart,
                gapAlerts: data.analysis.gapAlerts || prev.gapAlerts,
              }));
            }
            setAiInsights(data.aiInsights || null);
            setAiSource(data.source || "deterministic");
          }
        }

        // 2. Fetch targeted questions
        const qRes = await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exam: examSlug, chapter: chapterSlug, count: 2 }),
        });

        if (qRes.ok) {
          const qData = await qRes.json();
          if (isMounted && Array.isArray(qData.questions) && qData.questions.length > 0) {
            setAnalyzerData((prev) => ({
              ...prev,
              generatedQuestions: qData.questions,
            }));
          }
        }
      } catch (err) {
        console.warn("Live fetch error, retained deterministic fallback:", err);
      } finally {
        if (isMounted) {
          setIsAiLoading(false);
        }
      }
    }

    loadLiveData();

    return () => {
      isMounted = false;
    };
  }, [examSlug, chapterSlug]);

  const toggleSkeleton = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="min-h-screen bg-[#FF4D00] text-black flex flex-col justify-between selection:bg-black selection:text-white font-sans">
      <BrutalistHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 font-meta text-xs">
            <Link
              href={`/dashboard/exams/${examSlug}/chapters`}
              className="inline-flex items-center gap-1 bg-white text-black border-brutal px-3.5 py-2 font-bold hover:bg-black hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>CHAPTERS</span>
            </Link>
            <span className="text-black font-bold">/</span>
            <span className="bg-black text-white px-3.5 py-2 font-bold uppercase border-brutal truncate max-w-[200px] sm:max-w-none">
              {analyzerData.chapter.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/assistant?exam=${examSlug}&chapter=${chapterSlug}`}
              className="border-brutal bg-black text-white hover:bg-white hover:text-black px-3.5 py-2 font-meta text-xs transition-colors flex items-center gap-1.5 font-bold"
            >
              <Bot className="w-3.5 h-3.5 text-[#FF4D00]" />
              <span>CONSULT AI</span>
            </Link>

            <Link
              href={`/dashboard/practice?exam=${examSlug}`}
              className="border-brutal bg-white text-black hover:bg-[#FF4D00] hover:text-black px-3.5 py-2 font-meta text-xs transition-colors flex items-center gap-1.5 font-bold"
            >
              <Target className="w-3.5 h-3.5 text-[#FF4D00]" />
              <span>PRACTICE</span>
            </Link>

            <button
              onClick={toggleSkeleton}
              className="border-brutal bg-white text-black px-3.5 py-2 font-meta text-xs hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>TEST SKELETON</span>
            </button>
          </div>
        </div>

        {/* Chapter Title Banner */}
        <div className="border-brutal bg-black text-white p-6 sm:p-8 mb-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#FF4D00] text-black font-meta text-xs px-2 py-0.5 font-bold">
                  {analyzerData.examName}
                </span>
                <span className="font-meta text-xs text-neutral-400">
                  // {analyzerData.chapter.subject} TRACK
                </span>
              </div>
              <h1 className="font-headline text-3xl sm:text-5xl text-white mb-3">
                {analyzerData.chapter.name}
              </h1>
              <p className="text-sm text-neutral-300 max-w-2xl font-medium leading-relaxed">
                {analyzerData.chapter.description}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 bg-neutral-900 p-4 border border-neutral-700 font-meta text-center text-xs self-start md:self-auto min-w-[240px]">
              <div>
                <span className="text-neutral-400 text-[10px] block">AVG WEIGHTAGE</span>
                <span className="font-headline text-2xl text-[#FF4D00]">
                  {analyzerData.chapter.weightagePercent}%
                </span>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] block">TOTAL PYQS</span>
                <span className="font-headline text-2xl text-white">
                  {analyzerData.chapter.questionCount} Qs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live AI Strategic Synthesis Section */}
        {aiInsights && (
          <div className="border-brutal bg-white p-6 sm:p-8 mb-8 relative">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#FF4D00] border border-black flex items-center justify-center font-bold text-black text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-headline text-lg sm:text-xl text-black">
                    AI STRATEGIC REVISION SYNTHESIS
                  </h3>
                  <span className="font-meta text-[10px] text-neutral-500 block">
                    GROUNDED IN 10-YEAR EMPIRICAL FREQUENCY MATRICES
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-black text-white px-3 py-1 font-meta text-[11px] font-bold">
                {aiSource === "live_ai" ? (
                  <>
                    <Zap className="w-3.5 h-3.5 text-[#FF4D00]" />
                    <span>LIVE AI REASONING</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D00]" />
                    <span>DETERMINISTIC ANALYSIS</span>
                  </>
                )}
              </div>
            </div>

            <MarkdownMath content={aiInsights} />
          </div>
        )}

        {/* Synthetic-Data Freshness Banner for CBSE Class 12 */}
        <CbseDataFreshnessBanner examSlug={examSlug} />

        {/* 1 & 2. Two-Column Charts Grid (Weightage Pie + Trend Line) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WeightagePieChart data={analyzerData.weightagePie} isLoading={isLoading} />
          <TrendChart data={analyzerData.trendChart} isLoading={isLoading} />
        </div>

        {/* 3. Topic Prediction List */}
        <div className="mb-8">
          <TopicPredictionList
            predictions={analyzerData.topicPredictions}
            isLoading={isLoading}
          />
        </div>

        {/* 4. Generated Question Cards */}
        <div className="mb-8">
          <GeneratedQuestionCard
            questions={analyzerData.generatedQuestions}
            isLoading={isLoading}
          />
        </div>

        {/* 5. Cyclic Recurrence Gap Alerts */}
        <div className="mb-8">
          <GapAlertCard
            gapAlerts={analyzerData.gapAlerts}
            isLoading={isLoading}
          />
        </div>

        {/* Bottom Fast Switcher */}
        <div className="border-brutal bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-meta text-xs text-[#FF4D00] font-bold block">
              READY FOR PRACTICE?
            </span>
            <h4 className="font-headline text-xl text-black">
              EXPLORE HIGH-YIELD FORMULA CHEATSHEETS
            </h4>
          </div>

          <button
            id="formula-cheatsheet-btn"
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-black text-white px-6 py-3 border-brutal font-headline text-sm hover:bg-[#FF4D00] hover:text-black transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>FORMULA CHEATSHEET</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <LoginPromptModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="PLEASE LOGIN FIRST"
        message="Please login first to view and download high-yield formula cheatsheets."
      />

      {/* Footer */}
      <footer className="border-brutal-t bg-black text-white py-6 px-4 md:px-8 mt-12 font-meta text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>// EXAMSAATHI CHAPTER ANALYZER ENGINE • 2026 SHELL</div>
          <div className="text-neutral-400">
            RECHARTS & KATEX MATHEMATICAL VISUALIZATION
          </div>
        </div>
      </footer>
    </div>
  );
}
