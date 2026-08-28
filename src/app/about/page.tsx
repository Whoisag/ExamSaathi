"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrutalistHeader } from "@/components/layout/BrutalistHeader";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { LoginPromptModal } from "@/components/ui/LoginPromptModal";
import {
  ShieldCheck,
  Cpu,
  AlertTriangle,
  BookOpen,
  Scale,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export default function AboutPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#FF4D00] text-black flex flex-col justify-between selection:bg-black selection:text-white font-sans">
      <BrutalistHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10">
        {/* Header Title Banner */}
        <div className="border-brutal bg-black text-white p-6 sm:p-10 relative">
          <div className="font-meta text-xs text-[#FF4D00] font-bold mb-2">
            // WHITE PAPER & SYSTEM PROTOCOL //
          </div>
          <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl text-white mb-4 tracking-tight leading-[0.88]">
            METHODOLOGY, ETHICS & LIMITATIONS
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-3xl font-medium leading-relaxed">
            How ExamSaathi models 15+ years of examination data, safeguards student mental well-being,
            and mathematically treats uncertainty under changing national syllabi.
          </p>
        </div>

        {/* SECTION 1: METHODOLOGY */}
        <section className="border-brutal bg-white p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between border-brutal-b pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-[#FF4D00] border border-black flex items-center justify-center font-headline text-black text-sm">
                01
              </span>
              <h2 className="font-headline text-2xl sm:text-3xl text-black">
                MATHEMATICAL & STATISTICAL METHODOLOGY
              </h2>
            </div>
            <span className="bg-black text-white font-meta text-xs px-2.5 py-1 font-bold hidden sm:inline-block">
              PROBABILITY CORE
            </span>
          </div>

          <div className="space-y-6 text-sm sm:text-base text-neutral-800 leading-relaxed font-sans">
            <p>
              ExamSaathi avoids simplistic moving averages or naive keyword counting. Question distributions in high-stakes examinations like <strong>JEE Main</strong> and <strong>NEET</strong> are strictly constrained by test-maker guidelines, shift-balance parity, and committee question-bank rotation cycles.
            </p>

            {/* Subsection A: Poisson Recurrence */}
            <div className="border-brutal bg-neutral-50 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
                <h3 className="font-headline text-lg text-black">
                  A. NON-HOMOGENEOUS POISSON RECURRENCE MODELING
                </h3>
                <span className="font-meta text-xs text-[#FF4D00] font-bold">
                  // CYCLIC GAPS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-700">
                We model the appearance of niche and secondary subtopics (e.g., <em>Davisson-Germer Experiment</em> or <em>Potentiometer Null Points</em>) using a non-homogeneous Poisson process with an empirical recurrence recovery term:
              </p>

              <div className="bg-white border-2 border-black p-4 text-center overflow-x-auto my-2">
                <KaTeXMath
                  math="P(k \text{ appearances in } t \text{ shifts}) = \frac{(\lambda(t))^k e^{-\lambda(t)}}{k!}"
                  block={true}
                  className="font-bold text-black"
                />
                <div className="text-xs text-neutral-600 font-meta mt-2">
                  WHERE INTENSITY PARAMETER INCREASES WITH OVERDUE INTERVAL:
                </div>
                <KaTeXMath
                  math="\lambda(t) = \lambda_0 \cdot \left[1 + \beta \cdot \max\left(0, \frac{\Delta t - T_{\text{mean}}}{T_{\text{mean}}}\right)\right]"
                  block={true}
                />
              </div>

              <p className="text-xs text-neutral-600 font-mono">
                Here <KaTeXMath math="\Delta t" /> represents shifts elapsed since the subtopic was last examined, and <KaTeXMath math="T_{\text{mean}}" /> is the historical mean recurrence period.
              </p>
            </div>

            {/* Subsection B: Dirichlet-Multinomial */}
            <div className="border-brutal bg-neutral-50 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
                <h3 className="font-headline text-lg text-black">
                  B. DIRICHLET-MULTINOMIAL TOPIC WEIGHT ALLOCATION
                </h3>
                <span className="font-meta text-xs text-black font-bold">
                  // ZERO-SUM CONSTRAINTS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-700">
                Because each examination session contains an exact, fixed total mark allotment (e.g., 100 marks per subject in JEE Main, 720 total marks in NEET), individual topic appearances are negatively correlated Dirichlet draws:
              </p>

              <div className="bg-white border-2 border-black p-4 text-center overflow-x-auto my-2">
                <KaTeXMath
                  math="\mathbf{w} \sim \text{Dirichlet}(\alpha_1 + n_1, \alpha_2 + n_2, \dots, \alpha_K + n_K)"
                  block={true}
                  className="font-bold text-black"
                />
              </div>

              <p className="text-xs text-neutral-600 font-mono">
                Prior hyperparameters <KaTeXMath math="\alpha_k" /> reflect NCERT curriculum classroom hours, updated by posterior counts <KaTeXMath math="n_k" /> harvested from 60+ verified shift papers.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: ETHICS & STUDENT WELL-BEING */}
        <section className="border-brutal bg-white p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between border-brutal-b pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-black text-white border border-black flex items-center justify-center font-headline text-sm">
                02
              </span>
              <h2 className="font-headline text-2xl sm:text-3xl text-black">
                ETHICAL SAFEGUARDS & STUDENT WELL-BEING
              </h2>
            </div>
            <span className="bg-[#FF4D00] text-black font-meta text-xs px-2.5 py-1 font-bold border border-black hidden sm:inline-block">
              WELL-BEING GUARANTEES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-brutal bg-neutral-50 p-5">
              <div className="font-meta text-xs text-[#FF4D00] font-bold mb-1">// PRINCIPLE 01</div>
              <h3 className="font-headline text-lg text-black mb-2">ANTI-GAMBLING POLICY</h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                ExamSaathi explicitly warns against omitting entire chapters based on low statistical predictions. Predictions are designed to optimize <strong>revision priority</strong> and <strong>confidence allocation</strong>, not to endorse complete syllabus neglect.
              </p>
            </div>

            <div className="border-brutal bg-neutral-50 p-5">
              <div className="font-meta text-xs text-black font-bold mb-1">// PRINCIPLE 02</div>
              <h3 className="font-headline text-lg text-black mb-2">RADICAL UNCERTAINTY HONESTY</h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                We never make fraudulent claims such as <em>&quot;100% Guaranteed Questions&quot;</em> or <em>&quot;Leaked Papers&quot;</em>. All figures are presented with explicit empirical error bars (e.g., MAE ±0.48 Qs).
              </p>
            </div>

            <div className="border-brutal bg-neutral-50 p-5">
              <div className="font-meta text-xs text-black font-bold mb-1">// PRINCIPLE 03</div>
              <h3 className="font-headline text-lg text-black mb-2">ANXIETY REDUCTION DESIGN</h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                Our user interfaces avoid countdown panic clocks, alarmist push notifications, or high-pressure rankings. The platform emphasizes clarity, calmness, and structured revision mastery.
              </p>
            </div>

            <div className="border-brutal bg-neutral-50 p-5">
              <div className="font-meta text-xs text-[#FF4D00] font-bold mb-1">// PRINCIPLE 04</div>
              <h3 className="font-headline text-lg text-black mb-2">DEMOCRATIZING ANALYTICS</h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                High-end test analytics have historically been monopolized by elite coaching institutes. ExamSaathi makes predictive PYQ modeling universally accessible to every Indian student for free.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: SYSTEM LIMITATIONS */}
        <section className="border-brutal bg-white p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between border-brutal-b pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-neutral-200 text-black border border-black flex items-center justify-center font-headline text-sm">
                03
              </span>
              <h2 className="font-headline text-2xl sm:text-3xl text-black">
                LIMITATIONS & FAILURE MODES
              </h2>
            </div>
            <span className="bg-neutral-100 text-black font-meta text-xs px-2.5 py-1 font-bold border border-black hidden sm:inline-block">
              MODEL BOUNDARIES
            </span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
            <div className="border-l-4 border-black pl-4 py-1">
              <strong className="text-black font-headline text-sm block mb-1">
                1. MAJOR SYLLABUS RATIONALIZATIONS (2024 NCERT CUTS)
              </strong>
              <span>
                When agencies abruptly remove entire topics (e.g., Transistors, P-Block Elements, Rolling Dynamics in certain tracks), historical frequencies prior to the cut must be manually down-weighted. Our backtest models explicitly account for this with rationalized Dirichlet priors.
              </span>
            </div>

            <div className="border-l-4 border-[#FF4D00] pl-4 py-1">
              <strong className="text-black font-headline text-sm block mb-1">
                2. INTER-DISCIPLINARY SYNTHESIS OUTLIERS
              </strong>
              <span>
                In advanced entrance exams like JEE Advanced, single questions frequently synthesize concepts across multiple distinct chapters (e.g., Electromagnetic Induction combined with Rotational Dynamics). In such instances, multi-label attribution is applied.
              </span>
            </div>
          </div>

          {/* Quick CTA to Dashboard */}
          <div className="pt-6 border-brutal-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-meta text-xs text-[#FF4D00] font-bold block">
                EXPLORE THE ACTIVE SHELL
              </span>
              <span className="font-headline text-lg text-black">
                SEE THESE MODELS APPLIED TO LIVE CHAPTERS
              </span>
            </div>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-[#FF4D00] text-black px-6 py-3 border-brutal font-headline text-sm hover:bg-black hover:text-[#FF4D00] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>OPEN EXAMS DIRECTORY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      <LoginPromptModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="PLEASE LOGIN FIRST"
        message="Please login first to explore the active examination directory and see predictive models applied to live chapters."
      />

      {/* Footer */}
      <footer className="border-brutal-t bg-black text-white py-6 px-4 md:px-8 mt-12 font-meta text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>// EXAMSAATHI WHITE PAPER • 2026 SHELL</div>
          <div className="text-neutral-400">
            FORMAL METHODOLOGY & ETHICAL SAFEGUARDS
          </div>
        </div>
      </footer>
    </div>
  );
}
