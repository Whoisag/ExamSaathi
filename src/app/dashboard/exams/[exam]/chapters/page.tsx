"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BrutalistHeader } from "@/components/layout/BrutalistHeader";
import { getMockChapters, EXAMS, ExamId, ChapterItem } from "@/data/mock";
import { Search, ArrowRight, ArrowLeft, BookOpen, Layers, Flame, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";

export default function ExamChaptersPage() {
  const params = useParams();
  const examSlug = (params?.exam as string) || "jee-main";

  const examInfo = EXAMS[examSlug as ExamId] || {
    id: examSlug,
    name: examSlug.replace(/-/g, " ").toUpperCase(),
    shortName: examSlug.toUpperCase(),
    tagline: "National Examination Track",
    badge: "Official Track",
    color: "#FF4D00",
    bgLight: "#FFF7ED",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    totalCandidates: "10+ Lakh",
    targetDate: "2026 Session",
    totalMarks: 300,
    duration: "180 mins",
    shiftsCount: "10 Shifts",
    pyqYearsRange: "2019 - 2025",
  };

  const allChapters = useMemo(() => getMockChapters(examSlug), [examSlug]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(false);

  // Available subjects for current exam
  const subjects = useMemo(() => {
    const set = new Set<string>();
    allChapters.forEach((ch) => set.add(ch.subject));
    return ["ALL", ...Array.from(set)];
  }, [allChapters]);

  const filteredChapters = useMemo(() => {
    return allChapters.filter((ch) => {
      const matchesSearch =
        ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject =
        selectedSubject === "ALL" || ch.subject.toLowerCase() === selectedSubject.toLowerCase();

      return matchesSearch && matchesSubject;
    });
  }, [allChapters, searchQuery, selectedSubject]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-[#FF4D00] selection:text-white font-sans">
      <BrutalistHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard/exams"
            className="inline-flex items-center gap-2 font-meta text-xs text-neutral-600 hover:text-[#FF4D00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ALL EXAMS</span>
          </Link>
        </div>

        {/* Exam Banner Header */}
        <div className="border-brutal bg-black text-white p-6 sm:p-10 mb-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="font-meta text-xs text-[#FF4D00] font-bold">
                // SYLLABUS DIRECTORY • {examInfo.shortName}
              </span>
              <h1 className="font-headline text-3xl sm:text-5xl text-white mt-1 mb-3">
                {examInfo.name} CHAPTER SELECTOR
              </h1>
              <p className="text-sm text-neutral-300 max-w-2xl font-medium">
                Choose a chapter to inspect granular subtopic weightages, Poisson recurrence gap anomalies, synthetic questions, and formula sheets.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 500);
                }}
                className="bg-white text-black border-2 border-white px-3.5 py-2 font-meta text-xs hover:bg-[#FF4D00] hover:text-black hover:border-[#FF4D00] transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>SKELETON</span>
              </button>
              <div className="bg-[#FF4D00] text-black px-4 py-2 border-2 border-[#FF4D00] font-meta text-xs font-bold">
                {allChapters.length} CHAPTERS
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar and Subject Pills */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH CHAPTERS, EQUATIONS, PHENOMENA..."
              className="w-full pl-11 pr-4 py-3 border-brutal bg-neutral-50 text-black font-meta text-xs placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-4 py-3 border-brutal font-meta text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedSubject === subj
                    ? "bg-[#FF4D00] text-black"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {subj.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-brutal p-6 bg-neutral-100 animate-pulse space-y-4">
                <div className="h-4 bg-neutral-300 w-1/4"></div>
                <div className="h-6 bg-neutral-300 w-3/4"></div>
                <div className="h-12 bg-neutral-200 w-full"></div>
                <div className="h-10 bg-neutral-300 w-full"></div>
              </div>
            ))
          ) : filteredChapters.length > 0 ? (
            filteredChapters.map((ch) => (
              <div
                key={ch.id}
                className="border-brutal bg-white p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-200"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between border-brutal-b pb-3 mb-4">
                    <span className="bg-black text-white font-meta text-[10px] px-2 py-0.5 font-bold">
                      {ch.subject}
                    </span>
                    <div className="flex items-center gap-1.5 font-meta text-[11px]">
                      {ch.trend === "rising" && (
                        <span className="text-[#FF4D00] font-bold flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> RISING
                        </span>
                      )}
                      {ch.trend === "falling" && (
                        <span className="text-neutral-500 font-bold flex items-center gap-0.5">
                          <TrendingDown className="w-3 h-3" /> FALLING
                        </span>
                      )}
                      {ch.trend === "stable" && (
                        <span className="text-black font-bold flex items-center gap-0.5">
                          <Minus className="w-3 h-3" /> STABLE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-headline text-xl sm:text-2xl text-black mb-2 group-hover:text-[#FF4D00] transition-colors">
                    {ch.name}
                  </h3>
                  <p className="text-xs text-neutral-600 mb-6 line-clamp-2">
                    {ch.description}
                  </p>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-3 gap-1 bg-neutral-50 p-3 border-brutal mb-6 font-meta text-center text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">WEIGHTAGE</span>
                      <span className="font-bold text-[#FF4D00]">{ch.weightagePercent}%</span>
                    </div>
                    <div className="border-x border-neutral-200">
                      <span className="text-[10px] text-neutral-500 block">PYQS</span>
                      <span className="font-bold text-black">{ch.questionCount} Qs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">FORMULAS</span>
                      <span className="font-bold text-black">{ch.formulaCount}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Link */}
                <Link
                  href={`/analyzer/${examSlug}/${ch.slug}`}
                  className="w-full bg-black text-white py-3 border-brutal font-headline text-xs hover:bg-[#FF4D00] hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                  <span>OPEN CHAPTER ANALYZER</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full border-brutal bg-neutral-50 p-12 text-center">
              <span className="font-headline text-2xl text-black block mb-2">
                NO CHAPTERS FOUND
              </span>
              <p className="font-meta text-xs text-neutral-500 mb-4">
                No chapters matching &quot;{searchQuery}&quot; in subject &quot;{selectedSubject}&quot;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("ALL");
                }}
                className="bg-black text-white px-4 py-2 border-brutal font-meta text-xs hover:bg-[#FF4D00] hover:text-black"
              >
                CLEAR FILTERS
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-brutal-t p-6 text-center font-meta text-xs text-neutral-500 mt-12">
        EXAMSAATHI CHAPTER REPOSITORY • {examInfo.name} SYLLABUS DIRECTORY
      </footer>
    </div>
  );
}
