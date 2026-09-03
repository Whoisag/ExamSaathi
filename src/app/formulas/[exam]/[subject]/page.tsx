"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { SearchBar } from "@/components/formulas/SearchBar";
import { ChapterFilter } from "@/components/formulas/ChapterFilter";
import { FormulaSection } from "@/components/formulas/FormulaSection";
import { PrintButtons } from "@/components/formulas/PrintButtons";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { EXAMS, ExamId, FormulaItem } from "@/data/mock";
import { MASTER_FORMULA_DATABASE, MasterFormulaItem, getFormulasBySubjectAndExam } from "@/data/formulas";
import {
  Sigma,
  BookOpen,
  RefreshCw,
  Eye,
  Sparkles,
  BrainCircuit,
  Plus,
  Layers,
  Flame,
  Check,
} from "lucide-react";

const FORMULA_EXAM_TABS: { id: ExamId; shortName: string; scope: string }[] = [
  { id: "jee-main", shortName: "JEE MAIN 2026", scope: "Class 11 + 12 Complete" },
  { id: "cbse-12", shortName: "CBSE CLASS 12 BOARDS", scope: "Class 12 Only" },
];

export default function FormulasSubjectPage() {
  const params = useParams();
  const router = useRouter();
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
  const [isActiveRecall, setIsActiveRecall] = useState(false);
  const [customFormulas, setCustomFormulas] = useState<FormulaItem[]>([]);
  const [aiTopicInput, setAiTopicInput] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Load subject-specific base formulas
  const baseFormulas = useMemo(() => {
    return getFormulasBySubjectAndExam(matchedSubject, examId);
  }, [matchedSubject, examId]);

  const allAvailableFormulas = useMemo(() => {
    return [...baseFormulas, ...customFormulas];
  }, [baseFormulas, customFormulas]);

  const allChapters = useMemo(() => {
    return Array.from(new Set(allAvailableFormulas.map((f) => f.chapter)));
  }, [allAvailableFormulas]);

  const [selectedChapters, setSelectedChapters] = useState<string[]>(allChapters);
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [simulateEmpty, setSimulateEmpty] = useState(false);

  // Sync selected chapters on subject change
  useEffect(() => {
    setSelectedChapters(Array.from(new Set(baseFormulas.map((f) => f.chapter))));
    setCustomFormulas([]);
  }, [matchedSubject, baseFormulas]);

  // Filter formulas based on search and selected chapters
  const filteredFormulas = useMemo(() => {
    if (simulateEmpty) return [];

    return allAvailableFormulas.filter((formula) => {
      const matchesChapter = selectedChapters.length === 0 || selectedChapters.includes(formula.chapter);
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        formula.name.toLowerCase().includes(query) ||
        formula.chapter.toLowerCase().includes(query) ||
        formula.latex.toLowerCase().includes(query) ||
        formula.tags.some((t) => t.toLowerCase().includes(query)) ||
        (formula.variables && formula.variables.some((v) => v.meaning.toLowerCase().includes(query) || v.symbol.toLowerCase().includes(query)));

      return matchesChapter && matchesSearch;
    });
  }, [allAvailableFormulas, selectedChapters, searchQuery, simulateEmpty]);

  // Group by priority
  const highPriority = filteredFormulas.filter((f) => f.priority === "High");
  const mediumPriority = filteredFormulas.filter((f) => f.priority === "Medium");
  const lowPriority = filteredFormulas.filter((f) => f.priority === "Low" || !f.priority);

  const handleToggleLoading = () => {
    setSimulateLoading(true);
    setTimeout(() => setSimulateLoading(false), 800);
  };

  const handleGenerateCustomWithGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopicInput.trim()) return;

    try {
      setIsGeneratingAi(true);
      setAiSuccessMessage(null);

      const res = await fetch("/api/formulas-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          topic: aiTopicInput.trim(),
          subject: matchedSubject,
          examSlug: examId,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.formulas) && data.formulas.length > 0) {
        setCustomFormulas((prev) => [...data.formulas, ...prev]);
        // Also select new chapter
        const newChapters = Array.from(new Set([...selectedChapters, ...data.formulas.map((f: any) => f.chapter)]));
        setSelectedChapters(newChapters);
        setAiSuccessMessage(`Successfully curated ${data.formulas.length} high-yield formula cards for "${aiTopicInput.trim()}"!`);
        setAiTopicInput("");
      } else {
        setAiSuccessMessage(`Curated latest high-yield formulas with Gemini.`);
      }
    } catch (err) {
      console.error("AI Formula curation error:", err);
    } finally {
      setIsGeneratingAi(false);
      setTimeout(() => setAiSuccessMessage(null), 5000);
    }
  };

  return (
    <AppShell
      currentExam={examId}
      currentSubject={matchedSubject}
      title={`${exam.shortName} • ${matchedSubject} Master Formula Sheet`}
      subtitle={
        examId === "cbse-12"
          ? "Official Class 12 Board examination syllabus formulas (Class 11 excluded) with variable breakdowns & derivation steps."
          : "Complete high-yield Class 11 & 12 formulas with variable breakdowns, boundary rules, and negative-marking traps."
      }
      breadcrumbs={[
        { label: exam.shortName, href: "/" },
        { label: "Formulas", href: `/formulas/${examId}/${matchedSubject.toLowerCase()}` },
        { label: matchedSubject },
      ]}
      actionSlot={
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Recall Toggle */}
          <button
            onClick={() => setIsActiveRecall(!isActiveRecall)}
            className={`border-2 border-black px-3 py-1.5 font-meta text-xs transition-colors flex items-center gap-1.5 font-bold shadow-[2px_2px_0px_0px_#000000] cursor-pointer ${
              isActiveRecall
                ? "bg-[#FF4D00] text-black"
                : "bg-white text-black hover:bg-neutral-100"
            }`}
            title="Toggle Formula Masking for Active Recall"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>{isActiveRecall ? "ACTIVE RECALL ON" : "ACTIVE RECALL"}</span>
          </button>

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
              <p className="text-xs text-neutral-700">
                Proprietary High-Yield PYQ Formula &amp; Variable Compilation
              </p>
            </div>
            <div className="text-right text-xs text-neutral-600">
              <span>Date: {new Date().toLocaleDateString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Exam Switcher Bar (Hidden in Print) */}
        <div className="grid grid-cols-2 bg-black text-white p-1.5 border-2 border-black shadow-[4px_4px_0px_0px_#000000] no-print">
          {FORMULA_EXAM_TABS.map((tab) => {
            const isSelected = examId === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  localStorage.setItem("examsaathi_target_exam", tab.id);
                  router.push(`/formulas/${tab.id}/${matchedSubject.toLowerCase()}`);
                }}
                className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wider uppercase whitespace-nowrap transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-[#FF4D00] text-black shadow-[2px_2px_0px_0px_#FFFFFF]"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <span>{tab.shortName}</span>
                <span
                  className={`text-[9px] font-meta px-1.5 py-0.5 border hidden sm:inline-block ${
                    isSelected
                      ? "bg-black text-[#FF4D00] border-black font-bold"
                      : "bg-neutral-800 text-neutral-400 border-neutral-700"
                  }`}
                >
                  {tab.scope}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subject Quick Switcher Bar (Hidden in Print) */}
        <div className="bg-black text-white p-3 border-2 border-black flex items-center justify-between gap-3 shadow-[4px_4px_0px_0px_#000000] no-print">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="font-meta text-xs font-bold text-neutral-400 pl-2">SUBJECT TRACK:</span>
            {exam.subjects.filter((s) => s.toLowerCase() !== "biology").map((subj) => {
              const isCurrent = subj.toLowerCase() === matchedSubject.toLowerCase();
              return (
                <Link
                  key={subj}
                  href={`/formulas/${examId}/${subj.toLowerCase()}`}
                  className={`px-3 py-1 font-headline text-xs transition-colors border ${
                    isCurrent
                      ? "bg-[#FF4D00] text-black border-[#FF4D00] font-bold"
                      : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  {subj.toUpperCase()}
                </Link>
              );
            })}
          </div>

          <div className="font-meta text-xs text-[#FF4D00] font-bold pr-2 hidden sm:block">
            TOTAL: {filteredFormulas.length} FORMULAS {examId === "cbse-12" ? "(CLASS 12 ONLY)" : "(CLASS 11 + 12)"}
          </div>
        </div>

        {/* Gemini AI Formula Generator Bar (Hidden in Print) */}
        <div className="border-2 border-black bg-[#fff7ed] p-4 shadow-[4px_4px_0px_0px_#000000] no-print">
          <form onSubmit={handleGenerateCustomWithGemini} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF4D00] shrink-0" />
              <div>
                <h4 className="font-headline text-sm text-black">
                  CURATE CUSTOM FORMULAS WITH GEMINI
                </h4>
                <p className="font-meta text-[11px] text-neutral-600">
                  Type any subtopic or chapter to extract its standard formulas, boundary rules &amp; exam traps.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                value={aiTopicInput}
                onChange={(e) => setAiTopicInput(e.target.value)}
                placeholder="e.g. Lens Maker in liquids, Nernst cell, Carnot..."
                className="flex-1 px-3 py-1.5 border-2 border-black bg-white text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={isGeneratingAi || !aiTopicInput.trim()}
                className="bg-black text-white hover:bg-[#FF4D00] hover:text-black disabled:bg-neutral-400 px-3.5 py-1.5 border-2 border-black font-meta text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? "animate-spin" : ""}`} />
                <span>{isGeneratingAi ? "CURATING..." : "GENERATE"}</span>
              </button>
            </div>
          </form>

          {aiSuccessMessage && (
            <div className="mt-3 pt-2 border-t border-orange-200 text-xs font-meta text-green-800 font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-700" />
              <span>{aiSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* UI Controls: Search + Chapter Filter (Hidden in Print) */}
        <div className="space-y-4 no-print">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${matchedSubject} formulas by name, LaTeX, variables, or tags...`}
          />

          <ChapterFilter
            chapters={allChapters}
            selectedChapters={selectedChapters}
            onChange={setSelectedChapters}
            isLoading={simulateLoading}
            onGenerateSheet={() => {
              window.scrollTo({ top: 300, behavior: "smooth" });
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
            icon={<Sigma className="w-6 h-6 text-neutral-400" />}
            title="No Formulas Match Your Search"
            description="Try clearing your search query or selecting all chapters."
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
            <FormulaSection
              priority="High"
              formulas={highPriority}
              isActiveRecall={isActiveRecall}
              subjectName={matchedSubject}
              examSlug={examId}
            />
            <FormulaSection
              priority="Medium"
              formulas={mediumPriority}
              isActiveRecall={isActiveRecall}
              subjectName={matchedSubject}
              examSlug={examId}
            />
            <FormulaSection
              priority="Low"
              formulas={lowPriority}
              isActiveRecall={isActiveRecall}
              subjectName={matchedSubject}
              examSlug={examId}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
