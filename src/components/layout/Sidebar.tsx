"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Sigma,
  BookmarkCheck,
  Award,
  Info,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { EXAMS, ExamId } from "@/data/mock";

interface SidebarProps {
  currentExam?: ExamId;
  currentSubject?: string;
}

export function Sidebar({ currentExam = "jee-main", currentSubject = "Physics" }: SidebarProps) {
  const pathname = usePathname();

  const navLinks = [
    {
      label: "Overview",
      href: "/",
      icon: GraduationCap,
      exact: true,
    },
    {
      label: "Topic Trends",
      href: `/dashboard/${currentExam}/${encodeURIComponent(currentSubject.toLowerCase())}`,
      icon: LayoutDashboard,
    },
    {
      label: "Formula Sheets",
      href: `/formulas/${currentExam}/${encodeURIComponent(currentSubject.toLowerCase())}`,
      icon: Sigma,
    },
    {
      label: "My Prep Hub",
      href: "/my-dashboard",
      icon: BookmarkCheck,
    },
    {
      label: "Evaluation",
      href: "/evaluation",
      icon: Award,
    },
    {
      label: "Methodology & Ethics",
      href: "/about",
      icon: Info,
    },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-64 border-r border-slate-200 bg-white min-h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#3730A3] flex items-center justify-center text-white shadow-sm shadow-indigo-200">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
            Exam<span className="text-[#EA580C]">Saathi</span>
          </span>
          <p className="text-[11px] font-medium text-slate-400 -mt-0.5">PYQ Intelligence AI</p>
        </div>
      </div>

      {/* Quick Exam Switcher */}
      <div className="px-4 py-4 border-b border-slate-100">
        <label className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 block mb-2 px-2">
          Selected Target Exam
        </label>
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {EXAMS[currentExam]?.name || "JEE Main"}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {EXAMS[currentExam]?.badge || "National Entrance"}
            </p>
          </div>
          <Link
            href="/"
            className="text-[11px] font-medium text-[#3730A3] hover:text-[#312E81] hover:underline shrink-0 flex items-center"
          >
            Change
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Navigation
          </p>
        </div>
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) ||
              (item.label === "Topic Trends" && pathname.startsWith("/dashboard")) ||
              (item.label === "Formula Sheets" && pathname.startsWith("/formulas"));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#EEF2FF] text-[#3730A3] font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-[#3730A3]" : "text-slate-400"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 m-3 bg-gradient-to-br from-indigo-50/70 to-orange-50/50 border border-indigo-100/80 rounded-xl text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
          <span>Zero-Bias Guaranteed</span>
        </div>
        <p className="text-slate-500 text-[11px] leading-relaxed">
          Proprietary Poisson & Dirichlet model analyzing 15+ years of verified question papers.
        </p>
      </div>
    </aside>
  );
}
