"use client";

import React from "react";
import { Check, Sparkles, Filter } from "lucide-react";

interface ChapterFilterProps {
  chapters: string[];
  selectedChapters: string[];
  onChange: (chapters: string[]) => void;
  onGenerateSheet?: () => void;
  isLoading?: boolean;
}

export function ChapterFilter({
  chapters,
  selectedChapters,
  onChange,
  onGenerateSheet,
  isLoading = false,
}: ChapterFilterProps) {
  const toggleChapter = (chapter: string) => {
    if (selectedChapters.includes(chapter)) {
      onChange(selectedChapters.filter((c) => c !== chapter));
    } else {
      onChange([...selectedChapters, chapter]);
    }
  };

  const selectAll = () => onChange([...chapters]);
  const clearAll = () => onChange([]);

  return (
    <div className="bg-white rounded-[12px] p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#3730A3]" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Select Chapters ({selectedChapters.length}/{chapters.length})
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={selectAll}
            className="text-[#3730A3] hover:text-[#312E81] font-semibold transition-colors"
          >
            Select All
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={clearAll}
            className="text-slate-500 hover:text-slate-800 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Chapter Chips */}
      <div className="flex flex-wrap gap-2">
        {chapters.map((ch) => {
          const isSelected = selectedChapters.includes(ch);
          return (
            <button
              key={ch}
              onClick={() => toggleChapter(ch)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? "bg-[#3730A3] border-[#3730A3] text-white shadow-2xs font-semibold"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-white" />}
              {ch}
            </button>
          );
        })}
      </div>

      {/* Generate Sheet Action Button */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <p className="text-[11px] text-slate-500">
          Showing formula cards prioritized by recent NTA/CBSE frequency metrics.
        </p>
        <button
          onClick={onGenerateSheet}
          disabled={isLoading || selectedChapters.length === 0}
          className="px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generate Sheet ({selectedChapters.length})
        </button>
      </div>
    </div>
  );
}
