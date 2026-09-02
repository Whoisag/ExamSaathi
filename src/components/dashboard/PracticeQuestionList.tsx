"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PracticeQuestion, ExamId } from "@/data/mock";
import {
  CheckCircle2,
  XCircle,
  SkipForward,
  Bookmark,
  BookmarkCheck,
  Lightbulb,
  Target,
  Brain,
  BookOpen,
  RefreshCcw,
  Tag,
  Filter,
  Search,
  Timer,
  Play,
  Pause,
  Sparkles,
  Sigma,
  Layers,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

interface PracticeQuestionListProps {
  currentExam?: ExamId;
  initialSubject?: string;
  initialChapter?: string;
}

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Easy: { bg: "bg-emerald-100", text: "text-emerald-900", border: "border-emerald-500" },
  Medium: { bg: "bg-amber-100", text: "text-amber-900", border: "border-amber-500" },
  Hard: { bg: "bg-red-100", text: "text-red-900", border: "border-red-500" },
};

type AttemptStatus = "unattempted" | "correct" | "incorrect" | "skipped";
type FilterMode = "all" | "bookmarked" | "unattempted" | "incorrect";

export function PracticeQuestionList({
  currentExam = "cbse-12",
  initialSubject,
  initialChapter,
}: PracticeQuestionListProps) {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeSubject, setActiveSubject] = useState<"Physics" | "Chemistry" | "Mathematics">(() => {
    if (initialSubject) {
      const s = initialSubject.toLowerCase();
      if (s.includes("chem")) return "Chemistry";
      if (s.includes("math")) return "Mathematics";
    }
    return "Physics";
  });

  const [selectedChapter, setSelectedChapter] = useState<string>(() => initialChapter || "ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [displayCount, setDisplayCount] = useState(30);

  // Interaction States
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());
  const [selectedMcqOptions, setSelectedMcqOptions] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Persistent States
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [attemptStatus, setAttemptStatus] = useState<Record<string, AttemptStatus>>({});

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Load questions when exam changes
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/cbse/practice?exam=${currentExam}`);
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        }
      } catch (err) {
        console.warn("Failed to fetch practice questions", err);
      }
      setIsLoading(false);
    }
    load();
  }, [currentExam]);

  // Load saved bookmarks and attempts from localStorage
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem(`examsaathi_practice_saved_${currentExam}`);
      if (savedBookmarks) {
        setSavedIds(new Set(JSON.parse(savedBookmarks)));
      }
      const savedAttempts = localStorage.getItem(`examsaathi_practice_attempts_${currentExam}`);
      if (savedAttempts) {
        setAttemptStatus(JSON.parse(savedAttempts));
      }
    } catch {
      // fallback
    }
  }, [currentExam]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(30);
  }, [activeSubject, selectedChapter, selectedDifficulty, filterMode, searchQuery]);

  // Stopwatch effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const subjects: Array<"Physics" | "Chemistry" | "Mathematics"> = [
    "Physics",
    "Chemistry",
    "Mathematics",
  ];
  const difficulties = ["Easy", "Medium", "Hard"];

  // Available chapters for the selected subject
  const availableChapters = useMemo(() => {
    const filtered = questions.filter((q) => q.subject === activeSubject);
    const chapters = new Map<string, number>();
    filtered.forEach((q) => {
      chapters.set(q.chapter, (chapters.get(q.chapter) || 0) + 1);
    });
    return Array.from(chapters.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [questions, activeSubject]);

  // Filtered questions computation
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Subject Filter
      if (q.subject !== activeSubject) return false;

      // Chapter Filter
      if (selectedChapter !== "ALL" && q.chapter !== selectedChapter) return false;

      // Difficulty Filter
      if (selectedDifficulty && q.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }

      // Filter Mode (Bookmarked / Unattempted / Incorrect)
      if (filterMode === "bookmarked" && !savedIds.has(q.id)) return false;
      if (filterMode === "unattempted" && attemptStatus[q.id] && attemptStatus[q.id] !== "unattempted") {
        return false;
      }
      if (filterMode === "incorrect" && attemptStatus[q.id] !== "incorrect") return false;

      // Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const textMatch = q.questionText?.toLowerCase().includes(query);
        const chapterMatch = q.chapter?.toLowerCase().includes(query);
        const tagMatch = q.analyzerTags?.some((t) => t.toLowerCase().includes(query));
        const answerMatch = q.answer?.toLowerCase().includes(query);
        if (!textMatch && !chapterMatch && !tagMatch && !answerMatch) return false;
      }

      return true;
    });
  }, [questions, activeSubject, selectedChapter, selectedDifficulty, filterMode, searchQuery, savedIds, attemptStatus]);

  // Visible questions slice (for fast rendering)
  const visibleQuestions = useMemo(() => {
    return filteredQuestions.slice(0, displayCount);
  }, [filteredQuestions, displayCount]);

  // Subject and Session Statistics
  const subjectQuestions = questions.filter((q) => q.subject === activeSubject);
  const totalInSubject = subjectQuestions.length;
  
  const attemptedInSubject = subjectQuestions.filter(
    (q) => attemptStatus[q.id] && attemptStatus[q.id] !== "unattempted"
  ).length;

  const correctInSubject = subjectQuestions.filter(
    (q) => attemptStatus[q.id] === "correct"
  ).length;

  const incorrectInSubject = subjectQuestions.filter(
    (q) => attemptStatus[q.id] === "incorrect"
  ).length;

  const progressPct = totalInSubject > 0 ? Math.round((attemptedInSubject / totalInSubject) * 100) : 0;
  const accuracyPct = attemptedInSubject > 0 ? Math.round((correctInSubject / attemptedInSubject) * 100) : 0;

  // Handlers
  const handleAttempt = (id: string, status: AttemptStatus) => {
    setAttemptStatus((prev) => {
      const nextStatus = prev[id] === status ? "unattempted" : status;
      const updated = { ...prev, [id]: nextStatus };
      try {
        localStorage.setItem(`examsaathi_practice_attempts_${currentExam}`, JSON.stringify(updated));
      } catch {
        // fallback
      }
      return updated;
    });
  };

  const handleSelectOption = (questionId: string, optionLabel: string, correctOption?: string) => {
    setSelectedMcqOptions((prev) => ({ ...prev, [questionId]: optionLabel }));
    if (correctOption) {
      if (optionLabel === correctOption) {
        handleAttempt(questionId, "correct");
      } else {
        handleAttempt(questionId, "incorrect");
      }
    }
  };

  const handleToggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(
          `examsaathi_practice_saved_${currentExam}`,
          JSON.stringify(Array.from(next))
        );
      } catch {
        // fallback
      }
      return next;
    });
  };

  const toggleAnswer = (id: string) => {
    setRevealedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleHint = (id: string) => {
    setRevealedHints((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleResetSession = () => {
    if (confirm("Reset current subject practice attempts and timer?")) {
      setAttemptStatus({});
      setSelectedMcqOptions({});
      setRevealedAnswers(new Set());
      setRevealedHints(new Set());
      setTimerSeconds(0);
      setIsTimerRunning(false);
      try {
        localStorage.removeItem(`examsaathi_practice_attempts_${currentExam}`);
      } catch {
        // fallback
      }
    }
  };

  const getStatusBorder = (id: string) => {
    const s = attemptStatus[id];
    if (s === "correct") return "border-l-8 border-l-emerald-500 bg-emerald-50/20";
    if (s === "incorrect") return "border-l-8 border-l-red-500 bg-red-50/20";
    if (s === "skipped") return "border-l-8 border-l-amber-400 bg-amber-50/20";
    return "border-l-8 border-l-black";
  };

  return (
    <div className="space-y-4 font-sans">
      {/* TOP HEADER CONTROLS: Subject Switcher, Search & Drill Timer */}
      <div className="bg-white border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000000] space-y-4">
        {/* Row 1: Subject Selection & Timer */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b-2 border-neutral-100">
          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {subjects.map((subj) => {
              const count = questions.filter((q) => q.subject === subj).length;
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => {
                    setActiveSubject(subj);
                    setSelectedChapter("ALL");
                    setSelectedDifficulty(null);
                  }}
                  className={`font-headline text-xs px-4 py-2.5 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2 cursor-pointer select-none whitespace-nowrap ${
                    activeSubject === subj
                      ? "bg-black text-[#FF4D00]"
                      : "bg-white text-black hover:bg-neutral-100"
                  }`}
                >
                  <span>{subj.toUpperCase()}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-sm font-bold ${
                      activeSubject === subj
                        ? "bg-[#FF4D00] text-black"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Drill Stopwatch & Quick Action */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
            {/* Live Timer Widget */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border-2 border-black font-meta text-xs font-bold shadow-[2px_2px_0px_0px_#000000]">
              <Timer className="w-3.5 h-3.5 text-[#FF4D00]" />
              <span className="font-mono text-sm tracking-wider">{formatTimer(timerSeconds)}</span>
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1 hover:bg-neutral-200 rounded transition-colors cursor-pointer"
                title={isTimerRunning ? "Pause timer" : "Start timer"}
              >
                {isTimerRunning ? (
                  <Pause className="w-3.5 h-3.5 text-black" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                )}
              </button>
              {timerSeconds > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(0);
                  }}
                  className="p-1 hover:bg-neutral-200 text-neutral-500 hover:text-black rounded transition-colors cursor-pointer"
                  title="Reset timer to 00:00"
                >
                  <RefreshCcw className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Formula Sheet Link for Active Subject */}
            <Link
              href={`/formulas/${currentExam}/${activeSubject.toLowerCase()}`}
              className="font-meta text-xs font-bold px-3 py-2 bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-neutral-100 hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sigma className="w-3.5 h-3.5 text-[#FF4D00]" />
              <span>FORMULAS</span>
            </Link>

            {/* AI Assistant Sprint Link */}
            <Link
              href={`/assistant?exam=${currentExam}&prompt=${encodeURIComponent(
                `Create an intensive 30-minute practice sprint for ${activeSubject} with step-by-step guidance.`
              )}`}
              className="font-meta text-xs font-bold px-3 py-2 bg-black text-white hover:bg-[#FF4D00] hover:text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
              <span>AI DRILL SPRINT</span>
            </Link>
          </div>
        </div>

        {/* Row 2: Search Input + Difficulty Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across 3,000+ questions (e.g. Current, Molarity, Determinant, Integral, Gauss)..."
              className="w-full bg-white border-2 border-black pl-9 pr-8 py-2 font-meta text-xs font-bold text-black placeholder:text-neutral-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#FF4D00] shadow-[2px_2px_0px_0px_#000000]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Difficulty Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-meta text-[10px] font-bold text-neutral-500 uppercase tracking-wider mr-1">
              DIFFICULTY:
            </span>
            {difficulties.map((diff) => {
              const isActive = selectedDifficulty?.toLowerCase() === diff.toLowerCase();
              const s = DIFFICULTY_STYLES[diff];
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(isActive ? null : diff)}
                  className={`font-meta text-xs font-bold px-3 py-1.5 border-2 transition-all cursor-pointer select-none ${
                    isActive
                      ? `${s.bg} ${s.text} ${s.border} shadow-[2px_2px_0px_0px_#000000]`
                      : "bg-white text-neutral-600 border-neutral-300 hover:border-black hover:text-black"
                  }`}
                >
                  {diff.toUpperCase()}
                </button>
              );
            })}
            {selectedDifficulty && (
              <button
                type="button"
                onClick={() => setSelectedDifficulty(null)}
                className="font-meta text-[10px] text-neutral-400 hover:text-black underline ml-1 cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Filter Mode Chips & Session Metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-100">
          {/* Quick Filter Modes */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`font-meta text-[11px] font-bold px-2.5 py-1 border transition-all cursor-pointer ${
                filterMode === "all"
                  ? "bg-black text-white border-black"
                  : "bg-neutral-100 text-neutral-600 border-neutral-300 hover:text-black"
              }`}
            >
              ALL ({subjectQuestions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("bookmarked")}
              className={`font-meta text-[11px] font-bold px-2.5 py-1 border flex items-center gap-1 transition-all cursor-pointer ${
                filterMode === "bookmarked"
                  ? "bg-[#FF4D00] text-black border-black font-bold"
                  : "bg-neutral-100 text-neutral-600 border-neutral-300 hover:text-black"
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>SAVED ({savedIds.size})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("unattempted")}
              className={`font-meta text-[11px] font-bold px-2.5 py-1 border transition-all cursor-pointer ${
                filterMode === "unattempted"
                  ? "bg-black text-white border-black"
                  : "bg-neutral-100 text-neutral-600 border-neutral-300 hover:text-black"
              }`}
            >
              UNSOLVED ({totalInSubject - attemptedInSubject})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("incorrect")}
              className={`font-meta text-[11px] font-bold px-2.5 py-1 border transition-all cursor-pointer ${
                filterMode === "incorrect"
                  ? "bg-red-500 text-white border-black"
                  : "bg-neutral-100 text-neutral-600 border-neutral-300 hover:text-black"
              }`}
            >
              NEEDS REVIEW ({incorrectInSubject})
            </button>
          </div>

          {/* Live Session Counter */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 font-meta text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-emerald-700">{correctInSubject} CORRECT</span>
            </div>
            <div className="flex items-center gap-1.5 font-meta text-xs">
              <Target className="w-4 h-4 text-black" />
              <span className="font-bold text-black">
                {attemptedInSubject}/{totalInSubject} ({accuracyPct}% ACCURACY)
              </span>
            </div>
            {attemptedInSubject > 0 && (
              <button
                type="button"
                onClick={handleResetSession}
                className="font-meta text-[10px] font-bold px-2 py-1 bg-white hover:bg-[#FF4D00] border border-black transition-colors cursor-pointer flex items-center gap-1"
                title="Reset session attempts"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>RESET</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between font-meta text-[10px] text-neutral-500">
            <span>DRILL COMPLETION: {progressPct}%</span>
            <span>{filteredQuestions.length} DRILLS AVAILABLE</span>
          </div>
          <div className="w-full h-2 bg-neutral-100 border border-black overflow-hidden">
            <div
              className="h-full bg-[#FF4D00] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: CHAPTER SIDEBAR + QUESTION STREAM */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* LEFT CHAPTER NAVIGATION SIDEBAR */}
        <aside
          className={`${
            sidebarOpen ? "w-full lg:w-64" : "w-full lg:w-14"
          } transition-all duration-200 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] shrink-0 lg:sticky lg:top-4 flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-3.5 py-3 bg-black text-white border-b-2 border-black">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF4D00]" />
                <span className="font-meta text-xs font-bold uppercase tracking-wider text-white">
                  CHAPTERS ({availableChapters.length})
                </span>
              </div>
            ) : (
              <Layers className="w-4 h-4 text-[#FF4D00] mx-auto" />
            )}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-neutral-400 hover:text-[#FF4D00] transition-colors cursor-pointer p-1"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {sidebarOpen && (
            <div className="flex flex-col divide-y divide-neutral-100 max-h-[550px] overflow-y-auto">
              {/* All Chapters Tab */}
              <button
                type="button"
                onClick={() => {
                  setSelectedChapter("ALL");
                  setFilterMode("all");
                }}
                className={`text-left px-3.5 py-2.5 font-meta text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  selectedChapter === "ALL" && filterMode !== "bookmarked"
                    ? "bg-[#FF4D00] text-black"
                    : "bg-white text-black hover:bg-neutral-50"
                }`}
              >
                <span>ALL CHAPTERS</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 font-bold ${
                    selectedChapter === "ALL" && filterMode !== "bookmarked"
                      ? "bg-black text-[#FF4D00]"
                      : "bg-neutral-200 text-neutral-800"
                  }`}
                >
                  {totalInSubject}
                </span>
              </button>

              {/* Chapter Items */}
              {availableChapters.map(({ name, count }) => {
                const isSelected = selectedChapter === name && filterMode !== "bookmarked";
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setSelectedChapter(name);
                      if (filterMode === "bookmarked") setFilterMode("all");
                    }}
                    className={`text-left px-3.5 py-2.5 font-meta text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#FF4D00] text-black font-bold"
                        : "bg-white text-neutral-800 hover:bg-neutral-50 font-medium"
                    }`}
                  >
                    <span className="leading-snug line-clamp-2">{name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 font-bold shrink-0 ${
                        isSelected
                          ? "bg-black text-[#FF4D00]"
                          : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              {/* Bookmarked Filter Shortcut Tile */}
              {savedIds.size > 0 && (
                <div
                  onClick={() => setFilterMode("bookmarked")}
                  className={`p-3.5 border-t-2 border-black cursor-pointer transition-all ${
                    filterMode === "bookmarked"
                      ? "bg-black text-white"
                      : "bg-neutral-50 hover:bg-orange-50 text-black"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-meta text-[10px] font-bold uppercase tracking-wider text-[#FF4D00] flex items-center gap-1">
                      <Bookmark className="w-3 h-3" />
                      BOOKMARKED
                    </span>
                    <span className="font-headline text-lg text-black bg-white px-2 py-0.2 border border-black">
                      {savedIds.size}
                    </span>
                  </div>
                  <p className="font-meta text-[10px] text-neutral-500 mt-1">
                    Click to view your saved revision set
                  </p>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* RIGHT QUESTIONS STREAM */}
        <div className="flex-1 min-w-0 space-y-4 w-full">
          {isLoading ? (
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-10 sm:p-14 text-center flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="font-meta text-xs font-bold uppercase">Loading Question Bank (3,000+ Drills)...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-10 sm:p-14 text-center flex flex-col items-center justify-center gap-4">
              <BookOpen className="w-12 h-12 text-neutral-300" />
              <div className="space-y-1">
                <h3 className="font-headline text-xl text-black uppercase tracking-tight">
                  No practice questions match your filter
                </h3>
                <p className="font-sans text-sm text-neutral-500 max-w-md">
                  Try clearing your search query or selecting a different chapter from the sidebar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedChapter("ALL");
                  setSelectedDifficulty(null);
                  setSearchQuery("");
                  setFilterMode("all");
                }}
                className="font-meta text-xs font-bold px-5 py-2.5 bg-[#FF4D00] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>RESET ALL FILTERS</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleQuestions.map((q, index) => {
                const status = attemptStatus[q.id] || "unattempted";
                const isSaved = savedIds.has(q.id);
                const isAnswerOpen = revealedAnswers.has(q.id);
                const isHintOpen = revealedHints.has(q.id);
                const selectedOption = selectedMcqOptions[q.id];
                const diffStyle = DIFFICULTY_STYLES[q.difficulty] || DIFFICULTY_STYLES.Medium;

                return (
                  <div
                    key={q.id}
                    className={`bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] transition-all relative ${getStatusBorder(
                      q.id
                    )}`}
                  >
                    {/* Card Header Strip */}
                    <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Question Index Badge */}
                        <span className="font-meta text-xs font-bold bg-black text-[#FF4D00] px-2.5 py-0.5">
                          Q{index + 1}
                        </span>
                        {/* Subject Badge */}
                        <span className="font-meta text-xs font-bold bg-white text-black border border-black px-2 py-0.5">
                          {q.subject}
                        </span>
                        {/* Chapter Name */}
                        <span className="font-meta text-xs text-neutral-700 font-bold">
                          {q.chapter}
                        </span>
                        {/* PYQ Year */}
                        <span className="font-meta text-[11px] text-neutral-400 font-mono">
                          // {q.year}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Difficulty Badge */}
                        <span
                          className={`font-meta text-[10px] font-bold px-2 py-0.5 border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}
                        >
                          {q.difficulty.toUpperCase()}
                        </span>

                        {/* Marks Badge */}
                        <span className="font-meta text-[10px] font-bold bg-[#FF4D00] text-black border border-black px-2 py-0.5">
                          {q.marks} {q.marks === 1 ? "MARK" : "MARKS"}
                        </span>

                        {/* Live Attempt Status Badge */}
                        {status === "correct" && (
                          <span className="font-meta text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> CORRECT
                          </span>
                        )}
                        {status === "incorrect" && (
                          <span className="font-meta text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> WRONG
                          </span>
                        )}
                        {status === "skipped" && (
                          <span className="font-meta text-[10px] font-bold bg-amber-400 text-black px-2 py-0.5 flex items-center gap-1">
                            <SkipForward className="w-3 h-3" /> SKIPPED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 sm:p-5 space-y-4">
                      {/* Tags & Question Type */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-meta text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-300 px-2 py-0.5 uppercase">
                          TYPE: {q.questionType}
                        </span>
                        {q.analyzerTags?.map((tag) => (
                          <span
                            key={tag}
                            className="font-meta text-[10px] bg-white text-neutral-600 font-semibold px-2 py-0.5 border border-neutral-200 flex items-center gap-1"
                          >
                            <Tag className="w-2.5 h-2.5 text-[#FF4D00]" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Question Text */}
                      <p className="font-sans text-sm sm:text-base text-black font-medium leading-relaxed">
                        {q.questionText}
                      </p>

                      {/* Interactive MCQ Options (if available) */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt) => {
                            const isChosen = selectedOption === opt.label;
                            const isCorrect = q.correctOption === opt.label;
                            let btnStyle = "bg-white text-black border-black hover:bg-neutral-50";

                            if (selectedOption) {
                              if (isCorrect) {
                                btnStyle = "bg-emerald-100 text-emerald-900 border-emerald-600 font-bold";
                              } else if (isChosen && !isCorrect) {
                                btnStyle = "bg-red-100 text-red-900 border-red-500 font-bold";
                              }
                            }

                            return (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => handleSelectOption(q.id, opt.label, q.correctOption)}
                                className={`text-left p-2.5 border-2 font-meta text-xs flex items-center gap-2.5 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none ${btnStyle}`}
                              >
                                <span className="w-6 h-6 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center shrink-0">
                                  {opt.label}
                                </span>
                                <span className="font-sans text-xs sm:text-sm">{opt.text}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Expandable Hint Section */}
                      {isHintOpen && q.hint && (
                        <div className="bg-amber-50 border-2 border-amber-400 p-3.5 space-y-1">
                          <div className="font-meta text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                            <span>EXAMSAATHI DRILL HINT</span>
                          </div>
                          <p className="font-sans text-xs sm:text-sm text-amber-950 leading-relaxed">
                            {q.hint}
                          </p>
                        </div>
                      )}

                      {/* Expandable Model Answer & Step-by-Step Guidance */}
                      {isAnswerOpen && q.answer && (
                        <div className="bg-emerald-50 border-2 border-emerald-600 p-4 space-y-2">
                          <div className="font-meta text-[11px] font-bold text-emerald-900 uppercase flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>OFFICIAL MODEL ANSWER & STEP-BY-STEP SOLUTION</span>
                          </div>
                          <p className="font-sans text-xs sm:text-sm text-emerald-950 leading-relaxed whitespace-pre-line font-normal">
                            {q.answer}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="border-t-2 border-neutral-100 px-4 py-3 bg-neutral-50 flex flex-wrap items-center justify-between gap-2">
                      {/* Left: Attempt Status Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleAttempt(q.id, "correct")}
                          className={`font-meta text-xs font-bold px-3 py-1.5 border-2 flex items-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none ${
                            status === "correct"
                              ? "bg-emerald-600 text-white border-emerald-700"
                              : "bg-white text-emerald-800 border-emerald-500 hover:bg-emerald-50"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>GOT IT</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAttempt(q.id, "incorrect")}
                          className={`font-meta text-xs font-bold px-3 py-1.5 border-2 flex items-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none ${
                            status === "incorrect"
                              ? "bg-red-600 text-white border-red-700"
                              : "bg-white text-red-700 border-red-400 hover:bg-red-50"
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>WRONG</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAttempt(q.id, "skipped")}
                          className={`font-meta text-xs font-bold px-3 py-1.5 border-2 flex items-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none ${
                            status === "skipped"
                              ? "bg-amber-400 text-black border-amber-500 font-bold"
                              : "bg-white text-neutral-600 border-neutral-300 hover:bg-amber-50 hover:text-black"
                          }`}
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                          <span>SKIP</span>
                        </button>
                      </div>

                      {/* Right: Hint, Answer, AI Tutor, and Bookmark */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {q.hint && (
                          <button
                            type="button"
                            onClick={() => toggleHint(q.id)}
                            className={`font-meta text-xs font-bold px-3 py-1.5 border-2 flex items-center gap-1 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none ${
                              isHintOpen
                                ? "bg-amber-200 text-amber-900 border-amber-500"
                                : "bg-white text-neutral-700 border-neutral-300 hover:border-amber-400 hover:text-amber-800"
                            }`}
                          >
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                            <span>{isHintOpen ? "HIDE HINT" : "HINT"}</span>
                          </button>
                        )}

                        {q.answer && (
                          <button
                            type="button"
                            onClick={() => toggleAnswer(q.id)}
                            className={`font-meta text-xs font-bold px-3 py-1.5 border-2 flex items-center gap-1 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none ${
                              isAnswerOpen
                                ? "bg-emerald-600 text-white border-emerald-700"
                                : "bg-white text-neutral-800 border-neutral-300 hover:border-emerald-600 hover:text-emerald-800"
                            }`}
                          >
                            <Brain className="w-3.5 h-3.5" />
                            <span>{isAnswerOpen ? "HIDE ANSWER" : "VIEW ANSWER"}</span>
                          </button>
                        )}

                        {/* Ask AI Tutor Button */}
                        <Link
                          href={`/assistant?exam=${currentExam}&prompt=${encodeURIComponent(
                            `Please guide me step-by-step through this ${q.subject} (${q.chapter}) exam question:\n\n"${q.questionText}"\n\nExplain the underlying physics/chemistry/math concepts, relevant formulas, and step-by-step solution derivation.`
                          )}`}
                          className="font-meta text-xs font-bold px-3 py-1.5 bg-white hover:bg-neutral-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1"
                          title="Open AI Strategy Tutor for this question"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
                          <span>AI TUTOR</span>
                        </Link>

                        {/* Bookmark Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleSaved(q.id)}
                          className={`font-meta text-xs font-bold px-3 py-1.5 border-2 flex items-center gap-1 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000] hover:translate-y-[1px] hover:shadow-none ${
                            isSaved
                              ? "bg-black text-[#FF4D00] border-black"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-black hover:text-black"
                          }`}
                          title={isSaved ? "Remove from bookmarks" : "Save for revision"}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-3.5 h-3.5 text-[#FF4D00]" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5 text-neutral-500" />
                          )}
                          <span>{isSaved ? "SAVED" : "SAVE"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Load More Button */}
              {visibleQuestions.length < filteredQuestions.length && (
                <div className="text-center pt-2 pb-6">
                  <button
                    type="button"
                    onClick={() => setDisplayCount((prev) => prev + 50)}
                    className="font-meta text-xs font-bold px-6 py-3 bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-[#FF4D00] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>LOAD MORE QUESTIONS ({filteredQuestions.length - visibleQuestions.length} REMAINING)</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
