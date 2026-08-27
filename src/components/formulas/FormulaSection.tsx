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
          title: "Tier 1: High Yield & Repeat Critical",
          subtitle: "Tested in >70% of shifts; direct scoring potential with minimal derivation.",
          icon: <Flame className="w-5 h-5 text-[#EA580C]" />,
          colorClass: "text-[#EA580C]",
          bgClass: "bg-orange-50 border-orange-200",
        };
      case "Medium":
        return {
          title: "Tier 2: Medium Priority Core Concepts",
          subtitle: "Standard conceptual formulas tested in ~40-60% of question papers.",
          icon: <Star className="w-5 h-5 text-[#3730A3]" />,
          colorClass: "text-[#3730A3]",
          bgClass: "bg-indigo-50 border-indigo-200",
        };
      case "Low":
      default:
        return {
          title: "Tier 3: Supplementary & Edge Cases",
          subtitle: "Occasional appearance; useful for multi-step composite numericals.",
          icon: <Bookmark className="w-5 h-5 text-slate-500" />,
          colorClass: "text-slate-700",
          bgClass: "bg-slate-100 border-slate-200",
        };
    }
  };

  const config = getSectionHeader();

  return (
    <section className="space-y-4 pt-2">
      {/* Section Header */}
      <div className={`p-4 rounded-xl border ${config.bgClass} flex items-start justify-between gap-4`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white shadow-2xs shrink-0">{config.icon}</div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {config.title}
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-2xs border border-slate-200/60">
                {formulas.length} Formulas
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">{config.subtitle}</p>
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
