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
    <div className="relative w-full font-sans">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-20 py-2.5 bg-white border-2 border-black font-sans text-sm text-black placeholder:text-neutral-500 focus:outline-none focus:border-black focus:ring-0 shadow-[2px_2px_0px_0px_#000000] transition-all"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
        {value ? (
          <button
            onClick={() => onChange?.("")}
            className="p-1 border border-black bg-neutral-100 hover:bg-[#FF4D00] text-black transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold text-white bg-black border border-black">
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  );
}
