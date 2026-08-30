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
    <div className="bg-white border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000000] space-y-3.5 no-print font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FF4D00]" />
          <span className="font-headline text-xs font-bold text-black uppercase tracking-wider">
            SELECT CHAPTERS ({selectedChapters.length}/{chapters.length})
          </span>
        </div>

        <div className="flex items-center gap-2 font-meta text-xs">
          <button
            onClick={selectAll}
            className="text-black hover:text-[#FF4D00] font-bold transition-colors"
          >
            [SELECT ALL]
          </button>
          <span className="text-neutral-400">|</span>
          <button
            onClick={clearAll}
            className="text-neutral-600 hover:text-black transition-colors"
          >
            [CLEAR]
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
              className={`px-3 py-1.5 font-meta text-xs font-bold transition-all flex items-center gap-1.5 border-2 border-black ${
                isSelected
                  ? "bg-black text-[#FF4D00] shadow-[2px_2px_0px_0px_#FF4D00]"
                  : "bg-white text-black hover:bg-neutral-100"
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-[#FF4D00]" />}
              {ch}
            </button>
          );
        })}
      </div>

      {/* Generate Sheet Action Button */}
      <div className="pt-2 border-t-2 border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="font-meta text-[10px] text-neutral-500">
          Showing formula cards prioritized by recent NTA/CBSE frequency metrics.
        </p>
        <button
          onClick={onGenerateSheet}
          disabled={isLoading || selectedChapters.length === 0}
          className="px-4 py-2 bg-[#FF4D00] hover:bg-black hover:text-white disabled:bg-neutral-300 text-black border-2 border-black font-headline text-xs font-bold transition-all shadow-[3px_3px_0px_0px_#000000] flex items-center justify-center gap-1.5 shrink-0 active:translate-y-0.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          GENERATE SHEET ({selectedChapters.length})
        </button>
      </div>
    </div>
  );
}
