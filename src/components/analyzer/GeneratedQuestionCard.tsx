"use client";

import React, { useState } from "react";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { HelpCircle, CheckCircle, XCircle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface QuestionItem {
  id: string;
  title: string;
  questionLatex: string;
  options: { key: string; textLatex: string; isCorrect: boolean }[];
  solutionLatex: string;
  difficultyBadge: "Easy" | "Medium" | "Hard" | "Multi-Concept";
  expectedYear: string;
  predictedProbability: number;
  subtopic: string;
}

interface GeneratedQuestionCardProps {
  questions: QuestionItem[];
  isLoading?: boolean;
}

export function GeneratedQuestionCard({
  questions,
  isLoading = false,
}: GeneratedQuestionCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const handleSelect = (questionId: string, optionKey: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const toggleSolution = (questionId: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  if (isLoading) {
    return (
      <div className="border-brutal bg-white p-6 animate-pulse space-y-4">
        <div className="h-6 bg-neutral-300 w-1/3"></div>
        <div className="h-28 bg-neutral-100 border-2 border-neutral-200"></div>
        <div className="h-28 bg-neutral-100 border-2 border-neutral-200"></div>
      </div>
    );
  }

  return (
    <div className="border-brutal bg-white p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-brutal-b pb-3 mb-6 gap-2">
        <div>
          <span className="font-meta text-xs text-[#FF4D00] font-bold block">
            // SYNTHETIC PYQ COMPILATION
          </span>
          <h3 className="font-headline text-xl text-black">
            AI-SYNTHESIZED EXAM QUESTIONS
          </h3>
        </div>
        <span className="bg-[#FF4D00] text-black font-meta text-xs px-3 py-1 font-bold border border-black self-start sm:self-auto">
          {questions.length} SYNTHETIC DRILLS
        </span>
      </div>

      <div className="space-y-8">
        {questions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const isSolutionOpen = revealedSolutions[q.id];

          return (
            <div
              key={q.id}
              className="border-brutal bg-white p-5 sm:p-7 relative group"
            >
              {/* Card Meta Bar */}
              <div className="flex flex-wrap items-center justify-between border-brutal-b pb-3 mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white font-meta text-[11px] px-2 py-0.5 font-bold">
                    QUESTION {qIndex + 1}
                  </span>
                  <span className="font-meta text-xs text-neutral-500">
                    // {q.subtopic}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-meta text-xs">
                  <span className="border border-black px-2 py-0.5 font-bold text-black bg-neutral-100">
                    {q.expectedYear}
                  </span>
                  <span
                    className={`px-2 py-0.5 font-bold border border-black ${
                      q.difficultyBadge === "Hard" || q.difficultyBadge === "Multi-Concept"
                        ? "bg-black text-[#FF4D00]"
                        : "bg-white text-black"
                    }`}
                  >
                    {q.difficultyBadge}
                  </span>
                </div>
              </div>

              {/* Question Statement with KaTeX */}
              <div className="text-sm sm:text-base text-neutral-900 leading-relaxed font-sans mb-6">
                <KaTeXMath math={q.questionLatex} block={false} />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {q.options.map((opt) => {
                  const isSelected = selectedOption === opt.key;
                  let optionStyles = "bg-neutral-50 border-neutral-300 hover:bg-neutral-100 text-black";

                  if (isSelected) {
                    if (opt.isCorrect) {
                      optionStyles = "bg-emerald-100 border-emerald-700 text-emerald-950 font-bold";
                    } else {
                      optionStyles = "bg-red-100 border-red-700 text-red-950";
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelect(q.id, opt.key)}
                      className={`p-3.5 border-2 text-left text-xs sm:text-sm font-sans flex items-start gap-3 transition-colors cursor-pointer ${optionStyles}`}
                    >
                      <span className="w-6 h-6 border border-black bg-white font-meta text-xs flex items-center justify-center flex-shrink-0 font-bold">
                        {opt.key}
                      </span>
                      <div className="flex-1">
                        <KaTeXMath math={opt.textLatex} block={false} />
                      </div>
                      {isSelected && opt.isCorrect && (
                        <CheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                      )}
                      {isSelected && !opt.isCorrect && (
                        <XCircle className="w-5 h-5 text-red-700 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Toggle Solution Button */}
              <div className="border-brutal-t pt-4 flex items-center justify-between">
                <button
                  onClick={() => toggleSolution(q.id)}
                  className="font-meta text-xs font-bold text-black hover:text-[#FF4D00] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isSolutionOpen ? "HIDE STEP-BY-STEP DERIVATION" : "VIEW STEP-BY-STEP DERIVATION"}</span>
                  {isSolutionOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                <span className="font-meta text-[11px] text-neutral-500">
                  ACCURACY PROBABILITY: {q.predictedProbability}%
                </span>
              </div>

              {/* Solution Expansion */}
              {isSolutionOpen && (
                <div className="mt-4 p-4 bg-neutral-900 text-white border-2 border-black font-sans text-xs sm:text-sm leading-relaxed space-y-2">
                  <div className="font-meta text-xs text-[#FF4D00] font-bold uppercase mb-1">
                    [ OFFICIAL ANALYTICAL DERIVATION ]
                  </div>
                  <KaTeXMath math={q.solutionLatex} block={false} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
