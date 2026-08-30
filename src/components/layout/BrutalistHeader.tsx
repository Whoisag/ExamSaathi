"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowRight, User, Terminal, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function BrutalistHeader() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = user
    ? [
        { label: "EXAMS", href: "/dashboard/exams" },
        { label: "PRACTICE", href: "/dashboard/practice" },
        { label: "MY DASHBOARD", href: "/my-dashboard" },
        { label: "AI TUTOR", href: "/assistant" },
      ]
    : [
        { label: "AI ASSISTANT", href: "/assistant" },
        { label: "EVALUATION", href: "/evaluation" },
        { label: "METHODOLOGY", href: "/about" },
      ];

  if (loading) {
    return (
      <header className="border-brutal-b bg-[#FF4D00] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="font-headline text-xl sm:text-2xl tracking-tight flex items-center gap-2 text-black hover:opacity-80 transition-opacity"
            >
              <span>EXAMSAATHI</span>
              <span className="w-2.5 h-2.5 bg-black inline-block"></span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-brutal-b bg-[#FF4D00] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="font-headline text-xl sm:text-2xl tracking-tight flex items-center gap-2 text-black hover:opacity-80 transition-opacity"
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
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="border-brutal px-3 py-1 bg-white text-black font-meta text-xs flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FF4D00]" />
                <span className="font-bold uppercase truncate max-w-[100px] sm:max-w-[120px]">{user.name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="border-brutal p-1.5 bg-white text-black hover:bg-black hover:text-white transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="border-2 border-black px-3.5 sm:px-4 py-1.5 font-meta text-xs hover:bg-black hover:text-white transition-colors bg-white font-bold text-black"
            >
              LOGIN
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden bg-black text-white p-1.5 border-2 border-black hover:bg-white hover:text-black transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-t-2 border-black text-white p-4 font-meta text-xs space-y-2">
          <div className="text-[10px] text-[#FF4D00] font-mono font-bold tracking-wider">// PLATFORM NAVIGATION</div>
          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 hover:bg-[#FF4D00] hover:text-black transition-colors flex items-center justify-between font-bold"
              >
                <span>[{item.label}]</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-neutral-800 flex gap-2">
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 bg-[#FF4D00] text-black font-headline text-center py-2.5 text-xs hover:bg-white transition-colors"
            >
              CREATE ACCOUNT
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-white text-black font-meta text-center py-2.5 px-4 text-xs font-bold hover:bg-neutral-200 transition-colors"
            >
              LOGIN
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
