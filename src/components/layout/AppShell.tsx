"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { ExamId, EXAMS } from "@/data/mock";
import { Sparkles, ChevronRight } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  currentExam?: ExamId;
  currentSubject?: string;
  subjects?: string[];
  activeSubject?: string;
  onSubjectChange?: (subject: string) => void;
  title?: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actionSlot?: React.ReactNode;
  hideSubjectsTab?: boolean;
}

export function AppShell({
  children,
  currentExam = "jee-main",
  currentSubject = "Physics",
  subjects,
  activeSubject,
  title,
  subtitle,
  breadcrumbs,
  actionSlot,
  hideSubjectsTab = false,
}: AppShellProps) {
  const exam = EXAMS[currentExam] || EXAMS["jee-main"];
  const availableSubjects = (subjects || exam.subjects).filter(
    (s) => s.toLowerCase() !== "biology"
  );
  const currentSub = activeSubject || currentSubject;

  return (
    <div className="flex min-h-screen bg-[#FF4D00] text-black font-sans selection:bg-black selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar currentExam={currentExam} currentSubject={currentSub} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8 bg-[#FF4D00]">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-[#FF4D00] border-b-2 border-black px-4 py-3 flex items-center justify-between shadow-[0px_2px_0px_0px_#000000]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black text-[#FF4D00] border border-black flex items-center justify-center font-bold text-xs shadow-[1px_1px_0px_0px_#000000]">
              ES
            </div>
            <span className="font-headline text-lg tracking-tight text-black">
              EXAM<span className="text-white">SAATHI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-headline px-3 py-1 bg-black text-white border-2 border-black font-bold shadow-[2px_2px_0px_0px_#000000]">
              {exam.shortName}
            </span>
          </div>
        </header>

        {/* Desktop / Tablet Top Sub-Header */}
        {(breadcrumbs || title || actionSlot) && (
          <div className="bg-[#FF4D00] border-b-2 border-black px-4 md:px-8 py-4 sm:py-5 shrink-0 shadow-[0px_2px_0px_0px_#000000]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                {breadcrumbs && (
                  <nav className="flex items-center gap-1.5 text-xs font-meta text-black/80 mb-1.5 flex-wrap font-bold">
                    <Link href="/" className="text-black hover:text-white transition-colors">
                      [HOME]
                    </Link>
                    {breadcrumbs.map((b, idx) => (
                      <React.Fragment key={idx}>
                        <ChevronRight className="w-3.5 h-3.5 text-black/60" />
                        {b.href ? (
                          <Link href={b.href} className="text-black hover:text-white transition-colors">
                            [{b.label.toUpperCase()}]
                          </Link>
                        ) : (
                          <span className="text-black">[{b.label.toUpperCase()}]</span>
                        )}
                      </React.Fragment>
                    ))}
                  </nav>
                )}

                {title && (
                  <h1 className="font-headline text-xl sm:text-2xl md:text-3xl tracking-tight text-black flex items-center gap-2.5">
                    {title}
                  </h1>
                )}

                {subtitle && (
                  <p className="text-xs sm:text-sm text-black/90 font-medium mt-1 max-w-2xl leading-relaxed font-sans">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Action Slot (e.g. Print button, Search, State Toggles) */}
              {actionSlot && <div className="flex items-center gap-2.5 shrink-0">{actionSlot}</div>}
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomNav currentExam={currentExam} currentSubject={currentSub} />
    </div>
  );
}
