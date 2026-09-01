"use client";

import React from "react";
import { Sparkles, Globe, ShieldCheck, CheckCircle2, RefreshCw, Layers } from "lucide-react";
import { LiveAnalysisResponse } from "@/app/api/analyze-live/route";

interface LiveGroundedBannerProps {
  isLiveGrounded: boolean;
  isSyncing: boolean;
  liveData: LiveAnalysisResponse | null;
  onSyncLive: () => void;
  onResetBaseline: () => void;
  examName: string;
  chapterName: string;
}

export function LiveGroundedBanner({
  isLiveGrounded,
  isSyncing,
  liveData,
  onSyncLive,
  onResetBaseline,
  examName,
  chapterName,
}: LiveGroundedBannerProps) {
  return (
    <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000000] relative transition-all">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 border-2 border-black ${
            isLiveGrounded ? "bg-[#FF4D00] text-black" : "bg-neutral-100 text-neutral-700"
          }`}>
            <Globe className={`w-5 h-5 ${isSyncing ? "animate-spin" : ""}`} />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-headline text-base text-black">
                {isLiveGrounded ? "LIVE WEB-GROUNDED STANDARDS ACTIVE" : "EMPIRICAL HISTORICAL DATASET ACTIVE"}
              </span>
              <span className={`font-meta text-[10px] font-bold px-2 py-0.5 border ${
                isLiveGrounded
                  ? "bg-green-100 text-green-900 border-green-700"
                  : "bg-neutral-100 text-neutral-600 border-neutral-300"
              }`}>
                {isLiveGrounded ? "● GEMINI LIVE GROUNDED" : "HISTORICAL SHIFTS (15+ YRS)"}
              </span>
            </div>
            <p className="font-meta text-xs text-neutral-600 mt-0.5">
              {isLiveGrounded
                ? `Audited against current ${examName} official blueprints & recent shifts. Timestamp: ${liveData?.liveSyncTimestamp}`
                : `Audited against 15+ years of verified shift archives. Sync with Gemini to audit current syllabus.`}
            </p>
          </div>
        </div>

        {/* Sync / Reset Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {isLiveGrounded && (
            <button
              onClick={onResetBaseline}
              disabled={isSyncing}
              className="border-2 border-neutral-300 bg-neutral-50 text-neutral-700 px-3 py-1.5 font-meta text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>BASELINE DATASET</span>
            </button>
          )}

          <button
            onClick={onSyncLive}
            disabled={isSyncing}
            className={`border-2 border-black px-4 py-1.5 font-meta text-xs transition-colors flex items-center gap-2 font-bold cursor-pointer shadow-[2px_2px_0px_0px_#000000] ${
              isSyncing
                ? "bg-neutral-200 text-neutral-600 cursor-not-allowed"
                : isLiveGrounded
                ? "bg-black text-white hover:bg-[#FF4D00] hover:text-black"
                : "bg-[#FF4D00] text-black hover:bg-black hover:text-white"
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "AUDITING WITH GEMINI..." : isLiveGrounded ? "RE-SYNC LIVE TRENDS" : "SYNC LIVE TRENDS (GEMINI)"}</span>
          </button>
        </div>
      </div>

      {/* Live Grounding Audit Details Accordion/Card */}
      {isLiveGrounded && liveData && (
        <div className="mt-4 pt-2 space-y-3">
          {/* Syllabus Compliance Alert */}
          <div className="bg-[#f0fdf4] border-2 border-green-700 p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-headline text-green-950 font-bold flex items-center gap-2">
                <span>OFFICIAL SYLLABUS COMPLIANCE AUDIT</span>
                <span className="bg-green-700 text-white px-1.5 py-0.2 font-meta text-[10px]">VERIFIED 100%</span>
              </div>
              <p className="text-green-900 font-sans leading-relaxed">
                {liveData.syllabusAudit.complianceNotice}
              </p>
              {liveData.syllabusAudit.deletedTopicsExcluded.length > 0 && (
                <div className="text-neutral-700 pt-1 font-meta text-[11px]">
                  <span className="font-bold text-red-700">🚫 Excluded Deleted Topics:</span>{" "}
                  {liveData.syllabusAudit.deletedTopicsExcluded.join(", ")}
                </div>
              )}
            </div>
          </div>

          {/* Recent Shift Trend Insights */}
          <div className="bg-neutral-50 border border-neutral-300 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-meta font-bold text-neutral-500 text-[10px] block">
                RECENT EXAM SHIFT FOCUS SUMMARY
              </span>
              <p className="text-black font-medium leading-relaxed mt-0.5">
                {liveData.recentTrendSummary}
              </p>
            </div>
            
            {/* Citations Badges */}
            <div className="flex items-center gap-1.5 flex-wrap flex-shrink-0 font-meta text-[10px]">
              {liveData.webCitations.map((cite, i) => (
                <span
                  key={i}
                  className="bg-white border border-neutral-300 text-neutral-700 px-2 py-0.5 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  {cite}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
