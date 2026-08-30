"use client";

import React, { useState } from "react";
import { FormulaItem } from "@/data/mock";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { Copy, Check, AlertCircle, HelpCircle, Flame, Star } from "lucide-react";

interface FormulaCardProps {
  formula: FormulaItem;
}

export function FormulaCard({ formula }: FormulaCardProps) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(formula.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="bg-white border-2 border-black p-4 sm:p-5 shadow-[3px_3px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#FF4D00] transition-all space-y-3.5 formula-card-print relative font-sans">
      {/* Top Header: Chapter + Name + Frequency Badge + Copy */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-meta text-[10px] font-bold text-black bg-neutral-100 border border-black px-2 py-0.5">
              {formula.chapter}
            </span>
            {getPriorityBadge(formula.priority)}
          </div>
          <h4 className="font-headline text-sm sm:text-base text-black leading-snug">
            {formula.name}
          </h4>
        </div>

        {/* Action Buttons: Copy KaTeX */}
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
      <div className="bg-neutral-50 border-2 border-black p-3 sm:p-4 text-center overflow-x-auto my-2 shadow-[2px_2px_0px_0px_#000000]">
        <KaTeXMath math={formula.latex} block className="text-base sm:text-lg text-black font-bold" />
      </div>

      {/* Variables Glossary List */}
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
              <KaTeXMath math={v.symbol} className="font-bold text-[#FF4D00] shrink-0" />
              <span className="leading-tight text-neutral-700">: {v.meaning}</span>
            </div>
          ))}
        </div>
      </div>

      {/* When to Use (with Tooltip trigger) */}
      <div className="relative pt-1 border-t border-neutral-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-black">
            <span className="font-bold font-meta text-[11px] text-[#FF4D00]">WHEN TO USE:</span>
            <span className="text-neutral-700 font-sans text-xs line-clamp-1">{formula.whenToUse}</span>
          </div>

          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-neutral-500 hover:text-black transition-colors shrink-0 ml-2 no-print"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hover / Click Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-black text-white text-xs border-2 border-black shadow-[3px_3px_0px_0px_#FF4D00] z-20 space-y-1 font-mono">
            <p className="font-bold text-[#FF4D00]">// APPLICATION CONTEXT & CONSTRAINTS:</p>
            <p className="text-neutral-200 leading-relaxed font-sans">{formula.whenToUse}</p>
          </div>
        )}
      </div>

      {/* Common Mistake Alert Box */}
      <div className="p-2.5 border-2 border-black bg-orange-50 text-xs flex items-start gap-2 text-black">
        <AlertCircle className="w-4 h-4 text-[#FF4D00] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-black font-meta text-[10px] mr-1">[FREQUENT TRAP]:</span>
          <span className="text-neutral-800 leading-relaxed font-sans">{formula.commonMistake}</span>
        </div>
      </div>

      {/* Frequency Badge Footer */}
      <div className="flex items-center justify-between pt-1 font-meta text-[10px]">
        <span className="font-bold text-black flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#FF4D00] inline-block"></span>
          {formula.frequencyBadge}
        </span>
        <div className="flex items-center gap-1 flex-wrap">
          {formula.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 border border-black bg-neutral-100 text-black font-mono text-[9px] font-bold"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
