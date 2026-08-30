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
  Target,
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
      label: "Practice",
      href: `/dashboard/practice?exam=${currentExam}`,
      icon: Target,
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
    <aside className="hidden md:flex md:flex-col w-64 border-r-2 border-black bg-white min-h-screen sticky top-0 shrink-0 select-none z-30 font-sans">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b-2 border-black bg-black text-white justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-7 h-7 bg-[#FF4D00] border border-black flex items-center justify-center text-black font-bold text-xs">
            ES
          </div>
          <div>
            <span className="font-headline text-lg tracking-tight text-white">
              EXAM<span className="text-[#FF4D00]">SAATHI</span>
            </span>
          </div>
        </Link>
        <span className="w-2 h-2 bg-[#FF4D00]"></span>
      </div>

      {/* Quick Exam Switcher */}
      <div className="px-4 py-3.5 border-b-2 border-black bg-neutral-50">
        <label className="text-[10px] font-bold font-meta tracking-wider uppercase text-neutral-500 block mb-1.5 px-1">
          // TARGET EXAM
        </label>
        <div className="bg-white border-2 border-black p-2.5 flex items-center justify-between shadow-[2px_2px_0px_0px_#000000]">
          <div className="min-w-0">
            <p className="text-xs font-bold text-black font-headline truncate">
              {EXAMS[currentExam]?.name || "JEE Main"}
            </p>
            <p className="text-[10px] font-meta text-neutral-600 truncate">
              {EXAMS[currentExam]?.badge || "National Entrance"}
            </p>
          </div>
          <Link
            href="/dashboard/exams"
            className="text-[10px] font-bold font-meta text-black bg-[#FF4D00] hover:bg-black hover:text-white px-2 py-1 border border-black transition-colors shrink-0 flex items-center gap-0.5 ml-2"
          >
            SWITCH
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-2 pb-1.5">
          <p className="text-[10px] font-bold font-meta tracking-wider uppercase text-neutral-500">
            // PLATFORM MODULES
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
              className={`flex items-center gap-2.5 px-3 py-2.5 font-meta text-xs transition-all ${
                isActive
                  ? "bg-black text-[#FF4D00] border-2 border-black shadow-[3px_3px_0px_0px_#FF4D00] font-bold"
                  : "text-black hover:bg-[#FF4D00]/10 hover:text-black border-2 border-transparent font-medium"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-[#FF4D00]" : "text-neutral-700"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-3.5 m-3 bg-black border-2 border-black text-white font-meta text-[11px] space-y-1.5 shadow-[3px_3px_0px_0px_#FF4D00]">
        <div className="flex items-center gap-1.5 font-bold text-[#FF4D00]">
          <span className="w-2 h-2 bg-[#FF4D00] inline-block animate-pulse"></span>
          <span>EMPIRICAL ZERO-BIAS</span>
        </div>
        <p className="text-neutral-300 text-[10px] leading-relaxed">
          Dirichlet & Poisson engine analyzing 15+ yrs of NTA/CBSE shifts.
        </p>
      </div>
    </aside>
  );
}
