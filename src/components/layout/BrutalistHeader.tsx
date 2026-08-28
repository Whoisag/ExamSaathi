"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, User, Terminal, LogOut } from "lucide-react";

export function BrutalistHeader() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("exam_saathi_user");
      if (stored) {
        const u = JSON.parse(stored);
        setUserName(u.name || "Student");
      }
    } catch {
      // ignore
    }
  }, []);

  const navItems = [
    { label: "EXAMS", href: "/dashboard/exams" },
    { label: "ANALYZER", href: "/analyzer/jee-main/modern-physics" },
    { label: "ASSISTANT", href: "/assistant" },
    { label: "EVALUATION", href: "/evaluation" },
    { label: "METHODOLOGY", href: "/about" },
  ];

  return (
    <header className="border-brutal-b bg-[#FF4D00] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-headline text-2xl tracking-tight flex items-center gap-2 text-black hover:opacity-80 transition-opacity"
          >
            <span>EXAMSAATHI</span>
            <span className="w-2.5 h-2.5 bg-black inline-block"></span>
          </Link>

          <span className="hidden sm:inline-block font-meta text-[11px] bg-black text-white px-2 py-0.5 font-bold">
            2026 SHELL
          </span>
        </div>

        {/* Center Links */}
        <nav className="hidden lg:flex items-center gap-1.5 font-meta text-xs">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-1.5 transition-colors border-2 ${
                  isActive
                    ? "bg-black text-white border-black font-bold"
                    : "bg-white text-black border-black hover:bg-black hover:text-white font-bold"
                }`}
              >
                [{item.label}]
              </Link>
            );
          })}
        </nav>

        {/* User Status / Action */}
        <div className="flex items-center gap-3">
          {userName ? (
            <div className="flex items-center gap-2">
              <div className="border-brutal px-3 py-1 bg-white text-black font-meta text-xs flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FF4D00]" />
                <span className="font-bold uppercase truncate max-w-[120px]">{userName}</span>
              </div>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem("exam_saathi_user");
                    setUserName(null);
                  } catch {
                    // ignore
                  }
                }}
                className="border-brutal p-1.5 bg-white text-black hover:bg-black hover:text-white transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="border-2 border-black px-4 py-1.5 font-meta text-xs hover:bg-[#FF4D00] hover:text-black transition-colors bg-white font-bold text-black"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
