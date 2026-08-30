"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, animate } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";

interface PortalHeroProps {
  onExploreClick?: () => void;
}

export function PortalHero({ onExploreClick }: PortalHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const openProgress = useMotionValue(0);
  const [statusText, setStatusText] = useState("STANDBY (SCROLL TO OPEN)");
  const [isFullyOpen, setIsFullyOpen] = useState(false);

  const isUnlockedRef = useRef(false);
  const targetProgressRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartYRef = useRef(0);

  // Proportional transforms linked directly to openProgress:
  // "if the user scrolls down little bit it should open little bit"
  const leftPanelX = useTransform(openProgress, [0, 1], ["0%", "-100%"]);
  const rightPanelX = useTransform(openProgress, [0, 1], ["0%", "100%"]);
  const examWordmarkX = useTransform(openProgress, [0, 1], ["0vw", "-100vw"]);
  const saathiWordmarkX = useTransform(openProgress, [0, 1], ["0vw", "100vw"]);
  const wordmarkOpacity = useTransform(openProgress, [0, 0.7, 1], [1, 0.7, 0]);
  const heroInnerOpacity = useTransform(openProgress, [0, 0.15, 1], [0, 0.35, 1]);

  // Scroll-linked fade out / fade in when scrolling past the hero
  const { scrollY } = useScroll();
  const heroContentOpacity = useTransform(scrollY, [0, 260, 480], [1, 1, 0]);
  const heroContentY = useTransform(scrollY, [0, 260, 480], [0, 0, -45]);
  const heroContentScale = useTransform(scrollY, [0, 260, 480], [1, 1, 0.94]);

  // Schedules automatic closure after 2 seconds:
  // "and after it is opened it closes automatically after 2 secs"
  const scheduleAutoClose = (label = "FULLY OPEN (AUTOCLOSES IN 2S)") => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setStatusText(label);
    timerRef.current = setTimeout(() => {
      setStatusText("AUTOCLOSING...");
      animate(openProgress, 0, {
        duration: 0.85,
        ease: [0.2, 0.8, 0.3, 1],
        onComplete: () => {
          setIsFullyOpen(false);
          targetProgressRef.current = 0;
          setStatusText("STANDBY (SCROLL DOWN TO EXPLORE)");
        },
      });
      timerRef.current = null;
    }, 2000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.search.includes("parted=true")) {
        openProgress.set(1);
        targetProgressRef.current = 1;
        setIsFullyOpen(true);
        isUnlockedRef.current = true;
        scheduleAutoClose("FULLY OPEN (AUTOCLOSES IN 2S)");
      } else if (window.scrollY > 10) {
        // If user refreshed while scrolled down, do not lock
        isUnlockedRef.current = true;
      }
    }
  }, [openProgress]);

  useEffect(() => {
    // 1. Mouse wheel handler:
    // "when the user uses the scroller in the mouse the panels opens with every scroll of the scroller of the mouse and after its open then only the user can scroll down he landing page to see everyting else in the landing page"
    const handleWheel = (e: WheelEvent) => {
      // If user has already unlocked or is scrolled down the page, let standard scrolling happen
      if (isUnlockedRef.current || window.scrollY > 5) {
        return;
      }

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 40;
      else if (e.deltaMode === 2) delta *= 800;

      if (delta > 0) {
        // Scrolling downward: open panels with every scroll of the scroller!
        e.preventDefault();

        // Increment progress proportionally
        const increment = Math.abs(delta) * 0.0028;
        const next = Math.min(1, targetProgressRef.current + increment);
        targetProgressRef.current = next;
        openProgress.set(next);

        if (next >= 0.98) {
          targetProgressRef.current = 1;
          openProgress.set(1);
          setIsFullyOpen(true);
          isUnlockedRef.current = true; // Unlock landing page scroll!
          scheduleAutoClose("FULLY OPEN (AUTOCLOSES IN 2S)");
        } else {
          setIsFullyOpen(false);
          setStatusText(`PARTING (${Math.round(next * 100)}%)`);
        }
      } else {
        // Scrolling upward while at top: prevent bounce and do not close prematurely
        // "if the user scrolls back the panel shouldnt close it will only close automatically after 2 secs"
        e.preventDefault();
      }
    };

    // 2. Touch gesture handler for mobile:
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isUnlockedRef.current || window.scrollY > 5) {
        return;
      }

      if (e.touches.length > 0) {
        const currentY = e.touches[0].clientY;
        const delta = touchStartYRef.current - currentY; // positive when swiping up / scrolling down

        if (delta > 0) {
          e.preventDefault();
          const increment = delta * 0.0035;
          const next = Math.min(1, targetProgressRef.current + increment);
          targetProgressRef.current = next;
          openProgress.set(next);
          touchStartYRef.current = currentY;

          if (next >= 0.98) {
            targetProgressRef.current = 1;
            openProgress.set(1);
            setIsFullyOpen(true);
            isUnlockedRef.current = true; // Unlock landing page scroll!
            scheduleAutoClose("FULLY OPEN (AUTOCLOSES IN 2S)");
          } else {
            setIsFullyOpen(false);
            setStatusText(`PARTING (${Math.round(next * 100)}%)`);
          }
        }
      }
    };

    // 3. Keyboard handler (DownArrow, PageDown, Space):
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isUnlockedRef.current || window.scrollY > 5) {
        return;
      }

      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        const next = Math.min(1, targetProgressRef.current + 0.34);
        targetProgressRef.current = next;
        openProgress.set(next);

        if (next >= 0.98) {
          targetProgressRef.current = 1;
          openProgress.set(1);
          setIsFullyOpen(true);
          isUnlockedRef.current = true;
          scheduleAutoClose("FULLY OPEN (AUTOCLOSES IN 2S)");
        } else {
          setIsFullyOpen(false);
          setStatusText(`PARTING (${Math.round(next * 100)}%)`);
        }
      }
    };

    // 4. Scroll listener: enforce scroll lock until fully open, and re-arm when back at top
    const handleScroll = () => {
      if (!isUnlockedRef.current && window.scrollY > 0) {
        window.scrollTo(0, 0);
        return;
      }

      if (
        window.scrollY <= 5 &&
        isUnlockedRef.current &&
        openProgress.get() === 0 &&
        !timerRef.current
      ) {
        isUnlockedRef.current = false;
        targetProgressRef.current = 0;
        setStatusText("STANDBY (SCROLL DOWN TO PART)");
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      document.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [openProgress]);

  // Click on circular indicator toggles open or close
  const toggleParting = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (openProgress.get() < 0.5) {
      targetProgressRef.current = 1;
      isUnlockedRef.current = true;
      setIsFullyOpen(true);
      setStatusText("FULLY OPEN (AUTOCLOSES IN 2S)");
      animate(openProgress, 1, {
        duration: 0.7,
        ease: [0.2, 0.8, 0.3, 1],
        onComplete: () => {
          scheduleAutoClose("FULLY OPEN (AUTOCLOSES IN 2S)");
        },
      });
    } else {
      targetProgressRef.current = 0;
      setStatusText("AUTOCLOSING...");
      animate(openProgress, 0, {
        duration: 0.85,
        ease: [0.2, 0.8, 0.3, 1],
        onComplete: () => {
          setIsFullyOpen(false);
          setStatusText("STANDBY (SCROLL DOWN TO PART)");
        },
      });
    }
  };

  return (
    <div
      ref={heroRef}
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
          <div className="absolute inset-0 flex items-center justify-around opacity-35 p-8">
            {/* Paper Sheet 1: JEE Main Shift 1 */}
            <motion.div
              animate={{
                y: [0, -14, 0],
                rotate: [-6, -4.5, -6],
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hidden lg:block w-72 h-96 border-2 border-[#FF4D00] bg-black p-4 font-meta text-[10px] text-neutral-400 transform shadow-2xl"
            >
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
            </motion.div>

            {/* Paper Sheet 2: NEET Shift Blueprint */}
            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [3, 4.5, 3],
              }}
              transition={{
                duration: 5.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
              className="w-[88vw] max-w-xs sm:w-80 h-80 sm:h-96 border-2 border-white bg-black p-4 sm:p-5 font-meta text-[10px] text-neutral-400 transform shadow-2xl"
            >
              <div className="border-b border-white pb-2 mb-3 text-white font-bold flex justify-between">
                <span>NEET UG NATIONAL</span>
                <span>PHYSICS TRACK</span>
              </div>
              <div className="space-y-3 text-neutral-300 font-mono">
                <p>Poisson recurrence interval Δt = 3.2 yrs exceeded.</p>
                <div className="h-20 sm:h-24 border border-dashed border-[#FF4D00] flex items-center justify-center text-[#FF4D00] font-headline text-base sm:text-lg">
                  P(k) = λᵏ e⁻ᵏ / k!
                </div>
                <div className="flex justify-between text-white font-bold pt-1 text-[9px] sm:text-[10px]">
                  <span>FREQUENCY: HIGH</span>
                  <span className="text-[#FF4D00]">+4 MARKS AT STAKE</span>
                </div>
              </div>
            </motion.div>

            {/* Paper Sheet 3: Advanced Multi-Concept Matrix */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [-4, -2.5, -4],
              }}
              transition={{
                duration: 7.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
              className="hidden md:block w-72 h-96 border-2 border-[#FF4D00] bg-black p-4 font-meta text-[10px] text-neutral-400 transform shadow-2xl"
            >
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
            </motion.div>
          </div>

          {/* Clean 25% Black Overlay (NO BLUR) */}
          <div className="absolute inset-0 bg-black/25" />
        </div>
      </div>

      {/* TWO SOLID PARTING PANELS: Left #FF4D00, Right #000000 (SOLID, NEVER TRANSPARENT) */}
      <div className="absolute inset-0 pointer-events-none z-20 flex overflow-hidden">
        {/* Left Panel: Solid Orange #FF4D00 */}
        <motion.div
          style={{ x: leftPanelX }}
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
          style={{ x: rightPanelX }}
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
      {/* Closed: Centered at seam. Opens proportionally with scroll! */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Left half: "EXAM" */}
        <motion.div
          style={{
            x: examWordmarkX,
            opacity: wordmarkOpacity,
          }}
          className="w-1/2 text-right pr-1 sm:pr-2 font-headline text-[12vw] sm:text-[10.5vw] md:text-[9.5vw] lg:text-[8.5vw] leading-[0.85] select-none whitespace-nowrap text-black"
        >
          EXAM
        </motion.div>

        {/* Right half: "SAATHI" */}
        <motion.div
          style={{
            x: saathiWordmarkX,
            opacity: wordmarkOpacity,
          }}
          className="w-1/2 text-left pl-1 sm:pl-2 font-headline text-[12vw] sm:text-[10.5vw] md:text-[9.5vw] lg:text-[8.5vw] leading-[0.85] select-none whitespace-nowrap text-white"
        >
          SAATHI
        </motion.div>
      </div>

      {/* HERO INTERACTIVE CONTENT (Revealed as panels open proportionally) */}
      <motion.div
        style={{
          opacity: heroInnerOpacity,
        }}
        className="relative z-25 w-full max-w-4xl mx-auto px-4 sm:px-8 pt-32 sm:pt-40 md:pt-44 pb-8 sm:pb-10 flex flex-col items-center justify-center text-center my-auto pointer-events-auto"
      >
        <motion.div
          style={{
            opacity: heroContentOpacity,
            y: heroContentY,
            scale: heroContentScale,
          }}
          className="space-y-4 sm:space-y-5 max-w-3xl mx-auto flex flex-col items-center"
        >
          {/* Exam Saathi in Orange and White */}
          <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.9] select-none">
            <span className="text-[#FF4D00]">EXAM </span>
            <span className="text-white">SAATHI</span>
          </h1>

          {/* Tagline */}
          <div className="font-meta text-[11px] sm:text-xs md:text-sm text-white tracking-[0.05em] uppercase font-bold border-2 border-[#FF4D00] bg-black px-3 py-1.5 sm:px-4 sm:py-2 inline-block">
            PATTERN-BASED EXAM PREP FOR INDIAN STUDENTS
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-base md:text-lg font-medium text-neutral-200 leading-snug max-w-2xl mx-auto px-2">
            Stop guessing what comes in your exam. Surgical PYQ frequency intelligence,
            overdue recurrence gap alerts, and KaTeX cheat sheets for Indian students.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-sm sm:max-w-none px-2 sm:px-0">
            <Link
              href="/signup"
              className="bg-[#FF4D00] text-black px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-black font-headline text-sm sm:text-base md:text-lg hover:bg-white hover:text-black transition-all inline-flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#FFFFFF] active:translate-y-0.5"
            >
              <span>CREATE A NEW ACCOUNT</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="/analyzer/jee-main/modern-physics"
              className="bg-black text-white px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-white font-headline text-sm sm:text-base md:text-lg hover:bg-[#FF4D00] hover:text-black hover:border-black transition-all inline-flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#FF4D00] active:translate-y-0.5"
            >
              <span>SAMPLE ANALYZER</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>

          {/* Verified Metrics Row */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-meta text-[10px] sm:text-xs text-neutral-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FF4D00] inline-block shrink-0"></span>
              <span>JEE MAIN • NEET • ADVANCED • CBSE</span>
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="text-[#FF4D00] font-bold">
              MAE 0.48 QS // SPEARMAN RHO 0.85
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* BOTTOM HERO BAR & ROTATING SCROLL INDICATOR */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between border-t-2 border-neutral-800 bg-transparent">
        <div className="font-meta text-xs flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="text-[#FF4D00] font-bold">
            // INTERACTIVE PORTAL
          </span>
          <span className="text-neutral-300 font-mono text-[10px] sm:text-xs">
            STATUS: {statusText}
          </span>
        </div>

        {/* Rotating Circular Indicator */}
        <div
          id="portal-toggle-button"
          onClick={toggleParting}
          className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center select-none cursor-pointer hover:scale-105 transition-transform shrink-0"
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
          <div className="absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF4D00] border-2 border-black flex items-center justify-center">
            {isFullyOpen ? (
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black animate-bounce" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black transform rotate-90" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
