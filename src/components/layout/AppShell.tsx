"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { ExamId, EXAMS } from "@/data/mock";
import { Sparkles, ChevronRight, BookOpen, Layers } from "lucide-react";

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
}: AppShellProps) {
  const exam = EXAMS[currentExam] || EXAMS["jee-main"];
  const availableSubjects = subjects || exam.subjects;
  const currentSub = activeSubject || currentSubject;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar currentExam={currentExam} currentSubject={currentSub} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#3730A3] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900">
              Exam<span className="text-[#EA580C]">Saathi</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-[#3730A3] border border-indigo-100/60">
              {exam.shortName}
            </span>
          </div>
        </header>

        {/* Desktop Top Sub-Header */}
        {(breadcrumbs || title || actionSlot) && (
          <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-4 sm:py-5 shrink-0">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                {breadcrumbs && (
                  <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5 flex-wrap">
                    <Link href="/" className="hover:text-slate-600 transition-colors">
                      Home
                    </Link>
                    {breadcrumbs.map((b, idx) => (
                      <React.Fragment key={idx}>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        {b.href ? (
                          <Link href={b.href} className="hover:text-slate-600 transition-colors">
                            {b.label}
                          </Link>
                        ) : (
                          <span className="text-slate-700 font-medium">{b.label}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </nav>
                )}

                {title && (
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                    {title}
                  </h1>
                )}

                {subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Action Slot (e.g. Print button, Search, State Toggles) */}
              {actionSlot && <div className="flex items-center gap-2.5 shrink-0">{actionSlot}</div>}
            </div>

            {/* Subject Selector Tabs if applicable */}
            {availableSubjects && availableSubjects.length > 1 && (
              <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline-flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> Subjects:
                </span>
                {availableSubjects.map((sub) => {
                  const isSelected =
                    currentSub.toLowerCase() === sub.toLowerCase();
                  return (
                    <Link
                      key={sub}
                      href={`/dashboard/${currentExam}/${sub.toLowerCase()}`}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[#3730A3] text-white shadow-xs shadow-indigo-300"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      {sub}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomNav currentExam={currentExam} currentSubject={currentSub} />
    </div>
  );
}
