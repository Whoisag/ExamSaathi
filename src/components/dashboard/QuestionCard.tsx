"use client";

import React, { useState } from "react";
import { PracticeQuestion } from "@/data/mock";
import { Sparkles, Bookmark, CheckCircle2, ChevronDown, ChevronUp, Tag } from "lucide-react";

interface QuestionCardProps {
  question: PracticeQuestion;
  showBadge?: boolean;
}

export function QuestionCard({ question, showBadge = true }: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Difficulty badge styling
  const difficultyStyles: Record<string, string> = {
    Easy: "bg-white text-black border-black",
    Medium: "bg-neutral-100 text-black border-black",
    Hard: "bg-black text-[#FF4D00] border-black",
  };

  return (
    <div className="relative bg-white border-2 border-black p-5 sm:p-6 shadow-[3px_3px_0px_0px_#000000] flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000000]">
      {/* 
        Badge specifications:
        Text: "AI Practice"
        Font: Space Mono, 10px, uppercase, tracking -0.02em
        Style: 2px solid #FF4D00 border, transparent background, text color #FF4D00
        Shape: pill (border-radius: 999px)
        Padding: 2px 10px
        Position: absolute, top-right of the card
      */}
      {showBadge && (
        <span
          className="absolute top-3 right-3 sm:top-4 sm:right-4 font-meta text-[10px] uppercase font-bold tracking-[-0.02em] text-[#FF4D00] border-2 border-[#FF4D00] bg-transparent rounded-full px-[10px] py-[2px] pointer-events-none select-none z-10"
          style={{ borderRadius: "999px" }}
        >
          AI Practice
        </span>
      )}

      <div>
        {/* Meta Header */}
        <div className="flex flex-wrap items-center gap-2 pr-28 pb-3 border-b-2 border-neutral-100 mb-3 font-meta text-xs">
          <span className="bg-black text-white px-2 py-0.5 font-bold uppercase text-[10px]">
            {question.subject}
          </span>
          <span className="text-neutral-500 font-bold text-[10px]">
            // {question.year}
          </span>
          <span className="bg-[#FF4D00] text-black font-bold px-2 py-0.5 text-[10px] border border-black">
            {question.marks} {question.marks === 1 ? "MARK" : "MARKS"}
          </span>
          <span
            className={`px-2 py-0.5 font-bold text-[10px] border ${
              difficultyStyles[question.difficulty] || "bg-white text-black border-black"
            }`}
          >
            {question.difficulty.toUpperCase()}
          </span>
        </div>

        {/* Chapter Title */}
        <h4 className="font-headline text-xs sm:text-sm text-neutral-800 tracking-wider uppercase mb-2">
          {question.chapter}
        </h4>

        {/* Question Text */}
        <p className="font-sans text-sm sm:text-base text-black font-medium leading-relaxed mb-4">
          {question.questionText}
        </p>

        {/* Question Type & Analyzer Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="font-meta text-[10px] bg-neutral-100 text-neutral-800 font-bold px-2 py-0.5 border border-neutral-300">
            TYPE: {question.questionType.toUpperCase()}
          </span>
          {question.analyzerTags.map((tag, idx) => (
            <span
              key={idx}
              className="font-meta text-[10px] bg-white text-neutral-600 font-semibold px-2 py-0.5 border border-neutral-300 flex items-center gap-0.5"
            >
              <Tag className="w-2.5 h-2.5 text-[#FF4D00]" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 pt-3 border-t-2 border-neutral-100 flex items-center justify-between font-meta text-xs">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-black hover:text-[#FF4D00] font-bold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>{isExpanded ? "HIDE GUIDANCE" : "VIEW FORMULA & HINTS"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setIsSaved(!isSaved)}
          className={`flex items-center gap-1 px-2.5 py-1 border border-black font-bold transition-all cursor-pointer ${
            isSaved
              ? "bg-black text-[#FF4D00]"
              : "bg-white text-black hover:bg-[#FF4D00] hover:text-black"
          }`}
          title="Save for revision sprint"
        >
          <Bookmark className="w-3 h-3" />
          <span>{isSaved ? "SAVED" : "SAVE"}</span>
        </button>
      </div>

      {/* Expandable Hints Drawer */}
      {isExpanded && (
        <div className="mt-3 p-3.5 bg-neutral-50 border-2 border-black text-xs font-sans space-y-1.5">
          <div className="font-meta text-[10px] text-[#FF4D00] font-bold uppercase tracking-wider">
            // EXAMSAATHI DRILL HINT
          </div>
          <p className="text-neutral-700 leading-relaxed font-medium">
            Ensure units are in standard SI. Identify whether symmetry allows direct Gauss flux integration or Kirchhoff mesh loop reduction before substitution.
          </p>
        </div>
      )}
    </div>
  );
}
