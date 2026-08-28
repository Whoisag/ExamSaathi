"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";

interface PortalHeroProps {
  onExploreClick?: () => void;
}

export function PortalHero({ onExploreClick }: PortalHeroProps) {
  const [isParted, setIsParted] = useState(() => {
    if (typeof window !== "undefined" && window.location.search.includes("parted=true")) {
      return true;
    }
    return false;
  });
  const heroRef = useRef<HTMLDivElement>(null);

  // Bidirectional scroll detection:
  // Scrolling down parts the panels and wordmark; scrolling back to top brings them back!
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 40) {
        setIsParted(true);
      } else if (scrollY <= 10) {
        setIsParted(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bidirectional wheel detection:
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 20 && !isParted) {
      setIsParted(true);
    } else if (e.deltaY < -20 && window.scrollY <= 10 && isParted) {
      setIsParted(false);
    }
  };

  const toggleParting = () => {
    if (!isParted) {
      setIsParted(true);
    } else {
      setIsParted(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={heroRef}
      onWheel={handleWheel}
      className="relative w-full min-h-screen overflow-hidden bg-black select-none flex flex-col justify-between border-brutal-b"
      style={{ perspective: 1200 }}
    >
      {/* FULL-BLEED BACKGROUND VISUALIZATION (Revealed when panels part) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0a0a0a]">
          {/* Subtle Grid System */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(#FF4D00 1px, transparent 1px), linear-gradient(90deg, #FF4D00 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Abstract Question Paper Sheets in Background */}
          <div className="absolute inset-0 flex items-center justify-around opacity-30 p-8">
            {/* Paper Sheet 1: JEE Main Shift 1 */}
            <div className="hidden lg:block w-72 h-96 border-2 border-[#FF4D00] bg-black p-4 font-meta text-[10px] text-neutral-400 rotate-[-6deg] transform">
              <div className="border-b border-[#FF4D00] pb-2 mb-3 text-white font-bold flex justify-between">
                <span>NTA JEE MAIN 2025</span>
                <span>SEC-A // Q.24</span>
              </div>
              <div className="space-y-2 text-neutral-300 font-mono">
                <p>A monochromatic beam of wavelength λ = 450nm hits cathode...</p>
                <div className="p-2 border border-neutral-700 bg-neutral-950 text-[#FF4D00]">
                  eV₀ = hc/λ - Φ₀
                </div>
                <p className="text-[9px] text-neutral-500">// DIRICHLET RANK: #01 WEIGHTAGE 12.5%</p>
              </div>
            </div>

            {/* Paper Sheet 2: NEET Shift Blueprint */}
            <div className="w-80 h-96 border-2 border-white bg-black p-5 font-meta text-[10px] text-neutral-400 rotate-[3deg] transform">
              <div className="border-b border-white pb-2 mb-3 text-white font-bold flex justify-between">
                <span>NEET UG NATIONAL</span>
                <span>PHYSICS TRACK</span>
              </div>
              <div className="space-y-3 text-neutral-300 font-mono">
                <p>Poisson recurrence interval Δt = 3.2 yrs exceeded.</p>
                <div className="h-24 border border-dashed border-[#FF4D00] flex items-center justify-center text-[#FF4D00] font-headline text-lg">
                  P(k) = λᵏ e⁻ᵏ / k!
                </div>
                <div className="flex justify-between text-white font-bold pt-1">
                  <span>FREQUENCY: HIGH</span>
                  <span className="text-[#FF4D00]">+4 MARKS AT STAKE</span>
                </div>
              </div>
            </div>

            {/* Paper Sheet 3: Advanced Multi-Concept Matrix */}
            <div className="hidden md:block w-72 h-96 border-2 border-[#FF4D00] bg-black p-4 font-meta text-[10px] text-neutral-400 rotate-[-4deg] transform">
              <div className="border-b border-[#FF4D00] pb-2 mb-3 text-white font-bold flex justify-between">
                <span>JEE ADVANCED MATRIX</span>
                <span>MULTI-CONCEPT</span>
              </div>
              <div className="space-y-2 text-neutral-300 font-mono">
                <p>Rotational Dynamics ⊗ Electromagnetic Induction</p>
                <div className="p-2 border border-neutral-700 bg-neutral-950 text-white">
                  τ = dL/dt = I·α + r × (qE)
                </div>
                <p className="text-[9px] text-[#FF4D00]">// EMPIRICAL HISTORICAL SHIFT CORRELATION: 0.85</p>
              </div>
            </div>
          </div>

          {/* Clean 25% Black Overlay (NO BLUR) */}
          <div className="absolute inset-0 bg-black/25" />
        </div>
      </div>

      {/* TWO SOLID PARTING PANELS: Left #FF4D00, Right #000000 (SOLID, NEVER TRANSPARENT) */}
      <div className="absolute inset-0 pointer-events-none z-20 flex overflow-hidden">
        {/* Left Panel: Solid Orange #FF4D00 */}
        <motion.div
          animate={{
            x: isParted ? "-100%" : "0%",
          }}
          transition={{
            duration: 0.85,
            ease: [0.2, 0.8, 0.3, 1],
          }}
          className="w-1/2 h-full bg-[#FF4D00] relative border-r-2 border-black flex items-center justify-end"
        >
          <div className="absolute top-28 left-8 font-meta text-xs text-black font-bold hidden sm:block">
            // PORTAL PANEL L-01 // NTA SHIFTS
          </div>
          <div className="absolute bottom-28 left-8 font-meta text-[11px] text-black font-bold hidden sm:block">
            DATA HARVEST: 2010 — 2025
          </div>
        </motion.div>

        {/* Right Panel: Solid Pitch Black #000000 */}
        <motion.div
          animate={{
            x: isParted ? "100%" : "0%",
          }}
          transition={{
            duration: 0.85,
            ease: [0.2, 0.8, 0.3, 1],
          }}
          className="w-1/2 h-full bg-black relative border-l-2 border-black flex items-center justify-start"
        >
          <div className="absolute top-28 right-8 font-meta text-xs text-neutral-400 font-bold hidden sm:block">
            // PORTAL PANEL R-02 // PREDICTIVE AUDIT
          </div>
          <div className="absolute bottom-28 right-8 font-meta text-[11px] text-neutral-400 font-bold hidden sm:block">
            RECURRENCE ENGINE: POISSON
          </div>
        </motion.div>
      </div>

      {/* DYNAMIC SPLIT WORDMARK: "EXAM" & "SAATHI" */}
      {/* Closed: Centered at seam. Parted: FULLY moves out of the screen! Scroll back: Slides back to seam! */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Left half: "EXAM" (Moves fully offscreen to the left on scroll) */}
        <motion.div
          animate={{
            x: isParted ? "-100vw" : "0vw",
            opacity: isParted ? 0 : 1,
          }}
          transition={{
            duration: 0.85,
            ease: [0.2, 0.8, 0.3, 1],
          }}
          className="w-1/2 text-right pr-1 sm:pr-2 font-headline text-[13vw] sm:text-[11.5vw] md:text-[10vw] lg:text-[9.5vw] leading-[0.85] select-none whitespace-nowrap text-black"
        >
          EXAM
        </motion.div>

        {/* Right half: "SAATHI" (Moves fully offscreen to the right on scroll) */}
        <motion.div
          animate={{
            x: isParted ? "100vw" : "0vw",
            opacity: isParted ? 0 : 1,
          }}
          transition={{
            duration: 0.85,
            ease: [0.2, 0.8, 0.3, 1],
          }}
          className="w-1/2 text-left pl-1 sm:pl-2 font-headline text-[13vw] sm:text-[11.5vw] md:text-[10vw] lg:text-[9.5vw] leading-[0.85] select-none whitespace-nowrap text-white"
        >
          SAATHI
        </motion.div>
      </div>

      {/* HERO INTERACTIVE CONTENT (Fades in cleanly when parted with zero wordmark collisions) */}
      <div className="relative z-25 w-full max-w-4xl mx-auto px-4 sm:px-8 pt-36 pb-12 flex flex-col items-center justify-center text-center my-auto min-h-[440px]">
        <AnimatePresence>
          {isParted ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              {/* Tagline */}
              <div className="font-meta text-xs sm:text-sm md:text-base text-white tracking-[0.05em] uppercase font-bold border-2 border-[#FF4D00] bg-black px-4 py-2 inline-block">
                PATTERN-BASED EXAM PREP FOR INDIAN STUDENTS
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-200 leading-snug">
                Stop guessing what comes in your exam. Surgical PYQ frequency intelligence,
                overdue recurrence gap alerts, and KaTeX cheat sheets for Indian students.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  href="/dashboard/exams"
                  className="bg-[#FF4D00] text-black px-8 py-4 border-2 border-black font-headline text-base sm:text-lg hover:bg-white hover:text-black transition-colors inline-flex items-center gap-3"
                >
                  <span>EXPLORE ALL EXAMS</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/analyzer/jee-main/modern-physics"
                  className="bg-black text-white px-8 py-4 border-2 border-white font-headline text-base sm:text-lg hover:bg-[#FF4D00] hover:text-black hover:border-black transition-colors inline-flex items-center gap-3"
                >
                  <span>SAMPLE ANALYZER</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Verified Metrics Row */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-6 font-meta text-xs text-neutral-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FF4D00] inline-block"></span>
                  <span>JEE MAIN • NEET • ADVANCED • CBSE</span>
                </span>
                <span className="hidden sm:inline text-neutral-600">•</span>
                <span className="text-[#FF4D00] font-bold">
                  MAE 0.48 QS // SPEARMAN RHO 0.85
                </span>
              </div>
            </motion.div>
          ) : (
            /* Standby Trigger Pill when closed */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-48 pointer-events-auto"
            >
              <button
                onClick={toggleParting}
                className="bg-black text-white border-2 border-white px-6 py-3 font-meta text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-[#FF4D00] hover:text-black hover:border-black transition-all cursor-pointer shadow-2xl"
              >
                <span>CLICK OR SCROLL TO ENTER PORTAL</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM HERO BAR & ROTATING SCROLL INDICATOR (CLEAN TRANSPARENT, NO BLUR EFFECT) */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex items-center justify-between border-t-2 border-neutral-800 bg-transparent">
        <div className={`font-meta text-xs transition-colors ${isParted ? "text-neutral-400" : "text-black"}`}>
          <span className={isParted ? "text-[#FF4D00] font-bold" : "text-black font-bold"}>
            // INTERACTIVE PORTAL
          </span>
          <span className="hidden sm:inline ml-2">
            {isParted ? "STATUS: UNLOCKED (SCROLL UP TO CLOSE)" : "STATUS: STANDBY (SCROLL DOWN TO PART)"}
          </span>
        </div>

        {/* Rotating Circular Indicator */}
        <div
          onClick={toggleParting}
          className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center select-none cursor-pointer hover:scale-105 transition-transform"
          title="Click to toggle portal parting"
        >
          <svg className="w-full h-full animate-spin-12s text-white" viewBox="0 0 100 100">
            <defs>
              <path
                id="portalCirclePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text fontSize="10.5" className="font-meta font-bold fill-current tracking-widest">
              <textPath xlinkHref="#portalCirclePath">
                • SCROLL DOWN • OPEN PORTAL •
              </textPath>
            </text>
          </svg>
          <div className="absolute w-8 h-8 rounded-full bg-[#FF4D00] border-2 border-black flex items-center justify-center">
            {isParted ? (
              <ChevronDown className="w-4 h-4 text-black animate-bounce" />
            ) : (
              <ArrowRight className="w-4 h-4 text-black transform rotate-90" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
