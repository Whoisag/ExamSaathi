"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { getMockChapters, EXAMS, MOCK_EXAMS_LIST, ExamId, ChapterItem } from "@/data/mock";
import { Search, ArrowRight, ArrowLeft, Flame, RefreshCw, Clock } from "lucide-react";

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

  const [chapters, setChapters] = useState<ChapterItem[]>(() => getMockChapters(examSlug));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(false);

  // Live fetch chapters from /api/chapters
  useEffect(() => {
    let isMounted = true;
    async function loadChapters() {
      try {
        const res = await fetch(`/api/chapters?exam=${examSlug}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.chapters) && data.chapters.length > 0) {
            setChapters(data.chapters);
          }
        }
      } catch (err) {
        console.warn("Could not fetch /api/chapters, using fallback:", err);
      }
    }
    loadChapters();
    return () => {
      isMounted = false;
    };
  }, [examSlug]);

  const allChapters = chapters;

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

  const matchedExamCard = MOCK_EXAMS_LIST.find((e) => e.slug === examSlug);
  const isUpcoming = matchedExamCard?.status === "Upcoming";

  if (isUpcoming) {
    return (
      <AppShell
        currentExam={examSlug in EXAMS ? (examSlug as ExamId) : "jee-main"}
        title={matchedExamCard?.name || examInfo.name}
        subtitle="This examination track is currently in dataset ingestion and prediction model curation."
        breadcrumbs={[
          { label: "Exam Analysis", href: "/dashboard/exams" },
          { label: examInfo.shortName },
        ]}
        hideSubjectsTab={true}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="border-4 border-black bg-white p-8 sm:p-12 shadow-[8px_8px_0px_0px_#000000]">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#FF4D00] text-black font-meta text-xs px-3 py-1 font-bold border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000]">
                <Clock className="w-4 h-4 text-black animate-spin" />
                <span>IN ACTIVE DEVELOPMENT</span>
              </span>
              <span className="bg-black text-white font-meta text-xs px-3 py-1 font-bold border-2 border-black">
                // DATASET PENDING
              </span>
            </div>

            <h1 className="font-headline text-3xl sm:text-5xl text-black tracking-tight leading-[0.95] mb-4">
              {matchedExamCard?.name || examInfo.name}
            </h1>

            <div className="bg-neutral-100 border-2 border-black p-4 mb-6 text-sm font-sans font-medium text-neutral-800 leading-relaxed max-w-xl shadow-[2px_2px_0px_0px_#000000]">
              <p className="font-bold text-black mb-1">
                STATUS: COMING SOON
              </p>
              We are currently curating and verifying the past-year question dataset, LaTeX formula cheatsheets, and Poisson recurrence distribution matrix for this examination track.
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard/exams"
                className="bg-black text-white hover:bg-[#FF4D00] hover:text-black border-2 border-black font-headline text-sm py-3.5 px-6 flex items-center justify-center gap-2 transition-colors shadow-[3px_3px_0px_0px_#FF4D00]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>EXPLORE ACTIVE EXAMS</span>
              </Link>
              <Link
                href="/dashboard/exams/jee-main/chapters"
                className="bg-white text-black hover:bg-neutral-100 border-2 border-black font-headline text-sm py-3.5 px-6 flex items-center justify-center gap-2 transition-colors shadow-[3px_3px_0px_0px_#000000]"
              >
                <span>OPEN JEE MAIN TRACK</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      currentExam={examSlug in EXAMS ? (examSlug as ExamId) : "jee-main"}
      title={`${examInfo.name} Chapter Analysis`}
      subtitle="Choose a chapter to inspect granular subtopic weightages, Poisson recurrence gap anomalies, synthetic questions, and formula sheets."
      breadcrumbs={[
        { label: "Exam Analysis", href: "/dashboard/exams" },
        { label: examInfo.shortName },
      ]}
      hideSubjectsTab={true}
      actionSlot={
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }}
            className="bg-white text-black border-2 border-black px-3.5 py-1.5 font-meta text-xs hover:bg-[#FF4D00] transition-colors flex items-center gap-1.5 font-bold cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>SKELETON</span>
          </button>
          <div className="bg-[#FF4D00] text-black px-3 py-1.5 border-2 border-black font-meta text-xs font-bold shadow-[2px_2px_0px_0px_#000000]">
            {allChapters.length} CHAPTERS
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search Bar and Subject Pills */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH CHAPTERS, EQUATIONS, PHENOMENA..."
              className="w-full pl-11 pr-4 py-3 border-2 border-black bg-white text-black font-meta text-xs placeholder:text-neutral-500 focus:outline-none shadow-[2px_2px_0px_0px_#000000]"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-4 py-3 border-2 border-black font-meta text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#000000] ${
                  selectedSubject === subj
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black hover:text-white"
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
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="border-2 border-black bg-neutral-100 p-6 animate-pulse space-y-4"
              >
                <div className="h-4 bg-neutral-300 w-1/3"></div>
                <div className="h-6 bg-neutral-300 w-3/4"></div>
                <div className="h-16 bg-neutral-200 w-full"></div>
                <div className="h-10 bg-neutral-300 w-full"></div>
              </div>
            ))
          ) : filteredChapters.length > 0 ? (
            filteredChapters.map((ch) => (
              <div
                key={ch.id}
                className="border-2 border-black bg-white p-6 flex flex-col justify-between relative group hover:-translate-y-1 transition-all duration-200 shadow-[4px_4px_0px_0px_#000000]"
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between border-b-2 border-neutral-100 pb-3 mb-4">
                    <span className="font-meta text-[11px] font-bold text-[#FF4D00] uppercase">
                      // {ch.subject}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {ch.pyqFrequency === "Critical" && (
                        <span className="bg-[#FF4D00] text-black font-meta text-[10px] px-2 py-0.5 font-bold flex items-center gap-1 border border-black">
                          <Flame className="w-3 h-3" />
                          <span>CRITICAL</span>
                        </span>
                      )}
                      <span className="bg-black text-white font-meta text-[10px] px-2 py-0.5 font-bold">
                        {ch.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Chapter Name */}
                  <h3 className="font-headline text-xl text-black mb-2 group-hover:text-[#FF4D00] transition-colors line-clamp-2">
                    {ch.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 mb-6 line-clamp-2 leading-relaxed font-sans">
                    {ch.description}
                  </p>

                  {/* Chapter Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-3 border-2 border-black mb-6 font-meta text-xs">
                    <div>
                      <span className="text-neutral-500 text-[10px] block">QUESTIONS</span>
                      <span className="font-bold text-black">{ch.questionCount} Qs</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">WEIGHTAGE</span>
                      <span className="font-bold text-black">{ch.weightagePercent}%</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">FORMULAS</span>
                      <span className="font-bold text-black">{ch.formulaCount} Stored</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Link */}
                <Link
                  href={`/analyzer/${examSlug}/${ch.slug}`}
                  className="w-full bg-black text-white py-3 border-2 border-black font-headline text-xs hover:bg-[#FF4D00] hover:text-black transition-colors flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000000]"
                >
                  <span>OPEN CHAPTER ANALYZER</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full border-2 border-black bg-white p-12 text-center shadow-[4px_4px_0px_0px_#000000]">
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
                className="bg-black text-white px-4 py-2 border-2 border-black font-meta text-xs hover:bg-[#FF4D00] hover:text-black transition-colors"
              >
                CLEAR FILTERS
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
