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
          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-orange-100 text-[#EA580C] uppercase tracking-wider">
            <Flame className="w-3 h-3" />
            High Priority
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-[#3730A3] uppercase tracking-wider">
            <Star className="w-3 h-3" />
            Medium Priority
          </span>
        );
      case "Low":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wider">
            Standard
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-[12px] p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3.5 formula-card-print relative group">
      {/* Top Header: Chapter + Name + Frequency Badge + Copy */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[11px] font-semibold text-[#3730A3] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/60">
              {formula.chapter}
            </span>
            {getPriorityBadge(formula.priority)}
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {formula.name}
          </h4>
        </div>

        {/* Action Buttons: Copy KaTeX */}
        <div className="flex items-center gap-1 shrink-0 no-print">
          <button
            onClick={handleCopy}
            title="Copy LaTeX Formula"
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#059669]" />
                <span className="text-[11px] font-semibold text-[#059669]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] text-slate-500 hidden sm:inline">LaTeX</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KaTeX Main Formula Display */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 sm:p-4 text-center overflow-x-auto my-2">
        <KaTeXMath math={formula.latex} block className="text-base sm:text-lg text-slate-950 font-bold" />
      </div>

      {/* Variables Glossary List */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Variables & Constants
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
          {formula.variables.map((v, i) => (
            <div
              key={i}
              className="flex items-start gap-1.5 bg-slate-50/70 px-2 py-1 rounded-md border border-slate-100 text-slate-700"
            >
              <KaTeXMath math={v.symbol} className="font-bold text-[#3730A3] shrink-0" />
              <span className="text-[11px] leading-tight text-slate-600">: {v.meaning}</span>
            </div>
          ))}
        </div>
      </div>

      {/* When to Use (with Tooltip trigger) */}
      <div className="relative pt-1 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="font-bold text-[#3730A3]">When to use:</span>
            <span className="text-slate-600 line-clamp-1">{formula.whenToUse}</span>
          </div>

          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-slate-400 hover:text-[#3730A3] transition-colors shrink-0 ml-2 no-print"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hover / Click Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-20 space-y-1 border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            <p className="font-bold text-indigo-300">💡 Application Context & Constraints:</p>
            <p className="text-slate-300 leading-relaxed">{formula.whenToUse}</p>
          </div>
        )}
      </div>

      {/* Common Mistake Alert Box */}
      <div className="p-2.5 rounded-lg bg-orange-50/70 border border-orange-200/80 text-xs flex items-start gap-2 text-slate-800">
        <AlertCircle className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#EA580C] mr-1">Frequent Trap:</span>
          <span className="text-slate-700 leading-relaxed">{formula.commonMistake}</span>
        </div>
      </div>

      {/* Frequency Badge Footer */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
        <span className="font-medium text-[#059669] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
          {formula.frequencyBadge}
        </span>
        <div className="flex items-center gap-1">
          {formula.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[10px]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
