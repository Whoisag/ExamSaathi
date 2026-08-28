"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrutalistHeader } from "@/components/layout/BrutalistHeader";
import { ExamCard } from "@/components/exams/ExamCard";
import { MOCK_EXAMS_LIST, ExamCardItem } from "@/data/mock";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";

export default function ExamsDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(false);

  const filteredExams = MOCK_EXAMS_LIST.filter((exam) => {
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
      return matchesSearch && (exam.id === "cbse-12" || exam.id === "cbse-10");
    }
    if (selectedFilter === "UNIVERSITY") {
      return matchesSearch && exam.id === "cuet";
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-[#FF4D00] selection:text-white font-sans">
      <BrutalistHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Top Breadcrumb & Metadata Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-brutal-b pb-6 mb-8 gap-4">
          <div>
            <div className="font-meta text-xs text-[#FF4D00] font-bold mb-1">
              // DASHBOARD / NATIONAL EXAMINATION REGISTRY
            </div>
            <h1 className="font-headline text-3xl sm:text-5xl text-black tracking-tight">
              TARGET EXAM DIRECTORY
            </h1>
            <p className="text-sm text-neutral-600 mt-2 max-w-2xl font-medium">
              Select an exam track to view historical chapter weightages, Poisson recurrence gap alerts, and formula sheets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 600);
              }}
              className="border-brutal px-3.5 py-2 font-meta text-xs hover:bg-black hover:text-white transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>TEST SKELETON</span>
            </button>
            <div className="border-brutal bg-black text-white px-3.5 py-2 font-meta text-xs font-bold">
              {MOCK_EXAMS_LIST.length} TRACKS LOADED
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH EXAM NAME, NTA, CBSE, SUBJECTS..."
              className="w-full pl-11 pr-4 py-3 border-brutal bg-neutral-50 text-black font-meta text-xs placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {["ALL", "ENGINEERING", "MEDICAL", "BOARDS", "UNIVERSITY"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-3 border-brutal font-meta text-xs font-bold whitespace-nowrap transition-colors flex-1 text-center ${
                  selectedFilter === cat
                    ? "bg-[#FF4D00] text-black"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Exam Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <ExamCard key={idx} exam={MOCK_EXAMS_LIST[0]} isLoading={true} />
            ))
          ) : filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} isLoading={false} />
            ))
          ) : (
            <div className="col-span-full border-brutal bg-neutral-50 p-12 text-center">
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
                className="bg-black text-white px-4 py-2 border-brutal font-meta text-xs hover:bg-[#FF4D00] hover:text-black"
              >
                RESET FILTERS
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-brutal-t p-6 text-center font-meta text-xs text-neutral-500 mt-12">
        EXAMSAATHI NATIONAL EXAM REGISTRY • 7 ACTIVE TARGET TRACKS CONFIGURED
      </footer>
    </div>
  );
}
