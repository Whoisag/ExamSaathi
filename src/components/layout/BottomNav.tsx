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
      href: "/",
      icon: GraduationCap,
      exact: true,
    },
    {
      label: "Trends",
      href: `/dashboard/${currentExam}/${currentSubject.toLowerCase()}`,
      icon: LayoutDashboard,
      activePattern: /^\/dashboard/,
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
      label: "Eval",
      href: "/evaluation",
      icon: Award,
      activePattern: /^\/evaluation|\/about/,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.exact
          ? pathname === tab.href
          : tab.activePattern?.test(pathname) || pathname === tab.href;

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors min-w-[58px] ${
              isActive
                ? "text-[#3730A3] font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon
              className={`w-5 h-5 transition-transform ${
                isActive ? "text-[#3730A3] scale-105" : "text-slate-400"
              }`}
            />
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
