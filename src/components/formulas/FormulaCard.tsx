"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMotion } from "@/hooks/useMotion";
import { FormulaItem } from "@/data/mock";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { MarkdownMath } from "@/components/ui/MarkdownMath";
import { Copy, Check, AlertCircle, Sparkles, Flame, Star, Eye, EyeOff, X, BookOpen, ArrowRight } from "lucide-react";

interface FormulaCardProps {
  formula: FormulaItem;
  isActiveRecall?: boolean;
  subjectName?: string;
  examSlug?: string;
}

export function FormulaCard({
  formula,
  isActiveRecall = false,
  subjectName = "Physics",
  examSlug = "jee-main",
}: FormulaCardProps) {
  const [copied, setCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const { shouldAnimate } = useMotion();

  const handleCopy = () => {
    navigator.clipboard.writeText(formula.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExplain = async () => {
    setIsExplaining(true);
    if (explanation) return; // already loaded

    try {
      setIsLoadingExplanation(true);
      const res = await fetch("/api/formulas-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "explain",
          formulaName: formula.name,
          formulaLatex: formula.latex,
          subject: subjectName,
          examSlug,
        }),
      });
      const data = await res.json();
      if (data.success && data.explanation) {
        setExplanation(data.explanation);
      } else {
        setExplanation("### Formula Derivation\n\nRefer to NCERT standards for step-by-step substitution.");
      }
    } catch (err) {
      console.error("AI explanation error:", err);
      setExplanation("Unable to load AI explanation. Please verify your connection.");
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const getPriorityBadge = (priority: FormulaItem["priority"]) => {
    switch (priority) {
      case "High":
        return (
          <span className="inline-flex items-center gap-1 font-meta text-[10px] font-bold px-2 py-0.5 bg-[#FF4D00] text-black border border-black shadow-[1px_1px_0px_0px_#000000] uppercase tracking-wider">
            <Flame className="w-3 h-3" />
            HIGH PRIORITY
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 font-meta text-[10px] font-bold px-2 py-0.5 bg-black text-white border border-black uppercase tracking-wider">
            <Star className="w-3 h-3 text-[#FF4D00]" />
            MEDIUM
          </span>
        );
      case "Low":
      default:
        return (
          <span className="inline-flex items-center gap-1 font-meta text-[10px] font-bold px-2 py-0.5 bg-neutral-100 text-black border border-black uppercase tracking-wider">
            STANDARD
          </span>
        );
    }
  };

  const shouldMask = isActiveRecall && !isRevealed;

  return (
    <>
      <motion.div 
        whileHover={shouldAnimate ? { y: -4, transition: { duration: 0.2, ease: 'easeOut' } } : {}} 
        style={{ willChange: 'transform' }} 
        className="bg-white border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#FF4D00] transition-all space-y-3.5 formula-card-print relative font-sans flex flex-col justify-between"
      >
        <div className="space-y-3">
          {/* Top Header: Chapter + Name + Frequency Badge + Copy */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-meta text-[10px] font-bold text-black bg-neutral-100 border border-black px-2 py-0.5">
                  {formula.chapter}
                </span>
                {getPriorityBadge(formula.priority)}
                {formula.frequencyBadge && (
                  <span className="font-meta text-[10px] text-neutral-600 font-bold border border-neutral-300 px-1.5 py-0.5 bg-neutral-50 hidden sm:inline-block">
                    {formula.frequencyBadge}
                  </span>
                )}
              </div>
              <h4 className="font-headline text-sm sm:text-base text-black leading-snug">
                {formula.name}
              </h4>
            </div>

            {/* Action Buttons: Copy LaTeX */}
            <div className="flex items-center gap-1 shrink-0 no-print">
              <button
                onClick={handleCopy}
                title="Copy LaTeX Formula"
                className="p-1.5 border border-black bg-white hover:bg-[#FF4D00] text-black transition-colors flex items-center gap-1 font-meta text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span className="text-[10px] font-bold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-black" />
                    <span className="text-[10px] font-bold hidden sm:inline">LATEX</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* KaTeX Main Formula Display */}
          <div className="bg-neutral-50 border-2 border-black p-3 sm:p-4 text-center overflow-x-auto my-2 shadow-[2px_2px_0px_0px_#000000] relative">
            {shouldMask ? (
              <div className="py-4 flex flex-col items-center justify-center gap-2">
                <div className="filter blur-md select-none opacity-40">
                  <KaTeXMath math={formula.latex} block className="text-base sm:text-lg text-black font-bold" />
                </div>
                <button
                  onClick={() => setIsRevealed(true)}
                  className="absolute inset-0 m-auto w-max h-max bg-black text-white hover:bg-[#FF4D00] hover:text-black px-4 py-2 border-2 border-black font-meta text-xs font-bold transition-all shadow-[2px_2px_0px_0px_#FF4D00] flex items-center gap-1.5 cursor-pointer z-10"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>CLICK TO REVEAL FORMULA</span>
                </button>
              </div>
            ) : (
              <div>
                <KaTeXMath math={formula.latex} block className="text-base sm:text-lg text-black font-bold" />
                {isActiveRecall && (
                  <button
                    onClick={() => setIsRevealed(false)}
                    className="mt-2 font-meta text-[10px] text-neutral-500 hover:text-black underline flex items-center gap-1 mx-auto"
                  >
                    <EyeOff className="w-3 h-3" /> Hide again
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Variables Glossary List */}
          {formula.variables && formula.variables.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="font-meta text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                // VARIABLES & CONSTANTS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-mono">
                {formula.variables.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-1.5 bg-neutral-50 px-2 py-1 border border-neutral-300 text-black text-[11px]"
                  >
                    <span className="font-bold text-[#FF4D00] shrink-0 font-headline">
                      {v.symbol}:
                    </span>
                    <span className="text-neutral-800 leading-tight">
                      <MarkdownMath content={v.meaning} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* When to Use & Common Traps */}
          <div className="space-y-2 pt-2 border-t border-neutral-200 text-xs">
            {formula.whenToUse && (
              <div className="bg-neutral-50 p-2.5 border border-neutral-200">
                <span className="font-meta text-[10px] font-bold text-black uppercase tracking-wider block mb-0.5">
                  APPLICATION CONSTRAINTS
                </span>
                <p className="text-neutral-700 leading-relaxed font-sans text-[11px]">
                  <MarkdownMath content={formula.whenToUse} />
                </p>
              </div>
            )}

            {formula.commonMistake && (
              <div className="bg-[#fff1ed] p-2.5 border border-[#FF4D00]">
                <span className="font-meta text-[10px] font-bold text-[#FF4D00] uppercase tracking-wider flex items-center gap-1 mb-0.5">
                  <AlertCircle className="w-3 h-3" />
                  COMMON EXAM TRAP / NEGATIVE MARKING
                </span>
                <p className="text-neutral-900 leading-relaxed font-sans text-[11px]">
                  <MarkdownMath content={formula.commonMistake} />
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Explainer Action Button */}
        <div className="pt-3 border-t-2 border-black flex items-center justify-between gap-2 no-print">
          <div className="flex items-center gap-1 flex-wrap">
            {formula.tags.map((tag, i) => (
              <span key={i} className="font-meta text-[9px] bg-neutral-100 px-1.5 py-0.5 text-neutral-600 border border-neutral-300">
                #{tag}
              </span>
            ))}
          </div>

          <button
            onClick={handleExplain}
            className="border-2 border-black bg-black text-white hover:bg-[#FF4D00] hover:text-black px-3 py-1 font-meta text-xs transition-colors flex items-center gap-1.5 font-bold cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
            <span>AI DERIVATION</span>
          </button>
        </div>
      </motion.div>

      {/* AI Explanation Modal / Sheet */}
      <AnimatePresence>
        {isExplaining && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.96 }} 
              transition={{ duration: 0.2 }}
              className="bg-white border-2 border-black w-full max-w-3xl max-h-[85vh] flex flex-col shadow-[8px_8px_0px_0px_#000000] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="border-b-2 border-black bg-black text-white p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF4D00]" />
                  <h3 className="font-headline text-base text-white">
                    AI DERIVATION &amp; EXAM BREAKDOWN: {formula.name.toUpperCase()}
                  </h3>
                </div>
                <button
                  onClick={() => setIsExplaining(false)}
                  className="p-1 hover:bg-neutral-800 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-4 font-sans text-sm">
                <div className="bg-neutral-50 p-4 border-2 border-black text-center">
                  <KaTeXMath math={formula.latex} block className="text-lg text-black font-bold" />
                </div>

                {isLoadingExplanation ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <Sparkles className="w-6 h-6 text-[#FF4D00] animate-spin" />
                    <p className="font-meta text-xs font-bold text-neutral-600">
                      GENERATING STEP-BY-STEP DERIVATION &amp; PRACTICE QUESTION WITH GEMINI...
                    </p>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-neutral-900 leading-relaxed font-sans">
                    <MarkdownMath content={explanation || ""} />
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t-2 border-black bg-neutral-100 p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/dashboard/practice?exam=${examSlug}&subject=${encodeURIComponent(subjectName)}&chapter=${encodeURIComponent(formula.chapter)}`}
                    className="border-2 border-black bg-[#FF4D00] text-black px-3.5 py-1.5 font-headline text-xs font-bold hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000]"
                  >
                    <span>PRACTICE CHAPTER QUESTIONS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/assistant?exam=${examSlug}&prompt=${encodeURIComponent(
                      `Please guide me step-by-step through the derivation, problem-solving techniques, and common negative marking traps for "${formula.name}" (${formula.latex}) from ${formula.chapter}.`
                    )}`}
                    className="border-2 border-black bg-white text-black px-3.5 py-1.5 font-headline text-xs font-bold hover:bg-neutral-100 transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
                    <span>DEEP DIVE IN AI TUTOR</span>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExplaining(false)}
                  className="border-2 border-black bg-black text-white px-4 py-1.5 font-headline text-xs font-bold hover:bg-[#FF4D00] hover:text-black transition-colors ml-auto cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
