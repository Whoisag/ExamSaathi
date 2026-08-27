"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value = "",
  onChange,
  placeholder = "Search formula name, chapter, or keywords (e.g. de Broglie, Carnot, MOI)...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-20 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3730A3]/20 focus:border-[#3730A3] transition-all shadow-2xs"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
        {value ? (
          <button
            onClick={() => onChange?.("")}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  );
}
