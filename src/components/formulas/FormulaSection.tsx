"use client";

import React from "react";
import { FormulaItem } from "@/data/mock";
import { FormulaCard } from "./FormulaCard";
import { Flame, Star, Bookmark } from "lucide-react";

interface FormulaSectionProps {
  priority: "High" | "Medium" | "Low";
  formulas: FormulaItem[];
}

export function FormulaSection({ priority, formulas }: FormulaSectionProps) {
  if (formulas.length === 0) return null;

  const getSectionHeader = () => {
    switch (priority) {
      case "High":
        return {
          title: "TIER 1: HIGH YIELD & REPEAT CRITICAL",
          subtitle: "Tested in >70% of shifts; direct scoring potential with minimal derivation.",
          icon: <Flame className="w-5 h-5 text-black" />,
          colorClass: "text-black",
          bgClass: "bg-[#FF4D00] border-2 border-black text-black shadow-[4px_4px_0px_0px_#000000]",
          badgeClass: "bg-black text-[#FF4D00]",
          subClass: "text-neutral-900",
        };
      case "Medium":
        return {
          title: "TIER 2: MEDIUM PRIORITY CORE CONCEPTS",
          subtitle: "Standard conceptual formulas tested in ~40-60% of question papers.",
          icon: <Star className="w-5 h-5 text-[#FF4D00]" />,
          colorClass: "text-white",
          bgClass: "bg-black border-2 border-black text-white shadow-[4px_4px_0px_0px_#FF4D00]",
          badgeClass: "bg-[#FF4D00] text-black",
          subClass: "text-neutral-300",
        };
      case "Low":
      default:
        return {
          title: "TIER 3: SUPPLEMENTARY & EDGE CASES",
          subtitle: "Occasional appearance; useful for multi-step composite numericals.",
          icon: <Bookmark className="w-5 h-5 text-black" />,
          colorClass: "text-black",
          bgClass: "bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_#000000]",
          badgeClass: "bg-neutral-100 text-black border border-black",
          subClass: "text-neutral-600",
        };
    }
  };

  const config = getSectionHeader();

  return (
    <section className="space-y-4 pt-2 font-sans">
      {/* Section Header */}
      <div className={`p-4 border-2 border-black ${config.bgClass} flex items-start justify-between gap-4`}>
        <div className="flex items-start gap-3">
          <div className="p-2 border border-black bg-white shadow-xs shrink-0">{config.icon}</div>
          <div>
            <h3 className="font-headline text-sm sm:text-base flex items-center gap-2 flex-wrap">
              <span>{config.title}</span>
              <span className={`font-meta text-xs font-bold px-2 py-0.5 border border-black ${config.badgeClass}`}>
                {formulas.length} FORMULAS
              </span>
            </h3>
            <p className={`font-sans text-xs mt-1 ${config.subClass}`}>{config.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Responsive Grid: 1 col mobile -> 2 col tablet -> 3 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formulas.map((f) => (
          <FormulaCard key={f.id} formula={f} />
        ))}
      </div>
    </section>
  );
}
