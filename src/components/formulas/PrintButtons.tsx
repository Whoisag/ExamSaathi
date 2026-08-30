"use client";

import React from "react";
import { Printer, Download, Sparkles } from "lucide-react";

interface PrintButtonsProps {
  onPrint?: () => void;
  examName?: string;
  subjectName?: string;
}

export function PrintButtons({
  onPrint,
  examName = "JEE Main",
  subjectName = "Physics",
}: PrintButtonsProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleDownloadPDF = () => {
    // In modern browsers, window.print() gives an immediate "Save as PDF" option
    window.print();
  };

  return (
    <div className="flex items-center gap-2 no-print font-sans">
      <button
        onClick={handlePrint}
        className="px-3.5 py-2 bg-white border-2 border-black hover:bg-neutral-100 text-black font-meta text-xs font-bold flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5"
        title="Print current sheet"
      >
        <Printer className="w-3.5 h-3.5 text-black" />
        <span className="hidden sm:inline">PRINT</span>
      </button>

      <button
        onClick={handleDownloadPDF}
        className="px-3.5 py-2 bg-black hover:bg-[#FF4D00] hover:text-black text-white border-2 border-black font-meta text-xs font-bold flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#FF4D00] active:translate-y-0.5"
        title={`Download ${examName} ${subjectName} formula PDF`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>SAVE AS PDF</span>
      </button>
    </div>
  );
}
