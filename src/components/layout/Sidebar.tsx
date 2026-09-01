"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { slideUpVariants } from "@/hooks/useMotion";
import {
  Sparkles,
  Sigma,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  Check,
} from "lucide-react";
import { EXAMS, ExamId } from "@/data/mock";

interface SidebarProps {
  currentExam?: ExamId;
  currentSubject?: string;
}

export function Sidebar({ currentExam = "jee-main", currentSubject = "Physics" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSelectExam = (examKey: ExamId) => {
    if (EXAMS[examKey]?.badge?.toLowerCase().includes("coming soon")) {
      return;
    }
    setIsDropdownOpen(false);
    try {
      localStorage.setItem("examsaathi_target_exam", examKey);
      const storedUser = localStorage.getItem("exam_saathi_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        u.targetExam = examKey;
        localStorage.setItem("exam_saathi_user", JSON.stringify(u));
        document.cookie = `exam_saathi_user=${encodeURIComponent(JSON.stringify(u))}; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch (e) {
      console.warn("Could not persist target exam:", e);
    }

    // Determine smart target route depending on current view
    if (pathname.startsWith("/formulas")) {
      const targetSub = EXAMS[examKey]?.subjects[0]?.toLowerCase() || "physics";
      router.push(`/formulas/${examKey}/${targetSub}`);
    } else if (pathname.startsWith("/dashboard/") && !pathname.startsWith("/dashboard/exams") && !pathname.startsWith("/dashboard/practice")) {
      const targetSub = EXAMS[examKey]?.subjects[0]?.toLowerCase() || "physics";
      router.push(`/dashboard/${examKey}/${targetSub}`);
    } else if (pathname.startsWith("/my-dashboard")) {
      router.push(`/my-dashboard?exam=${examKey}`);
    } else if (pathname.startsWith("/dashboard/practice")) {
      router.push(`/dashboard/practice?exam=${examKey}`);
    } else {
      router.push(`/my-dashboard?exam=${examKey}`);
    }
  };

  const navLinks = [
    {
      label: "Exam Chapter Wise Analysis",
      href: "/dashboard/exams",
      icon: Layers,
    },
    {
      label: "Practice Questions",
      href: `/dashboard/practice?exam=${currentExam}`,
      icon: BookmarkCheck,
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
      label: "AI Strategy Tutor",
      href: "/assistant",
      icon: Sparkles,
    },
  ];

  return (
    <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }} className="hidden md:flex md:flex-col w-64 border-r-2 border-black bg-white min-h-screen sticky top-0 shrink-0 select-none z-30 font-sans">
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

      {/* Quick Exam Switcher with Fast Dropdown */}
      <div className="px-4 py-3.5 border-b-2 border-black bg-neutral-50 relative" ref={dropdownRef}>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <label className="text-[10px] font-bold font-meta tracking-wider uppercase text-neutral-500">
            // TARGET EXAM
          </label>
          <span className="text-[9px] font-meta text-neutral-400 font-bold uppercase">
            [FAST SWITCH]
          </span>
        </div>

        <div className="relative">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white border-2 border-black p-2.5 flex items-center justify-between shadow-[2px_2px_0px_0px_#000000] cursor-pointer hover:border-neutral-800 transition-all"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
          >
            <div className="min-w-0 pr-1">
              <p className="text-xs font-bold text-black font-headline truncate">
                {EXAMS[currentExam]?.name || "JEE Main 2026"}
              </p>
              <p className="text-[10px] font-meta text-neutral-600 truncate">
                {EXAMS[currentExam]?.badge || "National Entrance"}
              </p>
            </div>
            <button
              type="button"
              className="text-[10px] font-bold font-meta text-black bg-[#FF4D00] hover:bg-black hover:text-white px-2 py-1 border border-black transition-colors shrink-0 flex items-center gap-1 ml-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              <span>SWITCH</span>
              {isDropdownOpen ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Neo-brutalist Dropdown Popover */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-2 py-1 border-b border-neutral-200 mb-1.5 flex items-center justify-between">
                <span className="font-meta text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                  Select Exam Track
                </span>
                <span className="font-meta text-[9px] text-[#FF4D00] font-bold">
                  {Object.keys(EXAMS).length} TRACKS
                </span>
              </div>
              <div className="space-y-1 py-0.5">
                {(Object.keys(EXAMS) as ExamId[]).map((examKey) => {
                  const item = EXAMS[examKey];
                  const isSelected = examKey === currentExam;
                  const isComingSoon = item.badge?.toLowerCase().includes("coming soon");

                  if (isComingSoon) {
                    return (
                      <div
                        key={examKey}
                        className="w-full text-left px-2.5 py-2 border border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-between opacity-70 cursor-not-allowed select-none"
                      >
                        <div className="min-w-0 pr-1">
                          <div className="text-xs font-headline flex items-center gap-1 text-neutral-600 truncate">
                            <span>{item.name}</span>
                          </div>
                          <div className="text-[10px] font-meta text-neutral-500 uppercase">
                            // In Model Ingestion
                          </div>
                        </div>
                        <span className="text-[9px] font-meta px-1.5 py-0.5 bg-neutral-200 text-neutral-700 font-bold border border-neutral-400 uppercase shrink-0">
                          SOON
                        </span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={examKey}
                      type="button"
                      onClick={() => handleSelectExam(examKey)}
                      className={`w-full text-left px-2.5 py-2 border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-black text-white border-black font-bold"
                          : "bg-white text-black border-transparent hover:bg-[#FF4D00] hover:text-black hover:border-black font-medium"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-headline flex items-center gap-1.5 truncate">
                          <span>{item.name}</span>
                        </div>
                        <div
                          className={`text-[10px] font-meta truncate ${
                            isSelected ? "text-neutral-300" : "text-neutral-500"
                          }`}
                        >
                          {item.badge}
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#FF4D00] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <motion.nav 
        className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto"
        initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        <div className="px-2 pb-1.5">
          <p className="text-[10px] font-bold font-meta tracking-wider uppercase text-neutral-500">
            // PLATFORM MODULES
          </p>
        </div>
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href)) ||
            (item.label === "Formula Sheets" && pathname.startsWith("/formulas"));

          return (
            <motion.div key={item.label} variants={slideUpVariants} className="relative">
              {isActive && (
                <motion.div layoutId="activeNav" className="absolute inset-0 bg-black text-[#FF4D00] border-2 border-black shadow-[3px_3px_0px_0px_#FF4D00]" />
              )}
              <Link
                href={item.href}
                className={`relative flex items-center gap-2.5 px-3 py-2.5 font-meta text-xs transition-all ${
                  isActive
                    ? "text-[#FF4D00] font-bold z-10"
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
            </motion.div>
          );
        })}
      </motion.nav>

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
    </motion.aside>
  );
}
