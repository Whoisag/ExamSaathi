"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BrutalistHeader } from "@/components/layout/BrutalistHeader";
import { WeightagePieChart } from "@/components/analyzer/WeightagePieChart";
import { TrendChart } from "@/components/analyzer/TrendChart";
import { TopicPredictionList } from "@/components/analyzer/TopicPredictionList";
import { GeneratedQuestionCard } from "@/components/analyzer/GeneratedQuestionCard";
import { GapAlertCard } from "@/components/analyzer/GapAlertCard";
import { getMockAnalyzerData } from "@/data/mock";
import { ArrowLeft, ArrowRight, RefreshCw, Flame, BookOpen, Layers } from "lucide-react";

export default function ChapterAnalyzerPage() {
  const params = useParams();
  const examSlug = (params?.exam as string) || "jee-main";
  const chapterSlug = (params?.chapter as string) || "modern-physics";

  const analyzerData = useMemo(() => {
    return getMockAnalyzerData(examSlug, chapterSlug);
  }, [examSlug, chapterSlug]);

  const [isLoading, setIsLoading] = useState(false);

  const toggleSkeleton = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-[#FF4D00] selection:text-white font-sans">
      <BrutalistHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 font-meta text-xs">
            <Link
              href={`/dashboard/exams/${examSlug}/chapters`}
              className="inline-flex items-center gap-1 text-neutral-600 hover:text-[#FF4D00] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>CHAPTERS</span>
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-black font-bold uppercase">{analyzerData.chapter.name}</span>
          </div>

          <button
            onClick={toggleSkeleton}
            className="border-brutal px-3 py-1.5 font-meta text-xs hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>TEST SKELETON</span>
          </button>
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
        <div className="border-brutal bg-neutral-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-meta text-xs text-[#FF4D00] font-bold block">
              READY FOR PRACTICE?
            </span>
            <h4 className="font-headline text-xl text-black">
              EXPLORE HIGH-YIELD FORMULA CHEATSHEETS
            </h4>
          </div>

          <Link
            href={`/formulas/${examSlug}/physics`}
            className="bg-[#FF4D00] text-black px-6 py-3 border-brutal font-headline text-sm hover:bg-black hover:text-[#FF4D00] transition-colors flex items-center gap-2"
          >
            <span>FORMULA CHEATSHEET</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-brutal-t p-6 text-center font-meta text-xs text-neutral-500 mt-12">
        EXAMSAATHI CHAPTER ANALYZER ENGINE • RECHARTS & KATEX MATHEMATICAL VISUALIZATION
      </footer>
    </div>
  );
}
