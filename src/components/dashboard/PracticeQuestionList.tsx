"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PracticeQuestion, getMockPracticeQuestions } from "@/data/mock";
import { QuestionCard } from "./QuestionCard";
import { SlidersHorizontal, RefreshCcw, Filter, Sparkles } from "lucide-react";

interface PracticeQuestionListProps {
  initialQuestions?: PracticeQuestion[];
  isLoading?: boolean;
}

const EMPTY_INITIAL_QUESTIONS: PracticeQuestion[] = [];

export function PracticeQuestionList({
  initialQuestions = EMPTY_INITIAL_QUESTIONS,
  isLoading = false,
}: PracticeQuestionListProps) {
  const [questions, setQuestions] = useState<PracticeQuestion[]>(() => {
    return initialQuestions.length > 0 ? initialQuestions : getMockPracticeQuestions();
  });
  const [isLoadingData, setIsLoadingData] = useState(isLoading);

  // Filter States
  const [activeSubject, setActiveSubject] = useState<"Physics" | "Chemistry" | "Mathematics">("Physics");
  const [selectedChapter, setSelectedChapter] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Fetch from /api/cbse/practice once on mount with fallback
  useEffect(() => {
    let isMounted = true;
    async function loadQuestions() {
      try {
        const res = await fetch("/api/cbse/practice");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setQuestions(data);
          }
        }
      } catch (err) {
        console.warn("API /api/cbse/practice fetch fallback to mock data:", err);
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    }

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute unique chapters for the currently selected subject
  const availableChapters = useMemo(() => {
    const subjectQuestions = questions.filter((q) => q.subject === activeSubject);
    const chapterSet = new Set<string>();
    subjectQuestions.forEach((q) => chapterSet.add(q.chapter));
    return Array.from(chapterSet);
  }, [questions, activeSubject]);

  // Filtered Questions logic
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // 1. Subject Filter
      if (q.subject !== activeSubject) return false;

      // 2. Chapter Filter
      if (selectedChapter !== "ALL" && q.chapter !== selectedChapter) return false;

      // 3. Difficulty Filter
      if (selectedDifficulty && q.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [questions, activeSubject, selectedChapter, selectedDifficulty]);

  const handleResetFilters = () => {
    setSelectedChapter("ALL");
    setSelectedDifficulty(null);
  };

  const subjectList: Array<"Physics" | "Chemistry" | "Mathematics"> = [
    "Physics",
    "Chemistry",
    "Mathematics",
  ];
  const difficultyList = ["Easy", "Medium", "Hard"];

  return (
    <div className="space-y-6">
      {/* 
        Filter controls (client-side, no API call):
        Responsive behavior:
        Filter row wraps on mobile — subject tabs on one line, chapter dropdown + difficulty pills below.
      */}
      <div className="bg-white border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000000] space-y-4">
        {/* Row 1: Subject Tabs on one line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="font-meta text-xs font-bold text-neutral-500 uppercase tracking-wider">
              SUBJECT:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {subjectList.map((subject) => {
                const isActive = activeSubject === subject;
                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => {
                      setActiveSubject(subject);
                      setSelectedChapter("ALL");
                    }}
                    className={`font-headline text-xs px-4 py-2 rounded-full border-2 border-black transition-all cursor-pointer select-none ${
                      isActive
                        ? "bg-[#FF4D00] text-black shadow-[2px_2px_0px_0px_#000000]"
                        : "bg-white text-black hover:bg-neutral-100"
                    }`}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          </div>

          <span className="font-meta text-[11px] font-bold text-black bg-neutral-100 px-3 py-1 border border-black self-start sm:self-auto">
            {filteredQuestions.length} {filteredQuestions.length === 1 ? "DRILL FOUND" : "DRILLS FOUND"}
          </span>
        </div>

        {/* Row 2: Chapter Dropdown + Difficulty Pills below */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
          {/* Chapter Selector Dropdown */}
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <label
              htmlFor="chapter-dropdown"
              className="font-meta text-xs font-bold text-neutral-500 uppercase tracking-wider shrink-0"
            >
              CHAPTER:
            </label>
            <select
              id="chapter-dropdown"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full bg-white border-2 border-black font-meta text-xs font-bold px-3 py-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D00] text-black shadow-[2px_2px_0px_0px_#000000]"
            >
              <option value="ALL">All Chapters ({availableChapters.length})</option>
              {availableChapters.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-meta text-xs font-bold text-neutral-500 uppercase tracking-wider mr-1">
              DIFFICULTY:
            </span>
            <div className="flex items-center gap-1.5">
              {difficultyList.map((diff) => {
                const isActive = selectedDifficulty?.toLowerCase() === diff.toLowerCase();
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      // Toggle difficulty on click
                      setSelectedDifficulty(isActive ? null : diff);
                    }}
                    className={`font-headline text-xs px-3.5 py-1.5 rounded-full border-2 border-black transition-all cursor-pointer select-none ${
                      isActive
                        ? "bg-[#FF4D00] text-black shadow-[2px_2px_0px_0px_#000000]"
                        : "bg-white text-black hover:bg-neutral-100"
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
              {selectedDifficulty && (
                <button
                  type="button"
                  onClick={() => setSelectedDifficulty(null)}
                  className="font-meta text-[10px] text-neutral-500 hover:text-black underline ml-1 cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoadingData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-2 border-black bg-white p-6 h-56 space-y-3 shadow-[3px_3px_0px_0px_#000000]">
              <div className="h-4 bg-neutral-200 w-1/3"></div>
              <div className="h-6 bg-neutral-300 w-3/4"></div>
              <div className="h-16 bg-neutral-100 border border-neutral-200"></div>
            </div>
          ))}
        </div>
      ) : filteredQuestions.length === 0 ? (
        /* 
          Empty state: When filters return zero results:
          - Large Archivo Black heading: "No practice questions found"
          - Below it, Inter 16px: "Try adjusting your filters or check back later."
          - Accent: a 2px solid #FF4D00 horizontal rule above the message, or a small orange geometric illustration (simple box/diamond SVG in #FF4D00).
        */
        <div className="border-2 border-black bg-white p-10 sm:p-14 text-center shadow-[4px_4px_0px_0px_#000000] flex flex-col items-center justify-center font-sans">
          {/* Accent: Geometric diamond & box illustration in #FF4D00 */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" fill="#FF4D00" stroke="#000000" strokeWidth="2" />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="12" y="2" width="14" height="14" transform="rotate(45 12 2)" fill="#FF4D00" stroke="#000000" strokeWidth="2" />
            </svg>
          </div>

          {/* Accent: 2px solid #FF4D00 horizontal rule */}
          <div className="w-24 h-[2px] bg-[#FF4D00] mb-6"></div>

          {/* Large Archivo Black heading */}
          <h3 className="font-headline text-2xl sm:text-4xl text-black tracking-tight mb-2 uppercase">
            No practice questions found
          </h3>

          {/* Inter 16px subtitle */}
          <p className="font-sans text-[16px] text-neutral-600 max-w-md leading-relaxed mb-6 font-normal">
            Try adjusting your filters or check back later.
          </p>

          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 bg-[#FF4D00] text-black border-2 border-black px-6 py-2.5 font-headline text-xs font-bold hover:bg-black hover:text-white transition-colors shadow-[3px_3px_0px_0px_#000000] active:translate-y-0.5 cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>RESET CHAPTER & DIFFICULTY FILTERS</span>
          </button>
        </div>
      ) : (
        /* 
          Question cards stack vertically, full width on mobile, 2-column grid on desktop.
        */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuestions.map((q) => (
            <QuestionCard key={q.id} question={q} showBadge={true} />
          ))}
        </div>
      )}
    </div>
  );
}
