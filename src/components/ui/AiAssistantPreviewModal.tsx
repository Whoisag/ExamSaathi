"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bot, Sparkles, Send, ArrowRight, Lock, UserPlus, CheckCircle2 } from "lucide-react";
import { MarkdownMath } from "@/components/ui/MarkdownMath";
import { useAuth } from "@/context/AuthContext";

interface AiAssistantPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PREVIEW_PROMPTS = [
  {
    q: "Which topics in Modern Physics have highest weightage in JEE Main 2026?",
    a: "### ⚡ Modern Physics Predictive Analysis (JEE Main 2026)\n\nBased on Poisson frequency analysis across 60+ shifts (2019–2025):\n\n1. **Photoelectric Effect & Stopping Potential Graphs:** Appeared in **96% of recent shifts**. Key relation:\n   $$eV_0 = h\\nu - \\Phi_0 = \\frac{hc}{\\lambda} - \\Phi_0$$\n2. **de Broglie Wavelength of Charged Particles:** Key formula:\n   $$\\lambda = \\frac{h}{\\sqrt{2mqV}} = \\frac{12.27}{\\sqrt{V}}\\text{ \\AA (for electrons)}$$\n3. **Bohr Model Transitions:** Rydberg formula $\\frac{1}{\\lambda} = R Z^2 \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)$.\n\n> **Strategic Scoring Tip:** Modern Physics carries **12–16 guaranteed marks** per shift with zero trick traps.",
  },
  {
    q: "Make a 3-day revision sprint for Class 12 Calculus",
    a: "### 📅 3-Day High-Yield Calculus Sprint (CBSE / JEE)\n\n- **Day 1: Continuity & Differentiability + King's Property**\n  Focus on $\\int_0^a f(x) dx = \\int_0^a f(a - x) dx$ and L'Hôpital applications.\n- **Day 2: Application of Derivatives (AOD)**\n  Master maxima/minima word problems and tangent-normal equations.\n- **Day 3: Differential Equations & Area Under Curves**\n  Practice Linear Differential Equations with $I.F. = e^{\\int P dx}$.",
  },
  {
    q: "What is the Poisson recurrence probability of Wave Optics YDSE?",
    a: "### 📊 Wave Optics: YDSE Recurrence Breakdown\n\n- **Recurrence Probability:** **94% (Critical)**\n- **Predicted Shift Coverage:** 2–3 questions per shift\n- **Key Formula:** Fringe width $\\beta = \\frac{\\lambda D}{d}$, intensity $I = 4I_0 \\cos^2(\\phi/2)$\n- **Common Trap:** Immersion of YDSE apparatus in medium of refractive index $\\mu \\implies \\beta' = \\beta / \\mu$.",
  },
];

export function AiAssistantPreviewModal({ isOpen, onClose }: AiAssistantPreviewModalProps) {
  const { user } = useAuth();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [customQuery, setCustomQuery] = useState("");
  const [activeResponse, setActiveResponse] = useState(PREVIEW_PROMPTS[0]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectPrompt = (idx: number) => {
    setSelectedIdx(idx);
    setIsSimulating(true);
    setTimeout(() => {
      setActiveResponse(PREVIEW_PROMPTS[idx]);
      setIsSimulating(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xs cursor-pointer"
          />

          {/* Brutalist Preview Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl bg-white border-4 border-black shadow-[10px_10px_0px_0px_#FF4D00] flex flex-col my-auto max-h-[92vh] overflow-hidden"
          >
            {/* Window Titlebar */}
            <div className="bg-black text-white px-4 py-3 border-b-4 border-black flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#FF4D00] border border-black flex items-center justify-center text-black font-bold font-headline text-xs">
                  AI
                </div>
                <div>
                  <h3 className="font-headline text-sm text-white flex items-center gap-2">
                    <span>AI STRATEGY TUTOR</span>
                    <span className="bg-[#FF4D00] text-black text-[9px] font-meta font-bold px-1.5 py-0.2">
                      LIVE PREVIEW
                    </span>
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-7 h-7 border border-neutral-700 hover:border-[#FF4D00] hover:bg-neutral-900 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-header Banner */}
            <div className="bg-[#fff7ed] border-b-2 border-black px-4 py-2 flex items-center justify-between text-xs font-meta shrink-0">
              <span className="text-neutral-700 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
                Interactive demo of Poisson PYQ Intelligence & Socratic Tutoring
              </span>
              <span className="hidden sm:inline text-neutral-500 text-[10px]">
                // NO SIGNIN REQUIRED FOR DEMO
              </span>
            </div>

            {/* Quick Prompts Switcher */}
            <div className="p-3 bg-neutral-100 border-b-2 border-black flex flex-col gap-1.5 shrink-0">
              <span className="text-[10px] font-meta font-bold text-neutral-600 uppercase">
                Select a sample exam query to test:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {PREVIEW_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPrompt(idx)}
                    className={`px-3 py-1.5 text-left border-2 text-[11px] font-meta font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedIdx === idx
                        ? "bg-black text-[#FF4D00] border-black shadow-[2px_2px_0px_0px_#FF4D00]"
                        : "bg-white text-black border-black hover:bg-neutral-200"
                    }`}
                  >
                    {idx === 0 ? "⚡ Modern Physics" : idx === 1 ? "📅 3-Day Plan" : "📊 Wave Optics"}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Preview Chat Display Area */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-neutral-50 space-y-4 font-sans text-xs sm:text-sm">
              {/* Simulated User Question Bubble */}
              <div className="flex gap-3 ml-auto flex-row-reverse max-w-lg">
                <div className="w-7 h-7 bg-black text-white border border-black flex items-center justify-center font-headline text-xs shrink-0">
                  U
                </div>
                <div className="bg-black text-white p-3.5 border-2 border-black">
                  <span className="font-meta text-[9px] text-neutral-400 font-bold block mb-1">
                    SAMPLE QUESTION
                  </span>
                  <p className="font-medium text-xs sm:text-sm">{activeResponse.q}</p>
                </div>
              </div>

              {/* Simulated Assistant Answer Bubble */}
              <div className="flex gap-3 mr-auto max-w-xl">
                <div className="w-7 h-7 bg-[#FF4D00] text-black border border-black flex items-center justify-center font-headline text-xs shrink-0 font-bold">
                  AI
                </div>
                <div className="bg-white text-black p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000000] flex-1">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-1 mb-2">
                    <span className="font-meta text-[10px] text-[#FF4D00] font-bold">
                      SAATHI SOCRATIC TUTOR
                    </span>
                    <span className="font-meta text-[10px] text-neutral-400">
                      LIVE PREDICTIVE ENGINE
                    </span>
                  </div>

                  {isSimulating ? (
                    <div className="py-4 text-center text-neutral-500 font-meta text-xs animate-pulse">
                      Synthesizing verified PYQ shift reasoning...
                    </div>
                  ) : (
                    <div className="leading-relaxed">
                      <MarkdownMath content={activeResponse.a} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom CTA / Action Bar */}
            <div className="bg-neutral-900 text-white p-4 border-t-4 border-black flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-center sm:text-left">
                <div className="font-headline text-sm text-white">
                  WANT TO CHAT WITH YOUR FULL PREP HUB SYNCED?
                </div>
                <div className="font-meta text-[10px] text-neutral-400">
                  Login to ask unlimited doubts, get custom chapter timetables & derivations.
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {user ? (
                  <Link
                    href="/assistant"
                    onClick={onClose}
                    className="w-full sm:w-auto bg-[#FF4D00] text-black px-5 py-2.5 font-headline text-xs hover:bg-white transition-colors flex items-center justify-center gap-1.5 border-2 border-black"
                  >
                    <span>OPEN FULL ASSISTANT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="flex-1 sm:flex-none bg-[#FF4D00] text-black px-4 py-2.5 font-headline text-xs hover:bg-white transition-colors flex items-center justify-center gap-1.5 border-2 border-black"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>LOGIN NOW</span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={onClose}
                      className="flex-1 sm:flex-none bg-black text-white px-4 py-2.5 font-headline text-xs hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-1.5 border-2 border-white"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>SIGN UP</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
