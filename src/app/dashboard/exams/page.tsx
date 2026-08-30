"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrutalistHeader } from "@/components/layout/BrutalistHeader";
import { ExamCard } from "@/components/exams/ExamCard";
import { MOCK_EXAMS_LIST, ExamCardItem } from "@/data/mock";
import { Search, SlidersHorizontal, RefreshCw, Layers } from "lucide-react";

export default function ExamsDashboardPage() {
  const [exams, setExams] = useState<ExamCardItem[]>(MOCK_EXAMS_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(false);

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
    if (selectedFilter === "BOARDS") {
      return matchesSearch && exam.id === "cbse-12";
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FF4D00] text-black flex flex-col justify-between selection:bg-black selection:text-white font-sans">
      <BrutalistHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Top Breadcrumb & Metadata Banner */}
        <div className="border-brutal bg-black text-white p-6 sm:p-8 mb-8 relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="font-meta text-xs text-[#FF4D00] font-bold mb-1">
              // DASHBOARD / NATIONAL EXAMINATION REGISTRY
            </div>
            <h1 className="font-headline text-3xl sm:text-5xl text-white tracking-tight">
              TARGET EXAM DIRECTORY
            </h1>
            <p className="text-sm text-neutral-300 mt-2 max-w-2xl font-medium">
              Select an exam track to view historical chapter weightages, Poisson recurrence gap alerts, and formula sheets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 600);
              }}
              className="border-brutal bg-white text-black px-3.5 py-2 font-meta text-xs hover:bg-[#FF4D00] transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>TEST SKELETON</span>
            </button>
            <div className="border-brutal bg-[#FF4D00] text-black px-3.5 py-2 font-meta text-xs font-bold">
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
              className="w-full bg-white border-brutal px-4 py-3.5 pl-11 font-meta text-xs tracking-wider text-black placeholder:text-neutral-500 focus:outline-none focus:bg-white"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Quick Clear or Stats */}
          <div className="border-brutal bg-white p-3 flex items-center justify-between font-meta text-xs">
            <span className="text-neutral-600">FILTERED MATCHES:</span>
            <span className="font-bold text-black bg-neutral-100 px-2 py-0.5 border border-black">
              {filteredExams.length} / {MOCK_EXAMS_LIST.length}
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-black p-3 border-brutal">
          <span className="font-meta text-[11px] text-white px-2 py-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF4D00]" />
            DISCIPLINE:
          </span>
          {["ALL", "ENGINEERING", "BOARDS"].map((filter) => (
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
      <footer className="border-brutal-t bg-black text-white py-6 px-4 md:px-8 mt-12 font-meta text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>// EXAMSAATHI REGISTRY ENGINE • 2026 SHELL</div>
          <div className="text-neutral-400">
            RADICAL UNCERTAINTY HONESTY • NTA / CBSE HISTORICAL BACKTEST
          </div>
        </div>
      </footer>
    </div>
  );
}
