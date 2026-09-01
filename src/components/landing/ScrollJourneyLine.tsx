"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoginPromptModal } from "@/components/ui/LoginPromptModal";
import { LiquidEther } from "@/components/ui/LiquidEther";

const STOPS = [
  {
    id: 1,
    label: "STEP 01",
    title: "Chapter Analyzer",
    desc: "Poisson recurrence scoring across 15+ years of JEE & CBSE shifts. Know exactly what to study.",
    tag: "PREDICT",
    href: "/analyzer/jee-main/modern-physics",
    side: "left",
  },
  {
    id: 2,
    label: "STEP 02",
    title: "Formula Engine",
    desc: "Every high-yield formula with LaTeX rendering, derivation snippets, and PYQ examples.",
    tag: "MASTER",
    href: "/formulas/jee-main/physics",
    side: "right",
  },
  {
    id: 3,
    label: "STEP 03",
    title: "AI Socratic Tutor",
    desc: "Ask your AI mentor anything. It reads your prep status and builds a personalised plan.",
    tag: "PLAN",
    href: "/assistant",
    side: "left",
  },
  {
    id: 4,
    label: "STEP 04",
    title: "My Prep Hub",
    desc: "Track mastery per topic, flag weak spots with marks at stake, and watch your readiness climb.",
    tag: "TRACK",
    href: "/my-dashboard",
    side: "right",
  },
];

// SVG viewport
const W = 1000;
const H = 900;

// Winding path: 4 stops connected by cubic bezier curves
// Starts top-center, snakes left-right alternating, ends bottom-center
const PATH_D = `
  M 500 40
  C 500 100, 820 120, 820 200
  C 820 280, 500 300, 500 340
  C 500 380, 820 400, 820 440
  C 820 520, 180 520, 180 600
  C 180 680, 500 700, 500 740
  C 500 780, 180 800, 180 840
  C 180 880, 500 880, 500 900
`.trim();

// Stop positions along the path (approximate x,y of each milestone dot)
const STOP_POSITIONS = [
  { x: 820, y: 200 },  // stop 1 — right
  { x: 180, y: 520 },  // stop 2 — left
  { x: 820, y: 440 },  // stop 3 — right  (re-adjusted to visible junction)
  { x: 180, y: 840 },  // stop 4 — left
];

// Re-map: which scroll progress (0–1 within section) triggers each dot
const STOP_THRESHOLDS = [0.22, 0.45, 0.65, 0.88];

export function ScrollJourneyLine() {
  const { user } = useAuth();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const h = () => setPrefersReduced(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const handleGatedNav = useCallback((href: string) => {
    if (user) {
      router.push(href);
    } else {
      setShowLogin(true);
    }
  }, [user, router]);

  // Scroll progress scoped to THIS section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22 });
  const pathLength = prefersReduced ? 1 : smooth;

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-24 overflow-hidden"
    >
      {/* ── Interactive WebGL Fluid Simulation Background (Kinetic Orange Theme) ── */}
      <div className="absolute inset-0 z-0 opacity-45 pointer-events-auto overflow-hidden">
        <LiquidEther
          colors={["#FF4D00", "#FF7A00", "#FF2600", "#FFA07A", "#330A00"]}
          mouseForce={32}
          cursorSize={130}
          autoDemo={true}
          autoSpeed={0.55}
          autoIntensity={2.4}
          resolution={0.55}
          BFECC={true}
        />
      </div>

      {/* Subtle vignette overlay so text & SVG stay razor sharp */}
      <div className="absolute inset-0 pointer-events-none z-1 bg-radial from-transparent via-black/30 to-black/85" />

      {/* Section header */}
      <div className="relative z-10 text-center mb-0 px-6">
        <span className="font-meta text-[#FF4D00] text-xs font-bold tracking-widest block mb-3">
          // HOW EXAMSAATHI WORKS
        </span>
        <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-white leading-none tracking-tighter">
          YOUR EXAM<br />
          <span className="text-[#FF4D00]">JOURNEY MAP</span>
        </h2>
      </div>

      {/* SVG Journey */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4" style={{ minHeight: `${H * 0.72}px` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto"
          aria-hidden="true"
        >
          {/* Ghost track */}
          <path
            d={PATH_D}
            stroke="rgba(255,77,0,0.12)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Animated draw path */}
          <motion.path
            d={PATH_D}
            stroke="#FF4D00"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              pathLength,
              willChange: "stroke-dashoffset",
            }}
          />

          {/* Start dot */}
          <motion.circle
            cx={500} cy={40} r={8}
            fill="#FF4D00"
            style={{ opacity: useTransform(smooth, [0, 0.05], [0, 1]) }}
          />

          {/* Milestone stop dots + content */}
          {STOPS.map((stop, i) => {
            const pos = STOP_POSITIONS[i];
            const threshold = STOP_THRESHOLDS[i];
            return (
              <StopNode
                key={stop.id}
                stop={stop}
                pos={pos}
                threshold={threshold}
                smooth={smooth}
                w={W}
              />
            );
          })}

          {/* End dot at bottom */}
          <motion.circle
            cx={500} cy={900} r={10}
            fill="none"
            stroke="#FF4D00"
            strokeWidth="3"
            style={{ opacity: useTransform(smooth, [0.92, 1], [0, 1]) }}
          />
          <motion.circle
            cx={500} cy={900} r={4}
            fill="#FF4D00"
            style={{ opacity: useTransform(smooth, [0.92, 1], [0, 1]) }}
          />
        </svg>

        {/* HTML content cards overlaid — absolutely positioned matching SVG coordinates */}
        <div className="absolute inset-0 pointer-events-none">
          {STOPS.map((stop, i) => (
            <ContentCard
              key={stop.id}
              stop={stop}
              posPercent={{
                x: STOP_POSITIONS[i].x / W,
                y: STOP_POSITIONS[i].y / H,
              }}
              threshold={STOP_THRESHOLDS[i]}
              smooth={smooth}
              onExplore={handleGatedNav}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="relative z-10 text-center mt-8 px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button
          onClick={() => handleGatedNav("/dashboard/jee-main/physics")}
          className="inline-flex items-center gap-3 bg-[#FF4D00] text-black px-8 py-4 font-headline text-base border-2 border-[#FF4D00] hover:bg-black hover:text-[#FF4D00] transition-colors cursor-pointer"
        >
          <span>{user ? "BEGIN YOUR JOURNEY" : "LOGIN TO BEGIN YOUR JOURNEY"}</span>
          <span className="text-xl">→</span>
        </button>
      </motion.div>

      {/* Auth Gate Modal */}
      <LoginPromptModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        title="LOGIN TO BEGIN JOURNEY"
        message="Please sign in or create a free account to track your syllabus mastery, explore predictive models, and access all exam tools."
      />
    </section>
  );
}

// ─── SVG Stop Node ─────────────────────────────────────────────────────────────
function StopNode({ stop, pos, threshold, smooth, w }: {
  stop: typeof STOPS[0];
  pos: { x: number; y: number };
  threshold: number;
  smooth: any;
  w: number;
}) {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const unsub = smooth.on("change", (v: number) => setLit(v >= threshold - 0.02));
    return unsub;
  }, [smooth, threshold]);

  return (
    <g>
      {/* Outer pulse ring */}
      <motion.circle
        cx={pos.x} cy={pos.y} r={14}
        fill="none"
        stroke={lit ? "#FF4D00" : "rgba(255,77,0,0.2)"}
        strokeWidth="1.5"
        animate={{ r: lit ? 14 : 10, opacity: lit ? 1 : 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ willChange: "transform" }}
      />
      {/* Inner fill dot */}
      <motion.circle
        cx={pos.x} cy={pos.y} r={6}
        fill={lit ? "#FF4D00" : "rgba(255,77,0,0.2)"}
        animate={{ r: lit ? 6 : 4 }}
        transition={{ duration: 0.4 }}
      />
      {/* Step label */}
      <motion.text
        x={pos.x} y={pos.y - 22}
        textAnchor="middle"
        fontSize="9"
        fontFamily="monospace"
        fontWeight="800"
        letterSpacing="0.12em"
        fill={lit ? "#FF4D00" : "rgba(255,77,0,0.3)"}
        animate={{ opacity: lit ? 1 : 0.3 }}
        transition={{ duration: 0.4 }}
      >
        {stop.label}
      </motion.text>
    </g>
  );
}

// ─── HTML Content Card ─────────────────────────────────────────────────────────
function ContentCard({ stop, posPercent, threshold, smooth, onExplore }: {
  stop: typeof STOPS[0];
  posPercent: { x: number; y: number };
  threshold: number;
  smooth: any;
  onExplore: (href: string) => void;
}) {
  const opacity = useTransform(smooth, [threshold - 0.08, threshold + 0.05], [0, 1]);
  const y = useTransform(smooth, [threshold - 0.08, threshold + 0.05], [16, 0]);
  const isLeft = stop.side === "left"; // content side

  // Offset: card appears left or right of the dot
  const cardOffsetX = isLeft
    ? `calc(${posPercent.x * 100}% - 240px)` // push card left
    : `calc(${posPercent.x * 100}% + 20px)`;  // push card right

  return (
    <motion.div
      style={{
        position: "absolute",
        top: `${posPercent.y * 100}%`,
        left: cardOffsetX,
        translateY: "-50%",
        opacity,
        y,
        willChange: "transform, opacity",
        pointerEvents: "auto",
        width: 200,
      }}
    >
      <div className="border-2 border-[#FF4D00] bg-neutral-950 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-meta text-[#FF4D00] text-[9px] font-bold tracking-widest">
            {stop.tag}
          </span>
        </div>
        <h4 className="font-headline text-sm text-white leading-tight mb-2">
          {stop.title}
        </h4>
        <p className="font-meta text-[10px] text-neutral-500 leading-relaxed mb-3">
          {stop.desc}
        </p>
        <button
          onClick={() => onExplore(stop.href)}
          className="font-meta text-[10px] text-[#FF4D00] font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          EXPLORE →
        </button>
      </div>
    </motion.div>
  );
}
