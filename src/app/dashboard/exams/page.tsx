"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ExamCard } from "@/components/exams/ExamCard";
import { MOCK_EXAMS_LIST, ExamCardItem, ExamId, EXAMS } from "@/data/mock";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";

export default function ExamsDashboardPage() {
  const [exams, setExams] = useState<ExamCardItem[]>(MOCK_EXAMS_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [currentExam, setCurrentExam] = useState<ExamId>("jee-main");

  useEffect(() => {
    try {
      const savedExam = localStorage.getItem("examsaathi_target_exam");
      if (savedExam && savedExam in EXAMS) {
        setCurrentExam(savedExam as ExamId);
      }
    } catch {}
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadExams() {
      try {
        const res = await fetch("/api/exams");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.exams) && data.exams.length > 0) {
            setExams(data.exams);
          }
        }
      } catch (err) {
        console.warn("Could not fetch /api/exams, using fallback list:", err);
      }
    }
    loadExams();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === "ENGINEERING") {
      return matchesSearch && (exam.id === "jee-main" || exam.id === "jee-advanced");
    }
    if (selectedFilter === "MEDICAL") {
      return matchesSearch && exam.id === "neet";
    }
    if (selectedFilter === "BOARDS") {
      return matchesSearch && exam.id === "cbse-12";
    }
    return matchesSearch;
  });

  return (
    <AppShell
      currentExam={currentExam}
      title="Target Exam Directory"
      subtitle="Select an exam track to view historical chapter weightages, Poisson recurrence gap alerts, and formula sheets."
      breadcrumbs={[{ label: "Exam Chapter Wise Analysis" }]}
      hideSubjectsTab={true}
      actionSlot={
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/practice?exam=${currentExam}`}
            className="border-2 border-black bg-white text-black px-3.5 py-1.5 font-meta text-xs hover:bg-[#FF4D00] transition-colors flex items-center gap-1.5 font-bold cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
          >
            <span>PRACTICE DRILLS</span>
          </Link>
          <div className="border-2 border-black bg-[#FF4D00] text-black px-3 py-1.5 font-meta text-xs font-bold shadow-[2px_2px_0px_0px_#000000]">
            {MOCK_EXAMS_LIST.length} TRACKS
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter Controls & Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH EXAM NAME, NTA, CBSE, SUBJECTS..."
              className="w-full bg-white border-2 border-black px-4 py-3 pl-11 font-meta text-xs tracking-wider text-black placeholder:text-neutral-500 focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000000]"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Quick Clear or Stats */}
          <div className="border-2 border-black bg-white p-3 flex items-center justify-between font-meta text-xs shadow-[2px_2px_0px_0px_#000000]">
            <span className="text-neutral-600 font-bold uppercase">// MATCHES:</span>
            <span className="font-bold text-black bg-[#FF4D00]/20 px-2 py-0.5 border border-black">
              {filteredExams.length} / {MOCK_EXAMS_LIST.length}
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-black p-3 border-2 border-black shadow-[3px_3px_0px_0px_#000000]">
          <span className="font-meta text-[11px] text-white px-2 py-1 flex items-center gap-1 font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF4D00]" />
            DISCIPLINE:
          </span>
          {["ALL", "ENGINEERING", "MEDICAL", "BOARDS"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 font-meta text-xs border transition-colors cursor-pointer ${
                selectedFilter === filter
                  ? "bg-[#FF4D00] text-black border-black font-bold"
                  : "bg-neutral-900 text-white border-neutral-700 hover:border-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <ExamCard key={idx} exam={MOCK_EXAMS_LIST[0]} isLoading={true} />
            ))
          ) : filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} isLoading={false} />
            ))
          ) : (
            <div className="col-span-full border-2 border-black bg-white p-12 text-center shadow-[4px_4px_0px_0px_#000000]">
              <span className="font-headline text-2xl text-black block mb-2">
                NO EXAMS FOUND
              </span>
              <p className="font-meta text-xs text-neutral-500 mb-4">
                No active exam track matches query &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("ALL");
                }}
                className="bg-black text-white px-4 py-2 border-2 border-black font-meta text-xs hover:bg-[#FF4D00] hover:text-black transition-colors"
              >
                RESET FILTERS
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
