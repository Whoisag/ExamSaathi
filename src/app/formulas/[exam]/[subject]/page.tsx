"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { SearchBar } from "@/components/formulas/SearchBar";
import { ChapterFilter } from "@/components/formulas/ChapterFilter";
import { FormulaSection } from "@/components/formulas/FormulaSection";
import { PrintButtons } from "@/components/formulas/PrintButtons";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { EXAMS, ExamId, MOCK_FORMULAS, FormulaItem } from "@/data/mock";
import { Sigma, BookOpen, RefreshCw, Eye } from "lucide-react";

export default function FormulasSubjectPage() {
  const params = useParams();
  const rawExam = (params?.exam as string) || "jee-main";
  const rawSubject = (params?.subject as string) || "physics";

  const examId = (rawExam in EXAMS ? rawExam : "jee-main") as ExamId;
  const exam = EXAMS[examId] || EXAMS["jee-main"];

  const matchedSubject =
    exam.subjects.find((s) => s.toLowerCase() === rawSubject.toLowerCase()) ||
    exam.subjects[0] ||
    "Physics";

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const allChapters = useMemo(
    () => Array.from(new Set(MOCK_FORMULAS.map((f) => f.chapter))),
    []
  );
  const [selectedChapters, setSelectedChapters] = useState<string[]>(allChapters);
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [simulateEmpty, setSimulateEmpty] = useState(false);

  // Filter formulas based on search and selected chapters
  const filteredFormulas = useMemo(() => {
    if (simulateEmpty) return [];

    return MOCK_FORMULAS.filter((formula) => {
      const matchesChapter = selectedChapters.includes(formula.chapter);
      const matchesSearch =
        searchQuery.trim() === "" ||
        formula.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formula.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formula.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesChapter && matchesSearch;
    });
  }, [selectedChapters, searchQuery, simulateEmpty]);

  // Group by priority
  const highPriority = filteredFormulas.filter((f) => f.priority === "High");
  const mediumPriority = filteredFormulas.filter((f) => f.priority === "Medium");
  const lowPriority = filteredFormulas.filter((f) => f.priority === "Low");

  const handleToggleLoading = () => {
    setSimulateLoading(true);
    setTimeout(() => setSimulateLoading(false), 1000);
  };

  return (
    <AppShell
      currentExam={examId}
      currentSubject={matchedSubject}
      title={`${exam.shortName} • ${matchedSubject} Formula Sheet`}
      subtitle="High-yield formulas with variable breakdowns, application constraints, and common student traps."
      breadcrumbs={[
        { label: exam.shortName, href: "/" },
        { label: "Formulas", href: `/formulas/${examId}/${matchedSubject.toLowerCase()}` },
        { label: matchedSubject },
      ]}
      actionSlot={
        <div className="flex items-center gap-3">
          {/* State Test Switches */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs no-print">
            <button
              onClick={handleToggleLoading}
              disabled={simulateLoading}
              className="px-2.5 py-1 rounded-lg text-slate-700 hover:bg-white transition-all font-medium flex items-center gap-1"
              title="Test Loading State"
            >
              <RefreshCw className={`w-3 h-3 text-[#3730A3] ${simulateLoading ? "animate-spin" : ""}`} />
              <span>Skeleton</span>
            </button>
            <button
              onClick={() => setSimulateEmpty(!simulateEmpty)}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1 ${
                simulateEmpty
                  ? "bg-[#EA580C] text-white font-bold"
                  : "text-slate-700 hover:bg-white"
              }`}
              title="Test Empty State"
            >
              <Eye className="w-3 h-3" />
              <span>Empty</span>
            </button>
          </div>

          {/* Download PDF & Print Buttons */}
          <PrintButtons examName={exam.shortName} subjectName={matchedSubject} />
        </div>
      }
    >
      <div className="space-y-6 formula-sheet-container">
        {/* Printable Header - Visible ONLY in Print */}
        <div className="hidden print-only mb-6 pb-4 border-b border-black">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-black">
                ExamSaathi — {exam.name} {matchedSubject} Revision Sheet
              </h1>
              <p className="text-xs text-slate-700">
                Proprietary NTA & CBSE High-Yield PYQ Formula Compilation
              </p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <span>Date Generated: {new Date().toLocaleDateString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* UI Controls: Search + Chapter Filter (Hidden in Print) */}
        <div className="space-y-4 no-print">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${matchedSubject} formulas, chapters, or variables...`}
          />

          <ChapterFilter
            chapters={allChapters}
            selectedChapters={selectedChapters}
            onChange={setSelectedChapters}
            isLoading={simulateLoading}
            onGenerateSheet={() => {
              // Smooth scroll to top of formulas
              window.scrollTo({ top: 200, behavior: "smooth" });
            }}
          />
        </div>

        {/* Loading State */}
        {simulateLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}

        {/* Empty State */}
        {!simulateLoading && filteredFormulas.length === 0 && (
          <EmptyState
            icon={<Sigma className="w-6 h-6 text-slate-400" />}
            title="No Formulas Match Your Criteria"
            description="Try expanding your chapter selection or clearing your search term to see formula cards."
            actionText="Reset Filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedChapters(allChapters);
              setSimulateEmpty(false);
            }}
          />
        )}

        {/* Priority Sections */}
        {!simulateLoading && filteredFormulas.length > 0 && (
          <div className="space-y-8">
            <FormulaSection priority="High" formulas={highPriority} />
            <FormulaSection priority="Medium" formulas={mediumPriority} />
            <FormulaSection priority="Low" formulas={lowPriority} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
