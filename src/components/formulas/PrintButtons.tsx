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
    <div className="flex items-center gap-2 no-print">
      <button
        onClick={handlePrint}
        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs"
        title="Print current sheet"
      >
        <Printer className="w-3.5 h-3.5 text-slate-500" />
        <span className="hidden sm:inline">Print Sheet</span>
      </button>

      <button
        onClick={handleDownloadPDF}
        className="px-3.5 py-2 rounded-xl bg-[#3730A3] hover:bg-[#312E81] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs hover:shadow-indigo-300"
        title={`Download ${examName} ${subjectName} formula PDF`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Save as PDF</span>
      </button>
    </div>
  );
}
