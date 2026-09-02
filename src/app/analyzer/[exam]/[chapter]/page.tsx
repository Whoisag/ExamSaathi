"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { WeightagePieChart } from "@/components/analyzer/WeightagePieChart";
import { TrendChart } from "@/components/analyzer/TrendChart";
import { TopicPredictionList } from "@/components/analyzer/TopicPredictionList";
import { GapAlertCard } from "@/components/analyzer/GapAlertCard";
import { LiveGroundedBanner } from "@/components/analyzer/LiveGroundedBanner";
import { LiveAnalysisResponse } from "@/app/api/analyze-live/route";
import { getMockAnalyzerData, ChapterAnalyzerData, EXAMS, ExamId } from "@/data/mock";
import {
  ArrowRight,
  RefreshCw,
  Bot,
} from "lucide-react";

export default function ChapterAnalyzerPage() {
  const params = useParams();
  const examSlug = (params?.exam as string) || "jee-main";
  const chapterSlug = (params?.chapter as string) || "modern-physics";

  const fallbackData = useMemo(() => {
    return getMockAnalyzerData(examSlug, chapterSlug);
  }, [examSlug, chapterSlug]);

  const [analyzerData, setAnalyzerData] = useState<ChapterAnalyzerData>(fallbackData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncingLive, setIsSyncingLive] = useState(false);
  const [isLiveGrounded, setIsLiveGrounded] = useState(false);
  const [liveGroundedData, setLiveGroundedData] = useState<LiveAnalysisResponse | null>(null);

  useEffect(() => {
    setAnalyzerData(getMockAnalyzerData(examSlug, chapterSlug));
    setIsLiveGrounded(false);
    setLiveGroundedData(null);
  }, [examSlug, chapterSlug]);

  const toggleSkeleton = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleSyncLive = async () => {
    try {
      setIsSyncingLive(true);
      const res = await fetch("/api/analyze-live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examSlug,
          chapterSlug,
          chapterName: analyzerData.chapter.name,
        }),
      });
      const data: LiveAnalysisResponse = await res.json();
      if (data.success) {
        setLiveGroundedData(data);
        setIsLiveGrounded(true);

        // Calibrate local dataset with live Gemini grounding if available
        if (data.calibratedSubtopics && data.calibratedSubtopics.length > 0) {
          setAnalyzerData((prev) => ({
            ...prev,
            weightagePie: data.calibratedSubtopics || prev.weightagePie,
            topicPredictions: data.calibratedPredictions || prev.topicPredictions,
          }));
        }
      }
    } catch (err) {
      console.error("Live sync failed:", err);
    } finally {
      setIsSyncingLive(false);
    }
  };

  const handleResetBaseline = () => {
    setAnalyzerData(getMockAnalyzerData(examSlug, chapterSlug));
    setIsLiveGrounded(false);
    setLiveGroundedData(null);
  };

  const validExamId: ExamId = examSlug in EXAMS ? (examSlug as ExamId) : "jee-main";

  return (
    <AppShell
      currentExam={validExamId}
      currentSubject={analyzerData.chapter.subject}
      title={`${analyzerData.chapter.name} Analysis`}
      subtitle={analyzerData.chapter.description}
      breadcrumbs={[
        { label: "Exam Analysis", href: "/dashboard/exams" },
        { label: analyzerData.examName, href: `/dashboard/exams/${examSlug}/chapters` },
        { label: analyzerData.chapter.name },
      ]}
      hideSubjectsTab={true}
      actionSlot={
        <div className="flex items-center gap-2">
          <Link
            href={`/assistant?exam=${examSlug}&chapter=${encodeURIComponent(analyzerData.chapter.name)}`}
            className="border-2 border-black bg-black text-white hover:bg-[#FF4D00] hover:text-black px-3.5 py-1.5 font-meta text-xs transition-colors flex items-center gap-1.5 font-bold shadow-[2px_2px_0px_0px_#000000]"
          >
            <Bot className="w-3.5 h-3.5 text-[#FF4D00]" />
            <span>AI TUTOR</span>
          </Link>

          <Link
            href={`/dashboard/practice?exam=${examSlug}&subject=${encodeURIComponent(analyzerData.chapter.subject)}&chapter=${encodeURIComponent(analyzerData.chapter.name)}`}
            className="border-2 border-black bg-white text-black px-3.5 py-1.5 font-meta text-xs hover:bg-[#FF4D00] transition-colors flex items-center gap-1.5 font-bold shadow-[2px_2px_0px_0px_#000000]"
          >
            <span>PRACTICE DRILLS</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Chapter Title & Quick Metrics Banner */}
        <div className="border-2 border-black bg-black text-white p-6 sm:p-8 relative shadow-[4px_4px_0px_0px_#000000]">
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
              <h1 className="font-headline text-3xl sm:text-4xl text-white mb-2">
                {analyzerData.chapter.name}
              </h1>
              <p className="text-sm text-neutral-300 max-w-2xl font-medium leading-relaxed">
                {analyzerData.chapter.description}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 bg-neutral-900 p-4 border border-neutral-700 font-meta text-center text-xs self-start md:self-auto min-w-[240px]">
              <div>
                <span className="text-neutral-400 text-[10px] block font-bold">AVG WEIGHTAGE</span>
                <span className="font-headline text-2xl text-[#FF4D00]">
                  {analyzerData.chapter.weightagePercent}%
                </span>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] block font-bold">TOTAL PYQS</span>
                <span className="font-headline text-2xl text-white">
                  {analyzerData.chapter.questionCount} Qs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini Live Web-Grounding & Syllabus Compliance Banner */}
        <LiveGroundedBanner
          isLiveGrounded={isLiveGrounded}
          isSyncing={isSyncingLive}
          liveData={liveGroundedData}
          onSyncLive={handleSyncLive}
          onResetBaseline={handleResetBaseline}
          examName={analyzerData.examName}
          chapterName={analyzerData.chapter.name}
        />

        {/* 1 & 2. Two-Column Charts Grid (Weightage Pie + Trend Line) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeightagePieChart data={analyzerData.weightagePie} isLoading={isLoading} />
          <TrendChart data={analyzerData.trendChart} isLoading={isLoading} />
        </div>

        {/* 3. Topic Prediction List */}
        <div>
          <TopicPredictionList
            predictions={analyzerData.topicPredictions}
            isLoading={isLoading}
          />
        </div>

        {/* 4. Cyclic Recurrence Gap Alerts */}
        <div>
          <GapAlertCard
            gapAlerts={analyzerData.gapAlerts}
            isLoading={isLoading}
          />
        </div>

        {/* Bottom Formula Cheatsheet Link */}
        <div className="border-2 border-black bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_#000000]">
          <div>
            <span className="font-meta text-xs text-[#FF4D00] font-bold block">
              READY FOR PRACTICE?
            </span>
            <h4 className="font-headline text-xl text-black">
              EXPLORE HIGH-YIELD FORMULA CHEATSHEETS
            </h4>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/dashboard/practice?exam=${examSlug}&subject=${encodeURIComponent(analyzerData.chapter.subject)}&chapter=${encodeURIComponent(analyzerData.chapter.name)}`}
              className="bg-[#FF4D00] text-black px-5 py-3 border-2 border-black font-headline text-sm hover:bg-black hover:text-white transition-colors flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
            >
              <span>PRACTICE CHAPTER DRILLS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/formulas/${examSlug}/${encodeURIComponent(analyzerData.chapter.subject.toLowerCase())}`}
              className="bg-black text-white px-5 py-3 border-2 border-black font-headline text-sm hover:bg-[#FF4D00] hover:text-black transition-colors flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
            >
              <span>FORMULA CHEATSHEET</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
