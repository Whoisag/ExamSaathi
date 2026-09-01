"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Zap, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoginPromptModal } from "@/components/ui/LoginPromptModal";

interface RadarEntry {
  exam: string;
  subject: string;
  chapter: string;
  probability: number;
  trend: "RISING" | "CRITICAL" | "STABLE" | "OVERDUE";
  marksAtStake: number;
  daysToExam: number;
  url: string;
  tag: string;
}

const RADAR_DATA: RadarEntry[] = [
  // === JEE MAIN 2026 HIGH-YIELD SYLLABUS ===
  // Physics (JEE Main)
  { exam: "JEE MAIN", subject: "PHYSICS", chapter: "Dual Nature of Radiation & Matter", probability: 98, trend: "CRITICAL", marksAtStake: 12, daysToExam: 142, url: "/analyzer/jee-main/dual-nature", tag: "MODERN PHYSICS" },
  { exam: "JEE MAIN", subject: "PHYSICS", chapter: "System of Particles & Rotational Dynamics", probability: 94, trend: "CRITICAL", marksAtStake: 12, daysToExam: 142, url: "/analyzer/jee-main/rotational-motion", tag: "MECHANICS" },
  { exam: "JEE MAIN", subject: "PHYSICS", chapter: "Current Electricity & Circuit Networks", probability: 96, trend: "RISING", marksAtStake: 12, daysToExam: 142, url: "/analyzer/jee-main/current-electricity", tag: "ELECTRODYNAMICS" },
  { exam: "JEE MAIN", subject: "PHYSICS", chapter: "Semiconductor Electronics & Logic Gates", probability: 97, trend: "CRITICAL", marksAtStake: 4, daysToExam: 142, url: "/analyzer/jee-main/semiconductors", tag: "MODERN PHYSICS" },
  { exam: "JEE MAIN", subject: "PHYSICS", chapter: "Thermodynamics & Kinetic Theory of Gases", probability: 91, trend: "STABLE", marksAtStake: 8, daysToExam: 142, url: "/analyzer/jee-main/thermodynamics", tag: "THERMAL PHYSICS" },
  { exam: "JEE MAIN", subject: "PHYSICS", chapter: "Ray Optics & Optical Instruments", probability: 89, trend: "OVERDUE", marksAtStake: 8, daysToExam: 142, url: "/analyzer/jee-main/ray-optics", tag: "OPTICS" },
  { exam: "JEE MAIN", subject: "PHYSICS", chapter: "Electrostatics & Capacitance", probability: 92, trend: "RISING", marksAtStake: 12, daysToExam: 142, url: "/analyzer/jee-main/electrostatics", tag: "ELECTRODYNAMICS" },

  // Chemistry (JEE Main)
  { exam: "JEE MAIN", subject: "CHEMISTRY", chapter: "Electrochemistry & Nernst Equation", probability: 95, trend: "CRITICAL", marksAtStake: 12, daysToExam: 142, url: "/analyzer/jee-main/electrochemistry", tag: "PHYSICAL CHEM" },
  { exam: "JEE MAIN", subject: "CHEMISTRY", chapter: "Coordination Compounds: CFT & Isomerism", probability: 94, trend: "CRITICAL", marksAtStake: 8, daysToExam: 142, url: "/analyzer/jee-main/coordination-compounds", tag: "INORGANIC CHEM" },
  { exam: "JEE MAIN", subject: "CHEMISTRY", chapter: "Chemical Kinetics & Arrhenius Equation", probability: 93, trend: "RISING", marksAtStake: 8, daysToExam: 142, url: "/analyzer/jee-main/chemical-kinetics", tag: "PHYSICAL CHEM" },
  { exam: "JEE MAIN", subject: "CHEMISTRY", chapter: "Aldehydes, Ketones & Carboxylic Acids", probability: 96, trend: "CRITICAL", marksAtStake: 12, daysToExam: 142, url: "/analyzer/jee-main/aldehydes-ketones", tag: "ORGANIC CHEM" },
  { exam: "JEE MAIN", subject: "CHEMISTRY", chapter: "Chemical Bonding & Molecular Structure", probability: 98, trend: "CRITICAL", marksAtStake: 12, daysToExam: 142, url: "/analyzer/jee-main/chemical-bonding", tag: "INORGANIC CHEM" },
  { exam: "JEE MAIN", subject: "CHEMISTRY", chapter: "Solutions & Colligative Properties", probability: 90, trend: "STABLE", marksAtStake: 8, daysToExam: 142, url: "/analyzer/jee-main/solutions", tag: "PHYSICAL CHEM" },
  { exam: "JEE MAIN", subject: "CHEMISTRY", chapter: "Haloalkanes & Haloarenes: SN1/SN2", probability: 88, trend: "OVERDUE", marksAtStake: 8, daysToExam: 142, url: "/analyzer/jee-main/haloalkanes", tag: "ORGANIC CHEM" },

  // Mathematics (JEE Main)
  { exam: "JEE MAIN", subject: "MATHEMATICS", chapter: "Definite Integrals & King's Property", probability: 98, trend: "CRITICAL", marksAtStake: 16, daysToExam: 142, url: "/analyzer/jee-main/integrals", tag: "CALCULUS" },
  { exam: "JEE MAIN", subject: "MATHEMATICS", chapter: "Three Dimensional Geometry: Skew Lines & Planes", probability: 97, trend: "CRITICAL", marksAtStake: 12, daysToExam: 142, url: "/analyzer/jee-main/three-d-geometry", tag: "VECTORS & 3D" },
  { exam: "JEE MAIN", subject: "MATHEMATICS", chapter: "Matrices & System of Linear Equations", probability: 96, trend: "CRITICAL", marksAtStake: 12, daysToExam: 142, url: "/analyzer/jee-main/matrices-determinants", tag: "ALGEBRA" },
  { exam: "JEE MAIN", subject: "MATHEMATICS", chapter: "Probability: Bayes' Theorem & Distributions", probability: 93, trend: "RISING", marksAtStake: 8, daysToExam: 142, url: "/analyzer/jee-main/probability", tag: "PROBABILITY" },
  { exam: "JEE MAIN", subject: "MATHEMATICS", chapter: "Conic Sections: Parabola, Ellipse & Hyperbola", probability: 95, trend: "CRITICAL", marksAtStake: 12, daysToExam: 142, url: "/analyzer/jee-main/conic-sections", tag: "COORDINATE GEOM" },
  { exam: "JEE MAIN", subject: "MATHEMATICS", chapter: "Application of Derivatives: Maxima & Minima", probability: 91, trend: "STABLE", marksAtStake: 8, daysToExam: 142, url: "/analyzer/jee-main/application-of-derivatives", tag: "CALCULUS" },
  { exam: "JEE MAIN", subject: "MATHEMATICS", chapter: "Vector Algebra & Scalar/Vector Triple Products", probability: 90, trend: "OVERDUE", marksAtStake: 8, daysToExam: 142, url: "/analyzer/jee-main/vectors", tag: "VECTORS & 3D" },

  // === CBSE CLASS 12 BOARDS 2026 SYLLABUS ===
  // Physics (CBSE 12)
  { exam: "CBSE 12", subject: "PHYSICS", chapter: "Electric Charges and Fields (Gauss Law)", probability: 98, trend: "CRITICAL", marksAtStake: 8, daysToExam: 165, url: "/analyzer/cbse-12/electric-charges", tag: "ELECTROSTATICS" },
  { exam: "CBSE 12", subject: "PHYSICS", chapter: "Current Electricity: Drift Velocity & Kirchhoff", probability: 97, trend: "CRITICAL", marksAtStake: 9, daysToExam: 165, url: "/analyzer/cbse-12/current-electricity", tag: "CURRENT ELECTRICITY" },
  { exam: "CBSE 12", subject: "PHYSICS", chapter: "Ray Optics: Lens Maker Formula & Instruments", probability: 96, trend: "CRITICAL", marksAtStake: 9, daysToExam: 165, url: "/analyzer/cbse-12/ray-optics", tag: "OPTICS" },
  { exam: "CBSE 12", subject: "PHYSICS", chapter: "Wave Optics: Huygens Wavefront & YDSE", probability: 94, trend: "RISING", marksAtStake: 8, daysToExam: 165, url: "/analyzer/cbse-12/wave-optics", tag: "OPTICS" },
  { exam: "CBSE 12", subject: "PHYSICS", chapter: "Moving Charges & Magnetism: Biot-Savart Law", probability: 93, trend: "RISING", marksAtStake: 7, daysToExam: 165, url: "/analyzer/cbse-12/moving-charges", tag: "MAGNETISM" },
  { exam: "CBSE 12", subject: "PHYSICS", chapter: "Electromagnetic Induction: Motional EMF", probability: 91, trend: "OVERDUE", marksAtStake: 6, daysToExam: 165, url: "/analyzer/cbse-12/emi", tag: "INDUCTION" },
  { exam: "CBSE 12", subject: "PHYSICS", chapter: "Alternating Current: LCR Resonance & Transformers", probability: 92, trend: "STABLE", marksAtStake: 6, daysToExam: 165, url: "/analyzer/cbse-12/ac", tag: "AC CIRCUITS" },
  { exam: "CBSE 12", subject: "PHYSICS", chapter: "Semiconductor Electronics: Diodes & Rectifiers", probability: 95, trend: "CRITICAL", marksAtStake: 7, daysToExam: 165, url: "/analyzer/cbse-12/semiconductors", tag: "SEMICONDUCTORS" },

  // Chemistry (CBSE 12)
  { exam: "CBSE 12", subject: "CHEMISTRY", chapter: "Solutions: Raoult's Law & Colligative Properties", probability: 97, trend: "CRITICAL", marksAtStake: 7, daysToExam: 165, url: "/analyzer/cbse-12/solutions", tag: "PHYSICAL CHEM" },
  { exam: "CBSE 12", subject: "CHEMISTRY", chapter: "Electrochemistry: Nernst Equation & Kohlrausch", probability: 98, trend: "CRITICAL", marksAtStake: 9, daysToExam: 165, url: "/analyzer/cbse-12/electrochemistry", tag: "PHYSICAL CHEM" },
  { exam: "CBSE 12", subject: "CHEMISTRY", chapter: "Chemical Kinetics: Integrated Rate Law & Order", probability: 95, trend: "RISING", marksAtStake: 7, daysToExam: 165, url: "/analyzer/cbse-12/chemical-kinetics", tag: "PHYSICAL CHEM" },
  { exam: "CBSE 12", subject: "CHEMISTRY", chapter: "Aldehydes, Ketones & Carboxylic Acids", probability: 99, trend: "CRITICAL", marksAtStake: 8, daysToExam: 165, url: "/analyzer/cbse-12/aldehydes-ketones", tag: "ORGANIC CHEM" },
  { exam: "CBSE 12", subject: "CHEMISTRY", chapter: "Coordination Compounds: CFT & Nomenclature", probability: 94, trend: "RISING", marksAtStake: 7, daysToExam: 165, url: "/analyzer/cbse-12/coordination-compounds", tag: "INORGANIC CHEM" },
  { exam: "CBSE 12", subject: "CHEMISTRY", chapter: "d and f-Block Elements: Transition Properties", probability: 92, trend: "STABLE", marksAtStake: 7, daysToExam: 165, url: "/analyzer/cbse-12/d-f-block", tag: "INORGANIC CHEM" },
  { exam: "CBSE 12", subject: "CHEMISTRY", chapter: "Amines: Hoffmann Bromamide & Basicity Order", probability: 93, trend: "RISING", marksAtStake: 6, daysToExam: 165, url: "/analyzer/cbse-12/amines", tag: "ORGANIC CHEM" },
  { exam: "CBSE 12", subject: "CHEMISTRY", chapter: "Biomolecules: Glucose Structure, Proteins & DNA", probability: 90, trend: "OVERDUE", marksAtStake: 7, daysToExam: 165, url: "/analyzer/cbse-12/biomolecules", tag: "BIOCHEMISTRY" },

  // Mathematics (CBSE 12)
  { exam: "CBSE 12", subject: "MATHEMATICS", chapter: "Integrals: King's Property & Partial Fractions", probability: 98, trend: "CRITICAL", marksAtStake: 10, daysToExam: 165, url: "/analyzer/cbse-12/integrals", tag: "CALCULUS" },
  { exam: "CBSE 12", subject: "MATHEMATICS", chapter: "Matrices & Determinants: System of Equations", probability: 97, trend: "CRITICAL", marksAtStake: 10, daysToExam: 165, url: "/analyzer/cbse-12/matrices-determinants", tag: "ALGEBRA" },
  { exam: "CBSE 12", subject: "MATHEMATICS", chapter: "Probability: Bayes' Theorem & Total Probability", probability: 100, trend: "CRITICAL", marksAtStake: 8, daysToExam: 165, url: "/analyzer/cbse-12/probability", tag: "PROBABILITY" },
  { exam: "CBSE 12", subject: "MATHEMATICS", chapter: "Three Dimensional Geometry: Shortest Distance", probability: 96, trend: "CRITICAL", marksAtStake: 8, daysToExam: 165, url: "/analyzer/cbse-12/three-d-geometry", tag: "VECTORS & 3D" },
  { exam: "CBSE 12", subject: "MATHEMATICS", chapter: "Application of Derivatives: Maxima/Minima Word Problems", probability: 95, trend: "RISING", marksAtStake: 8, daysToExam: 165, url: "/analyzer/cbse-12/application-of-derivatives", tag: "CALCULUS" },
  { exam: "CBSE 12", subject: "MATHEMATICS", chapter: "Linear Programming: Corner Point Method", probability: 99, trend: "CRITICAL", marksAtStake: 5, daysToExam: 165, url: "/analyzer/cbse-12/linear-programming", tag: "LPP" },
  { exam: "CBSE 12", subject: "MATHEMATICS", chapter: "Differential Equations: Linear & Homogeneous DE", probability: 92, trend: "STABLE", marksAtStake: 6, daysToExam: 165, url: "/analyzer/cbse-12/differential-equations", tag: "CALCULUS" },
  { exam: "CBSE 12", subject: "MATHEMATICS", chapter: "Vector Algebra: Dot & Cross Product Proofs", probability: 91, trend: "OVERDUE", marksAtStake: 6, daysToExam: 165, url: "/analyzer/cbse-12/vectors", tag: "VECTORS & 3D" },
];

const TREND_CONFIG = {
  RISING:   { color: "#FF4D00", bg: "bg-[#FF4D00] text-black", icon: <TrendingUp className="w-3 h-3" /> },
  CRITICAL: { color: "#ff0000", bg: "bg-red-600 text-white",   icon: <AlertTriangle className="w-3 h-3" /> },
  STABLE:   { color: "#ffffff", bg: "bg-neutral-700 text-white", icon: <Zap className="w-3 h-3" /> },
  OVERDUE:  { color: "#facc15", bg: "bg-yellow-400 text-black", icon: <Clock className="w-3 h-3" /> },
};

// Animated split-flap digit for the probability number
function FlipNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      setFlipping(true);
      const t = setTimeout(() => { setDisplayed(value); setFlipping(false); prev.current = value; }, 150);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <motion.span
      key={displayed}
      animate={{ rotateX: flipping ? [0, 90, 0] : 0, opacity: flipping ? [1, 0, 1] : 1 }}
      transition={{ duration: 0.3 }}
      style={{ display: "inline-block", transformOrigin: "center", fontVariantNumeric: "tabular-nums" }}
    >
      {displayed}
    </motion.span>
  );
}

export function ChapterRadarBoard() {
  const { user } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [examFilter, setExamFilter] = useState<"ALL" | "JEE MAIN" | "CBSE 12">("ALL");
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filtered = examFilter === "ALL" ? RADAR_DATA : RADAR_DATA.filter(d => d.exam === examFilter);
  const active = filtered[activeIndex % filtered.length];

  // Gated navigation — shows login modal if not logged in
  const handleGatedNav = (url: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    if (user) {
      router.push(url);
    } else {
      setShowLoginModal(true);
    }
  };

  // Auto-cycle
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex(i => (i + 1) % filtered.length);
    }, 3200);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [filtered.length, isPaused]);

  // Reset index when filter changes
  useEffect(() => { setActiveIndex(0); }, [examFilter]);

  return (
    <>
      <section className="bg-black border-t-4 border-b-4 border-[#FF4D00] py-16 px-4 md:px-8 overflow-hidden relative">
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
      }} />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
              <span className="font-meta text-[#FF4D00] text-xs font-bold tracking-widest">LIVE EXAM INTELLIGENCE RADAR</span>
            </div>
            <h2 className="font-headline text-4xl sm:text-5xl text-white tracking-tighter leading-none">
              CHAPTER<br />
              <span className="text-[#FF4D00]">THREAT BOARD</span>
            </h2>
            <p className="font-meta text-neutral-500 text-xs mt-2 max-w-xs">
              High-probability chapters ranked by Poisson recurrence and cyclic gap analysis.
            </p>
          </div>

          {/* Exam filter pills */}
          <div className="flex gap-2 font-meta text-xs">
            {(["ALL", "JEE MAIN", "CBSE 12"] as const).map(f => (
              <button
                key={f}
                onClick={() => setExamFilter(f)}
                className={`px-4 py-2 border-2 font-bold transition-all cursor-pointer ${
                  examFilter === f
                    ? "bg-[#FF4D00] text-black border-[#FF4D00]"
                    : "bg-transparent text-neutral-400 border-neutral-700 hover:border-white hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT: Big featured card */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active.exam}-${active.subject}-${active.chapter}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="border-2 border-[#FF4D00] bg-neutral-950 h-full flex flex-col p-6 relative overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF4D00] clip-corner" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

                {/* Exam + trend badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-meta text-[10px] bg-white text-black px-2 py-0.5 font-bold">{active.exam}</span>
                  <span className={`font-meta text-[10px] px-2 py-0.5 font-bold flex items-center gap-1 ${TREND_CONFIG[active.trend].bg}`}>
                    {TREND_CONFIG[active.trend].icon} {active.trend}
                  </span>
                </div>

                {/* Subject tag */}
                <span className="font-meta text-[10px] text-[#FF4D00] font-bold tracking-widest mb-2">{active.tag}</span>

                {/* Chapter name */}
                <h3 className="font-headline text-2xl text-white leading-tight mb-4">{active.chapter}</h3>

                {/* Giant probability */}
                <div className="flex items-end gap-2 mb-1">
                  <span className="font-headline text-7xl text-[#FF4D00] leading-none tabular-nums">
                    <FlipNumber value={active.probability} />
                  </span>
                  <span className="font-headline text-3xl text-neutral-600 mb-2">%</span>
                </div>
                <p className="font-meta text-[10px] text-neutral-500 mb-6">PREDICTED SHIFT PROBABILITY</p>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 mt-auto mb-5">
                  <div className="border border-neutral-800 p-3">
                    <p className="font-meta text-[9px] text-neutral-500 mb-1">MARKS AT STAKE</p>
                    <p className="font-headline text-xl text-white">+{active.marksAtStake}</p>
                  </div>
                  <div className="border border-neutral-800 p-3">
                    <p className="font-meta text-[9px] text-neutral-500 mb-1">DAYS TO EXAM</p>
                    <p className="font-headline text-xl text-white">{active.daysToExam}</p>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={(e) => handleGatedNav(active.url, e)}
                  className="w-full flex items-center justify-between bg-[#FF4D00] text-black px-4 py-3 font-headline text-sm hover:bg-white transition-colors group cursor-pointer"
                >
                  <span>{user ? "OPEN FULL ANALYSIS" : "LOGIN TO VIEW ANALYSIS"}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                {/* Pause indicator */}
                {isPaused && (
                  <div className="absolute bottom-16 right-4 font-meta text-[9px] text-neutral-600">PAUSED</div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Scrolling ticker rows */}
          <div className="lg:col-span-3 flex flex-col gap-0">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-2 border border-neutral-800 bg-neutral-900 font-meta text-[9px] text-neutral-500 tracking-widest mb-0.5 shrink-0">
              <span className="col-span-1">#</span>
              <span className="col-span-4">CHAPTER</span>
              <span className="col-span-2">EXAM</span>
              <span className="col-span-2 text-center">PROB %</span>
              <span className="col-span-2 text-center">MARKS</span>
              <span className="col-span-1" />
            </div>

            {/* Scrollable chapter list */}
            <div className="max-h-[500px] overflow-y-auto divide-y divide-neutral-900 border border-neutral-900 bg-black">
              {filtered.map((entry, idx) => {
                const isActive = idx === (activeIndex % filtered.length);
                return (
                  <motion.div
                    key={`${entry.exam}-${entry.subject}-${entry.chapter}`}
                    layout
                    animate={{ backgroundColor: isActive ? "#1a0800" : "#0a0a0a" }}
                    transition={{ duration: 0.3 }}
                    className={`grid grid-cols-12 gap-2 px-3 py-3 cursor-pointer items-center group hover:bg-neutral-900 transition-colors ${isActive ? "border-l-2 border-l-[#FF4D00]" : "border-l-2 border-l-transparent"}`}
                    onClick={() => { setActiveIndex(idx); setIsPaused(true); setTimeout(() => setIsPaused(false), 5000); }}
                  >
                    {/* Rank */}
                    <span className={`col-span-1 font-headline text-sm ${isActive ? "text-[#FF4D00]" : "text-neutral-700"}`}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    {/* Chapter */}
                    <div className="col-span-4">
                      <p className={`font-headline text-xs leading-tight ${isActive ? "text-white" : "text-neutral-400 group-hover:text-white"} transition-colors`}>
                        {entry.chapter}
                      </p>
                      <span className="font-meta text-[9px] text-neutral-600">{entry.subject}</span>
                    </div>

                    {/* Exam */}
                    <span className="col-span-2 font-meta text-[9px] text-neutral-500">{entry.exam}</span>

                    {/* Probability bar */}
                    <div className="col-span-2 flex flex-col items-center gap-1">
                      <span className={`font-headline text-sm tabular-nums ${isActive ? "text-[#FF4D00]" : "text-neutral-300"}`}>
                        {entry.probability}%
                      </span>
                      <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#FF4D00] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${entry.probability}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Marks */}
                    <div className="col-span-2 flex justify-center">
                      <span className={`font-meta text-[10px] font-bold px-2 py-0.5 ${TREND_CONFIG[entry.trend].bg}`}>
                        +{entry.marksAtStake}M
                      </span>
                    </div>

                    {/* Arrow */}
                    <button
                      className="col-span-1 flex justify-end cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); handleGatedNav(entry.url); }}
                    >
                      <ArrowUpRight className={`w-3.5 h-3.5 transition-all ${isActive ? "text-[#FF4D00]" : "text-neutral-700 group-hover:text-neutral-400"}`} />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Auto-progress bar at bottom */}
            <div className="mt-3 flex items-center gap-3">
              <span className="font-meta text-[9px] text-neutral-600">AUTO-CYCLING</span>
              <div className="flex-1 h-px bg-neutral-800 relative overflow-hidden">
                {!isPaused && (
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-[#FF4D00]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.2, ease: "linear", repeat: Infinity }}
                  />
                )}
              </div>
              <span className="font-meta text-[9px] text-neutral-600">{filtered.length} CHAPTERS</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <LoginPromptModal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
    />
    </>
  );
}
