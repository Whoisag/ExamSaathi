"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Sigma,
  BookmarkCheck,
  Award,
  Target,
} from "lucide-react";
import { ExamId } from "@/data/mock";

interface BottomNavProps {
  currentExam?: ExamId;
  currentSubject?: string;
}

export function BottomNav({ currentExam = "jee-main", currentSubject = "physics" }: BottomNavProps) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Exams",
      href: "/dashboard/exams",
      icon: GraduationCap,
      activePattern: /^\/dashboard\/exams/,
    },
    {
      label: "Trends",
      href: `/dashboard/${currentExam}/${currentSubject.toLowerCase()}`,
      icon: LayoutDashboard,
      activePattern: /^\/dashboard\/[a-z0-9-]+\/[a-z0-9-]+/,
    },
    {
      label: "Practice",
      href: `/dashboard/practice?exam=${currentExam}`,
      icon: Target,
      activePattern: /^\/dashboard\/practice/,
    },
    {
      label: "Formulas",
      href: `/formulas/${currentExam}/${currentSubject.toLowerCase()}`,
      icon: Sigma,
      activePattern: /^\/formulas/,
    },
    {
      label: "My Prep",
      href: "/my-dashboard",
      icon: BookmarkCheck,
      activePattern: /^\/my-dashboard/,
    },
    {
      label: "AI Tutor",
      href: "/assistant",
      icon: Award,
      activePattern: /^\/assistant/,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-black px-1.5 py-1.5 flex items-center justify-around shadow-[0px_-4px_12px_rgba(0,0,0,0.12)] bottom-nav pb-[max(0.4rem,env(safe-area-inset-bottom))] font-sans">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.activePattern?.test(pathname) || pathname === tab.href;

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all min-w-[54px] active:scale-95 ${
              isActive
                ? "bg-black text-[#FF4D00] border border-black shadow-[2px_2px_0px_0px_#FF4D00]"
                : "text-black hover:bg-neutral-100 hover:text-black"
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-transform ${
                isActive ? "text-[#FF4D00] scale-105" : "text-neutral-800"
              }`}
            />
            <span className="font-meta text-[9px] font-bold mt-0.5 tracking-wider uppercase">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
