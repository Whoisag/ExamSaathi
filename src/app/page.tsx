"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowRight, Terminal, Activity, Layers, Menu, X } from "lucide-react";
import { PortalHero } from "@/components/landing/PortalHero";
import { ChapterRadarBoard } from "@/components/landing/ChapterRadarBoard";
import { AntigravityH3 } from "@/components/ui/AntigravityH3";
import { LoginPromptModal } from "@/components/ui/LoginPromptModal";
import { AiAssistantPreviewModal } from "@/components/ui/AiAssistantPreviewModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ScrollJourneyLine } from "@/components/landing/ScrollJourneyLine";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const [aiPreviewOpen, setAiPreviewOpen] = React.useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = React.useState("");

  // Handle auth redirect if code is present in URL or user is already logged in
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        window.location.href = `/auth/callback?code=${encodeURIComponent(code)}&next=/my-dashboard`;
        return;
      }
    }
    if (user) {
      router.push("/my-dashboard");
    }
  }, [user, router]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const services = [
    {
      number: "01",
      title: "PREDICTIVE PYQ FREQUENCY",
      category: "PROBABILITY ENGINE",
      desc: "Dirichlet-multinomial distribution models calculate exact topic appearance chances across 20+ shifts per session.",
      tag: "JEE MAIN / NEET",
    },
    {
      number: "02",
      title: "CYCLIC RECURRENCE GAP ALERTS",
      category: "POISSON MODELING",
      desc: "Flag overdue subtopics that have skipped 2+ consecutive sessions and possess high mathematical return probability.",
      tag: "GAP DETECTION",
    },
    {
      number: "03",
      title: "HIGH-YIELD CONDENSED FORMULAS",
      category: "KATEX CHEAT SHEETS",
      desc: "Precision LaTeX sheets stripped of derivation bloat. Variable constraints, when-to-use heuristics, and student trap warnings.",
      tag: "PRINT READY",
    },
    {
      number: "04",
      title: "AI STRATEGY AUDIT & ASSISTANT",
      category: "CONTEXTUAL CHAT",
      desc: "Interact with an analytical mentor trained on syllabus shifts, rationalization cuts, and marks-at-risk analysis.",
      tag: "NEURAL ASSISTANT",
    },
  ];

  const storySteps = [
    {
      step: "PHASE 01",
      title: "HISTORICAL SHIFT HARVEST",
      body: "We digest 15+ years of official NTA and CBSE question papers across every slot, normalized against recent rationalized NCERT syllabi.",
      icon: Terminal,
    },
    {
      step: "PHASE 02",
      title: "STATISTICAL RECURRENCE AUDIT",
      body: "Our Poisson recurrence model pinpoints anomalous gaps: concepts historically tested every ~3.2 years that were completely skipped in 2023-2024.",
      icon: Activity,
    },
    {
      step: "PHASE 03",
      title: "TARGETED SCORE DOMINANCE",
      body: "Students convert blind revision loops into surgical sprints: focus on the top 20% of high-yield chapters that control 68% of examination marks.",
      icon: Layers,
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black font-sans selection:bg-[#FF4D00] selection:text-white">
      {/* 1. FIXED FLOATING BRUTALIST NAV (Always visible above portal) */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Logo */}
          <Link
            href="/"
            className="bg-black text-white px-4 py-2 border-brutal font-headline text-lg md:text-xl tracking-tight flex items-center gap-2 hover:bg-[#FF4D00] hover:text-black transition-colors"
          >
            <span>EXAMSAATHI</span>
            <span className="inline-block w-2.5 h-2.5 bg-[#FF4D00] border border-black group-hover:bg-black"></span>
          </Link>

          {/* Center Pill Navigation */}
          <nav className="hidden md:flex items-center bg-black p-1.5 rounded-full border-brutal shadow-none">
            <button
              onClick={() => {
                if (user) {
                  router.push("/assistant");
                } else {
                  setAiPreviewOpen(true);
                }
              }}
              className="px-4 py-1.5 font-meta text-white rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              [AI ASSISTANT]
            </button>
            <a
              href="#cracks-the-code"
              className="px-4 py-1.5 font-meta text-white rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              [EVALUATION]
            </a>
            <a
              href="#intelligence-stack"
              className="px-4 py-1.5 font-meta text-white rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              [METHODOLOGY]
            </a>
          </nav>

          {/* Auth & Mobile Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/login"
              className="inline-block bg-white text-black px-4 py-2 border-brutal font-meta text-xs font-bold hover:bg-[#FF4D00] hover:text-black transition-colors"
            >
              LOGIN
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-black text-white p-2 border-brutal hover:bg-[#FF4D00] hover:text-black transition-colors flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden max-w-7xl mx-auto mt-2 bg-black border-2 border-black text-white p-4 shadow-[6px_6px_0px_0px_#FF4D00] flex flex-col gap-2.5 pointer-events-auto"
            >
              <div className="text-[10px] text-[#FF4D00] font-mono font-bold tracking-wider">// NAVIGATION MENU</div>
              <div className="grid grid-cols-1 gap-1.5 font-meta text-xs">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (user) {
                      router.push("/assistant");
                    } else {
                      setAiPreviewOpen(true);
                    }
                  }}
                  className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 hover:bg-[#FF4D00] hover:text-black transition-colors flex items-center justify-between font-bold text-left cursor-pointer"
                >
                  <span>[AI STRATEGY ASSISTANT]</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href="#cracks-the-code"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 hover:bg-[#FF4D00] hover:text-black transition-colors flex items-center justify-between font-bold"
                >
                  <span>[ACCURACY EVALUATION]</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#intelligence-stack"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 hover:bg-[#FF4D00] hover:text-black transition-colors flex items-center justify-between font-bold"
                >
                  <span>[METHODOLOGY & WHITE PAPER]</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex items-center gap-2">
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
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. FULLSCREEN INTERACTIVE PORTAL HERO */}
      <PortalHero />

      {/* 3. CHAPTER THREAT BOARD — Live Exam Intelligence Radar */}
      <ChapterRadarBoard />

      {/* 3.5. SCROLL JOURNEY LINE — Winding SVG path showing how ExamSaathi works */}
      <ScrollJourneyLine />

      {/* 4. SKEWED MARQUEE SECTION (-2deg Skew, #000000 Background) */}
      <motion.section
        initial={{ opacity: 0.6, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1.05 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative py-14 bg-black overflow-hidden border-brutal-b -my-2 z-10 transform -rotate-2"
      >
        {/* Row 1: Orange 10vw Text Scrolling Left */}
        <div className="overflow-hidden whitespace-nowrap mb-4">
          <div className="animate-marquee-left flex items-center text-[#FF4D00] font-headline text-[9vw] md:text-[8vw] tracking-tighter">
            <span>JEE MAIN 2026</span>
            <span className="mx-6 text-white">•</span>
            <span>NEET UG 2026</span>
            <span className="mx-6 text-white">•</span>
            <span>CBSE CLASS 12</span>
            <span className="mx-6 text-white">•</span>
            <span>JEE ADVANCED</span>
            <span className="mx-6 text-white">•</span>
            <span>CUET ADMISSIONS</span>
            <span className="mx-6 text-white">•</span>
            <span>CBSE CLASS 10</span>
            <span className="mx-6 text-white">•</span>
          </div>
        </div>

        {/* Row 2: Reverse White Text Scrolling Right */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-marquee-right flex items-center text-white font-headline text-[9vw] md:text-[8vw] tracking-tighter">
            <span>PREDICTIVE PYQS</span>
            <span className="mx-6 text-[#FF4D00]">•</span>
            <span>RECURRENCE GAP ALERTS</span>
            <span className="mx-6 text-[#FF4D00]">•</span>
            <span>FORMULA PRECISION</span>
            <span className="mx-6 text-[#FF4D00]">•</span>
            <span>KATEX CHEATSHEETS</span>
            <span className="mx-6 text-[#FF4D00]">•</span>
            <span>ZERO ANXIETY</span>
            <span className="mx-6 text-[#FF4D00]">•</span>
          </div>
        </div>
      </motion.section>

      {/* 5. VERTICAL SERVICE LIST (Dark Section with Orange Accents) */}
      <section id="intelligence-stack" className="bg-black text-white py-24 px-4 md:px-8 border-brutal-b">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between border-brutal-b border-white pb-6 mb-12"
          >
            <div>
              <span className="font-meta text-xs text-[#FF4D00] font-bold">[ CORE CAPABILITIES ]</span>
              <h2 className="font-headline text-4xl sm:text-6xl md:text-7xl mt-2 tracking-tight text-white">
                THE INTELLIGENCE STACK
              </h2>
            </div>
            <p className="font-meta text-xs text-neutral-400 max-w-sm mt-4 md:mt-0">
              FOUR PROPRIETARY MODULES BUILT TO EXPOSE HIGH-YIELD PATTERNS ACROSS NTA & CBSE SHIFTS.
            </p>
          </motion.div>

          {/* List Items with Staggered Scroll-triggered Entrance */}
          <div className="divide-y-2 divide-neutral-800 border-brutal border-neutral-800">
            {services.map((svc, idx) => (
              <motion.div
                key={svc.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  onClick={() => {
                    if (user) {
                      router.push("/my-dashboard");
                    } else {
                      setSelectedServiceTitle(svc.title);
                      setLoginModalOpen(true);
                    }
                  }}
                  className="group block p-6 sm:p-10 hover:bg-[#FF4D00] transition-colors duration-200 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (user) {
                        router.push("/my-dashboard");
                      } else {
                        setSelectedServiceTitle(svc.title);
                        setLoginModalOpen(true);
                      }
                    }
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start md:items-center gap-6">
                      <span className="font-headline text-3xl sm:text-5xl text-[#FF4D00] group-hover:text-black transition-colors">
                        {svc.number}
                      </span>
                      <div>
                        <span className="font-meta text-xs text-neutral-400 group-hover:text-black transition-colors block mb-1">
                          // {svc.category} • {svc.tag}
                        </span>
                        <AntigravityH3
                          text={svc.title}
                          variant="hero"
                          className="text-2xl sm:text-4xl text-white group-hover:text-black group-hover:translate-x-2 transition-all duration-300"
                          stagger={0.02}
                          blurAmount={8}
                          yOffset={20}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 md:max-w-md">
                      <p className="text-sm text-neutral-400 group-hover:text-black transition-colors">
                        {svc.desc}
                      </p>
                      <button
                        type="button"
                        aria-label={`Access ${svc.title}`}
                        className="w-12 h-12 flex-shrink-0 border-brutal border-white group-hover:border-black bg-black group-hover:bg-white flex items-center justify-center group-hover:translate-x-2 transition-all cursor-pointer"
                      >
                        <ArrowRight className="w-6 h-6 text-[#FF4D00] group-hover:text-black transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PARALLAX & STICKY STORYTELLING (scroll-experience skill) */}
      <section id="cracks-the-code" className="py-24 px-4 md:px-8 bg-[#FF4D00] border-brutal-b">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 text-center max-w-3xl mx-auto"
          >
            <span className="font-meta text-xs text-black font-bold bg-white px-3 py-1 border-brutal inline-block mb-3">
              [ METHODOLOGICAL WORKFLOW ]
            </span>
            <h2 className="font-headline text-4xl sm:text-6xl text-black mt-2">
              HOW EXAMSAATHI CRACKS THE CODE
            </h2>
            <p className="font-medium text-black mt-4 text-base md:text-lg">
              High-stakes Indian exams do not pick questions randomly. Syllabus balance requirements, committee rotations, and difficulty constraints force predictable patterns.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storySteps.map((s, idx) => {
              const IconComp = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  whileHover={{ y: -8, scale: 1.02, boxShadow: "8px 8px 0px #000000" }}
                  transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white p-8 border-brutal relative flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-brutal-b">
                      <span className="font-meta text-xs font-bold text-[#FF4D00]">{s.step}</span>
                      <IconComp className="w-6 h-6 text-black group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                    </div>
                    <AntigravityH3
                      text={s.title}
                      variant="card"
                      className="text-2xl text-black mb-4 group-hover:text-[#FF4D00]"
                      stagger={0.024}
                      blurAmount={10}
                      yOffset={22}
                    />
                    <p className="text-sm text-neutral-700 leading-relaxed">{s.body}</p>
                  </div>

                  <div className="mt-8 pt-4 border-brutal-t flex items-center justify-between font-meta text-xs">
                    <span className="text-neutral-500">STATUS</span>
                    <span className="text-black font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#FF4D00] inline-block animate-pulse"></span>
                      VERIFIED PROTOCOL
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. GIANT BRUTALIST CTA */}
      <section id="study-smarter-cta" className="bg-[#FF4D00] py-24 px-4 md:px-8 border-brutal-b text-center overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-meta text-xs text-black font-bold bg-white px-3.5 py-1.5 border-brutal inline-block mb-4">
              [ NO CREDIT CARD • NO BACKEND SETUP ]
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 35, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline text-5xl sm:text-7xl md:text-8xl text-black mt-2 mb-8 tracking-tight leading-[0.88]"
          >
            STUDY SMARTER.<br />
            NOT HARDER.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-black font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Access the complete predictive analytics shell, chapter weightage heatmaps, KaTeX formula cheatsheets, and AI strategy assistant.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center pt-2"
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-black text-white px-12 py-5 border-brutal font-headline text-xl hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_#000000]"
              >
                <span>CREATE FREE ACCOUNT</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-black text-white py-14 px-4 md:px-8 border-brutal-t border-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div>
            <div className="font-headline text-2xl tracking-tight text-white flex items-center gap-2">
              <span>EXAMSAATHI</span>
              <span className="w-2.5 h-2.5 bg-[#FF4D00] inline-block"></span>
            </div>
            <p className="font-meta text-xs text-neutral-400 mt-2">
              PREDICTIVE PYQ INTELLIGENCE & ACADEMIC AUDIT SHELL FOR INDIA.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 font-meta text-xs">
            <button
              onClick={() => {
                if (user) {
                  router.push("/assistant");
                } else {
                  setAiPreviewOpen(true);
                }
              }}
              className="hover:text-[#FF4D00] transition-colors cursor-pointer"
            >
              [ASSISTANT]
            </button>
            <a href="#cracks-the-code" className="hover:text-[#FF4D00] transition-colors">
              [EVALUATION]
            </a>
            <a href="#intelligence-stack" className="hover:text-[#FF4D00] transition-colors">
              [METHODOLOGY]
            </a>
          </div>

          <div className="font-meta text-xs text-neutral-500">
            © 2026 EXAMSAATHI. BRUTALIST KINETIC ORANGE EDITION.
          </div>
        </motion.div>
      </footer>

      {/* 9. LOGIN PROMPT MODAL */}
      <LoginPromptModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        title="LOGIN OR CREATE ACCOUNT"
        message={
          selectedServiceTitle
            ? `Please sign in or register a new free account to access ${selectedServiceTitle}, examine high-yield probability models, and explore chapter analytics.`
            : "Please sign in or register a new free account to access complete exam intelligence tools and analytics."
        }
      />

      {/* 10. AI ASSISTANT PREVIEW MODAL */}
      <AiAssistantPreviewModal
        isOpen={aiPreviewOpen}
        onClose={() => setAiPreviewOpen(false)}
      />
    </div>
  );
}
