"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowRight, Terminal, Activity, Layers } from "lucide-react";
import { PortalHero } from "@/components/landing/PortalHero";
import { SleeveDeckCatalogue } from "@/components/landing/SleeveDeckCatalogue";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
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
            <Link
              href="/dashboard/exams"
              className="px-4 py-1.5 font-meta text-white rounded-full hover:bg-white hover:text-black transition-colors"
            >
              [EXAMS]
            </Link>
            <Link
              href="/analyzer/jee-main/modern-physics"
              className="px-4 py-1.5 font-meta text-white rounded-full hover:bg-white hover:text-black transition-colors"
            >
              [ANALYZER]
            </Link>
            <Link
              href="/assistant"
              className="px-4 py-1.5 font-meta text-white rounded-full hover:bg-white hover:text-black transition-colors"
            >
              [AI ASSISTANT]
            </Link>
            <Link
              href="/evaluation"
              className="px-4 py-1.5 font-meta text-white rounded-full hover:bg-white hover:text-black transition-colors"
            >
              [EVALUATION]
            </Link>
            <Link
              href="/about"
              className="px-4 py-1.5 font-meta text-white rounded-full hover:bg-white hover:text-black transition-colors"
            >
              [METHODOLOGY]
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Link
              href="/login"
              className="hidden sm:inline-block bg-white text-black px-3.5 py-1.5 border-brutal font-meta text-xs hover:bg-black hover:text-white transition-colors"
            >
              LOGIN
            </Link>
            <Link
              href="/dashboard/exams"
              className="bg-[#FF4D00] text-black px-3 py-1.5 sm:px-4 sm:py-1.5 border-brutal font-meta text-[11px] sm:text-xs font-bold hover:bg-black hover:text-[#FF4D00] transition-colors flex items-center gap-1"
            >
              <span>DASHBOARD</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. FULLSCREEN INTERACTIVE PORTAL HERO */}
      <PortalHero />

      {/* 3. CATALOGUE – SLEEVE DECK (PHYSICAL RECORD SLEEVES) */}
      <SleeveDeckCatalogue />

      {/* 4. SKEWED MARQUEE SECTION (-2deg Skew, #000000 Background) */}
      <section className="relative py-14 bg-black overflow-hidden border-brutal-b -my-2 z-10 transform -rotate-2 scale-105">
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
      </section>

      {/* 5. VERTICAL SERVICE LIST (Dark Section with Orange Accents) */}
      <section className="bg-black text-white py-24 px-4 md:px-8 border-brutal-b">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-brutal-b border-white pb-6 mb-12">
            <div>
              <span className="font-meta text-xs text-[#FF4D00]">[ CORE CAPABILITIES ]</span>
              <h2 className="font-headline text-4xl sm:text-6xl md:text-7xl mt-2 tracking-tight text-white">
                THE INTELLIGENCE STACK
              </h2>
            </div>
            <p className="font-meta text-xs text-neutral-400 max-w-sm mt-4 md:mt-0">
              FOUR PROPRIETARY MODULES BUILT TO EXPOSE HIGH-YIELD PATTERNS ACROSS NTA & CBSE SHIFTS.
            </p>
          </div>

          {/* List Items */}
          <div className="divide-y-2 divide-neutral-800 border-brutal border-neutral-800">
            {services.map((svc) => (
              <Link
                key={svc.number}
                href="/dashboard/exams"
                className="group block p-6 sm:p-10 hover:bg-[#FF4D00] transition-colors duration-200"
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
                      <h3 className="font-headline text-2xl sm:text-4xl text-white group-hover:text-black group-hover:translate-x-3 transition-all duration-200">
                        {svc.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:max-w-md">
                    <p className="text-sm text-neutral-400 group-hover:text-black transition-colors">
                      {svc.desc}
                    </p>
                    <div className="w-12 h-12 flex-shrink-0 border-brutal border-white group-hover:border-black bg-black group-hover:bg-white flex items-center justify-center group-hover:translate-x-2 transition-all">
                      <ArrowRight className="w-6 h-6 text-[#FF4D00] group-hover:text-black" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PARALLAX & STICKY STORYTELLING (scroll-experience skill) */}
      <section className="py-24 px-4 md:px-8 bg-neutral-100 border-brutal-b">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <span className="font-meta text-xs text-[#FF4D00] font-bold">[ METHODOLOGICAL WORKFLOW ]</span>
            <h2 className="font-headline text-4xl sm:text-6xl text-black mt-2">
              HOW EXAMSAATHI CRACKS THE CODE
            </h2>
            <p className="font-medium text-neutral-700 mt-4 text-base md:text-lg">
              High-stakes Indian exams do not pick questions randomly. Syllabus balance requirements, committee rotations, and difficulty constraints force predictable patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storySteps.map((s, idx) => {
              const IconComp = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="bg-white p-8 border-brutal relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-brutal-b">
                      <span className="font-meta text-xs font-bold text-[#FF4D00]">{s.step}</span>
                      <IconComp className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="font-headline text-2xl text-black mb-4">{s.title}</h3>
                    <p className="text-sm text-neutral-700 leading-relaxed">{s.body}</p>
                  </div>

                  <div className="mt-8 pt-4 border-brutal-t flex items-center justify-between font-meta text-xs">
                    <span className="text-neutral-500">STATUS</span>
                    <span className="text-black font-bold">VERIFIED PROTOCOL</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. GIANT BRUTALIST CTA */}
      <section className="bg-white py-20 px-4 md:px-8 border-brutal-b text-center">
        <div className="max-w-5xl mx-auto">
          <span className="font-meta text-xs text-[#FF4D00] font-bold">[ NO CREDIT CARD • NO BACKEND SETUP ]</span>
          <h2 className="font-headline text-5xl sm:text-7xl md:text-8xl text-black mt-4 mb-8 tracking-tight leading-[0.88]">
            STUDY SMARTER.<br />
            NOT HARDER.
          </h2>
          <p className="text-lg md:text-xl text-neutral-800 max-w-2xl mx-auto mb-10">
            Access the complete predictive analytics shell, chapter weightage heatmaps, KaTeX formula cheatsheets, and AI strategy assistant.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-[#FF4D00] text-black px-10 py-5 border-brutal font-headline text-xl hover:bg-black hover:text-[#FF4D00] transition-colors flex items-center justify-center gap-3"
            >
              <span>CREATE FREE ACCOUNT</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/dashboard/exams"
              className="w-full sm:w-auto bg-black text-white px-10 py-5 border-brutal font-headline text-xl hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3"
            >
              <span>VIEW EXAM SUITE</span>
              <ArrowUpRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-black text-white py-12 px-4 md:px-8 border-brutal-t border-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
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
            <Link href="/dashboard/exams" className="hover:text-[#FF4D00] transition-colors">
              [EXAMS]
            </Link>
            <Link href="/analyzer/jee-main/modern-physics" className="hover:text-[#FF4D00] transition-colors">
              [ANALYZER]
            </Link>
            <Link href="/assistant" className="hover:text-[#FF4D00] transition-colors">
              [ASSISTANT]
            </Link>
            <Link href="/evaluation" className="hover:text-[#FF4D00] transition-colors">
              [EVALUATION]
            </Link>
            <Link href="/about" className="hover:text-[#FF4D00] transition-colors">
              [METHODOLOGY]
            </Link>
          </div>

          <div className="font-meta text-xs text-neutral-500">
            © 2026 EXAMSAATHI. BRUTALIST KINETIC ORANGE EDITION.
          </div>
        </div>
      </footer>
    </div>
  );
}
