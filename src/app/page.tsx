"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { EXAMS, ExamId } from "@/data/mock";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Sigma,
  Award,
  Users,
  Calendar,
  Layers,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  const examsList = Object.values(EXAMS);

  return (
    <AppShell title="National Exam Intelligence" subtitle="Select your target examination to explore PYQ topic trends, recurrence gap alerts, and formula cheat sheets.">
      <div className="space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#3730A3] via-[#312E81] to-slate-900 text-white p-6 sm:p-10 shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-orange-300">
              <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>NTA & CBSE Historical PYQ Frequency Engine</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Stop guessing what comes in your exam.{" "}
              <span className="text-orange-400">Study with data.</span>
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed max-w-xl">
              ExamSaathi analyzes 15+ years of verified shift question papers with Poisson recurrence modeling to pinpoint overdue topics, calculate exact frequency distributions, and generate condensed KaTeX formula sheets.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/dashboard/jee-main/physics"
                className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
              >
                <span>Launch JEE Main Trends</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all"
              >
                Methodology & Ethics
              </Link>
            </div>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#EA580C]/20 blur-3xl pointer-events-none" />
          <div className="absolute right-24 -top-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
        </div>

        {/* 5 Clickable Exam Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#3730A3]" />
                Supported Indian Examinations
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Click any exam card below to open its topic heatmap and frequency predictors
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              5 National Tracks
            </span>
          </div>

          {/* Mobile-first: 1 col -> 2 col tablet -> 3 col desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {examsList.map((exam) => {
              const defaultSubject = exam.subjects[0]?.toLowerCase() || "physics";
              return (
                <Link
                  key={exam.id}
                  href={`/dashboard/${exam.id}/${defaultSubject}`}
                  className="group bg-white rounded-[12px] p-5 sm:p-6 border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative"
                >
                  <div className="space-y-3">
                    {/* Top Row: Tag & Arrow */}
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider"
                        style={{ backgroundColor: exam.bgLight, color: exam.color }}
                      >
                        {exam.badge}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#3730A3] group-hover:text-white text-slate-400 flex items-center justify-center transition-all shrink-0">
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#3730A3] transition-colors">
                        {exam.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {exam.tagline}
                      </p>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> Target Date
                        </span>
                        <p className="font-semibold text-slate-800 text-[11px] truncate">
                          {exam.targetDate}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" /> Registered
                        </span>
                        <p className="font-semibold text-slate-800 text-[11px]">
                          {exam.totalCandidates}
                        </p>
                      </div>
                    </div>

                    {/* Subjects Pill List */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Available Subjects
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {exam.subjects.map((sub) => (
                          <span
                            key={sub}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Strip */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="text-[11px]">{exam.pyqYearsRange}</span>
                    <span className="font-bold text-[#3730A3] group-hover:underline flex items-center gap-1 text-[11px]">
                      Open Dashboard
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="bg-white rounded-[12px] p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#3730A3] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Topic Frequency Heatmap</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Visualize multi-year question volume per chapter with count vs % weightage toggle.
            </p>
          </div>

          <div className="bg-white rounded-[12px] p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Recurrence Gap Alerts</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pinpoint overdue topics that skipped previous shifts but historically return cyclically.
            </p>
          </div>

          <div className="bg-white rounded-[12px] p-5 border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center font-bold">
              <Sigma className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">KaTeX Formula Sheets</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Condense chapters into high-yield mathematical sheets ready for PDF export and clean printouts.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
