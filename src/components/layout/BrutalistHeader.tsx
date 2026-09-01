"use client";

import React from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function BrutalistHeader() {
  const { user, signOut, loading } = useAuth();

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

        {/* User Status / Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? (
            <div className="h-8 w-24 bg-black/10 animate-pulse border-2 border-black" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/my-dashboard"
                className="border-brutal px-3 py-1 bg-white text-black font-meta text-xs flex items-center gap-1.5 hover:bg-neutral-100 transition-colors"
                title="Go to My Dashboard"
              >
                <User className="w-3.5 h-3.5 text-[#FF4D00]" />
                <span className="font-bold uppercase truncate max-w-[100px] sm:max-w-[140px]">{user.name}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="border-brutal p-1.5 bg-white text-black hover:bg-black hover:text-white transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="border-2 border-black px-3.5 sm:px-4 py-1.5 font-meta text-xs hover:bg-black hover:text-white transition-colors bg-white font-bold text-black"
              >
                LOGIN
              </Link>
              <Link
                href="/signup"
                className="border-2 border-black px-3.5 sm:px-4 py-1.5 font-meta text-xs hover:bg-white hover:text-black transition-colors bg-black font-bold text-white hidden sm:inline-block"
              >
                SIGN UP
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
