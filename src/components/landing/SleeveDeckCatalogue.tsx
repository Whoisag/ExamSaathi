"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, Sparkles, Disc3, Layers } from "lucide-react";

interface SleeveCard {
  id: string;
  exam: string;
  subject: string;
  chapter: string;
  stat: string;
  statLabel: string;
  pyqCount: number;
  weightage: string;
  rotation: number;
  colorTag: string;
  analyzerUrl: string;
  iconType: "physics" | "chemistry" | "math" | "biology";
}

const SLEEVE_DECK_DATA: SleeveCard[] = [
  {
    id: "card-1",
    exam: "JEE MAIN 2026",
    subject: "PHYSICS",
    chapter: "MODERN PHYSICS & DUAL NATURE",
    stat: "78% QUESTION RECURRENCE",
    statLabel: "POISSON RISING CYCLE",
    pyqCount: 42,
    weightage: "12.5%",
    rotation: -4,
    colorTag: "#FF4D00",
    analyzerUrl: "/analyzer/jee-main/modern-physics",
    iconType: "physics",
  },
  {
    id: "card-2",
    exam: "NEET UG 2026",
    subject: "BIOLOGY",
    chapter: "GENETICS & EVOLUTION",
    stat: "85% QUESTION RECURRENCE",
    statLabel: "DOMINANT ANNUAL CORE",
    pyqCount: 52,
    weightage: "18.0%",
    rotation: 3,
    colorTag: "#000000",
    analyzerUrl: "/analyzer/neet/genetics-evolution",
    iconType: "biology",
  },
  {
    id: "card-3",
    exam: "JEE ADVANCED",
    subject: "PHYSICS",
    chapter: "ROTATIONAL RIGID DYNAMICS",
    stat: "64% MULTI-CONCEPT RATIO",
    statLabel: "TOP RANK SEPARATOR",
    pyqCount: 34,
    weightage: "9.8%",
    rotation: -2,
    colorTag: "#FF4D00",
    analyzerUrl: "/analyzer/jee-advanced/rotational-dynamics",
    iconType: "physics",
  },
  {
    id: "card-4",
    exam: "CBSE CLASS 12",
    subject: "PHYSICS",
    chapter: "WAVE OPTICS & INTERFERENCE",
    stat: "91% DERIVATION FREQUENCY",
    statLabel: "HUYGENS 5-MARK PATTERN",
    pyqCount: 22,
    weightage: "7.5%",
    rotation: 4,
    colorTag: "#000000",
    analyzerUrl: "/analyzer/cbse-12/wave-optics",
    iconType: "physics",
  },
  {
    id: "card-5",
    exam: "JEE MAIN 2026",
    subject: "CHEMISTRY",
    chapter: "CHEMICAL BONDING & MOLECULAR",
    stat: "82% SHIFT CONSISTENCY",
    statLabel: "MOT BOND ORDER HEURISTIC",
    pyqCount: 38,
    weightage: "10.2%",
    rotation: -5,
    colorTag: "#FF4D00",
    analyzerUrl: "/analyzer/jee-main/chemical-bonding",
    iconType: "chemistry",
  },
  {
    id: "card-6",
    exam: "CUET UG 2026",
    subject: "MATHEMATICS",
    chapter: "INTEGRAL CALCULUS & AREAS",
    stat: "74% RECURRENCE RATE",
    statLabel: "DEFINITE PROPERTIES CORRIDOR",
    pyqCount: 36,
    weightage: "14.0%",
    rotation: 2,
    colorTag: "#000000",
    analyzerUrl: "/analyzer/cuet/integral-calculus",
    iconType: "math",
  },
  {
    id: "card-7",
    exam: "JEE MAIN 2026",
    subject: "PHYSICS",
    chapter: "CURRENT ELECTRICITY & CIRCUITS",
    stat: "79% CYCLIC RECURRENCE",
    statLabel: "KIRCHHOFF & WHEATSTONE BRIDGE",
    pyqCount: 40,
    weightage: "11.0%",
    rotation: -3,
    colorTag: "#FF4D00",
    analyzerUrl: "/analyzer/jee-main/current-electricity",
    iconType: "physics",
  },
  {
    id: "card-8",
    exam: "NEET UG 2026",
    subject: "BIOLOGY",
    chapter: "HUMAN PHYSIOLOGY & ENDOCRINE",
    stat: "88% ANNUAL COVERAGE",
    statLabel: "HIGH-YIELD DIAGRAM DRILL",
    pyqCount: 48,
    weightage: "16.5%",
    rotation: 5,
    colorTag: "#000000",
    analyzerUrl: "/analyzer/neet/human-physiology",
    iconType: "biology",
  },
];

export function SleeveDeckCatalogue() {
  // Array of active cards remaining in the deck
  const [deck, setDeck] = useState<SleeveCard[]>(SLEEVE_DECK_DATA);
  const [thrownCards, setThrownCards] = useState<SleeveCard[]>([]);

  // Throw top card aside
  const handleThrowCard = (card: SleeveCard) => {
    setDeck((prev) => prev.filter((c) => c.id !== card.id));
    setThrownCards((prev) => [...prev, card]);
  };

  // Reset deck back to initial state
  const handleResetDeck = () => {
    setDeck(SLEEVE_DECK_DATA);
    setThrownCards([]);
  };

  const topCard = deck[deck.length - 1];

  return (
    <section id="catalogue" className="relative py-20 md:py-28 bg-black text-white overflow-hidden border-brutal-b">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="font-meta text-xs text-[#FF4D00] font-bold tracking-widest uppercase mb-2">
            // INTERACTIVE RECORD SLEEVES • CLICK OR DRAG TO THROW ASIDE //
          </div>
          <h2 className="font-headline text-[11vw] sm:text-[9vw] md:text-[8vw] lg:text-[7.5vw] text-white tracking-tight leading-[0.88] select-none">
            TOPIC CATALOGUE
          </h2>
          <p className="font-meta text-xs text-neutral-400 max-w-lg mx-auto mt-4">
            FLIP THROUGH HIGH-YIELD EXAMINATION RECORDS. EACH PHYSICAL SLEEVE REPRESENTS A VERIFIED EMPIRICAL PYQ CHAPTER.
          </p>
        </div>

        {/* Sleeve Deck Area */}
        <div className="relative min-h-[500px] flex flex-col items-center justify-center">
          {/* Deck Counter */}
          <div className="mb-6 font-meta text-xs text-neutral-400 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <Disc3 className="w-4 h-4 text-[#FF4D00] animate-spin" />
              <span>SLEEVES REMAINING:</span>
            </span>
            <span className="bg-[#FF4D00] text-black font-bold px-2 py-0.5 border border-black">
              {deck.length} / {SLEEVE_DECK_DATA.length}
            </span>
          </div>

          {/* Cards Stack Container */}
          <div className="relative w-[300px] sm:w-[320px] h-[410px] sm:h-[430px] flex items-center justify-center">
            <AnimatePresence>
              {deck.map((card, index) => {
                const isTop = index === deck.length - 1;
                const stackIndex = deck.length - 1 - index;

                return (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{
                      scale: 1 - stackIndex * 0.03,
                      opacity: stackIndex < 4 ? 1 : 0,
                      y: stackIndex * 6,
                      rotate: isTop ? 0 : card.rotation,
                      zIndex: index,
                    }}
                    exit={{
                      x: 600,
                      y: -30,
                      rotateY: -35,
                      rotateZ: 15,
                      opacity: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      },
                    }}
                    drag={isTop ? "x" : false}
                    dragConstraints={{ left: 0, right: 300 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 80 || info.velocity.x > 300) {
                        handleThrowCard(card);
                      }
                    }}
                    onClick={() => {
                      if (isTop) handleThrowCard(card);
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                      perspective: 1000,
                    }}
                    className={`absolute inset-0 bg-white text-black border-2 border-black rounded-xl p-5 sm:p-6 flex flex-col justify-between select-none shadow-2xl ${
                      isTop
                        ? "cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform"
                        : "pointer-events-none"
                    }`}
                  >
                    {/* Card Header: Exam & Subject */}
                    <div>
                      <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                        <span className="font-meta text-[10px] font-bold text-neutral-600">
                          {card.exam}
                        </span>
                        <span
                          className="font-meta text-[10px] font-bold px-2 py-0.5 border border-black"
                          style={{
                            backgroundColor: card.colorTag,
                            color: card.colorTag === "#000000" ? "#FFFFFF" : "#000000",
                          }}
                        >
                          {card.subject}
                        </span>
                      </div>

                      <h3 className="font-headline text-lg sm:text-xl text-black leading-tight mb-2 uppercase">
                        {card.chapter}
                      </h3>

                      <div className="font-meta text-xs text-[#FF4D00] font-bold">
                        {card.stat}
                      </div>
                    </div>

                    {/* Card Center: Square Vinyl Sleeve Artwork */}
                    <div className="w-full h-36 bg-black border-2 border-black rounded-lg relative overflow-hidden flex items-center justify-center p-4 my-2">
                      {/* Vinyl Groove Rings SVG */}
                      <div className="absolute inset-0 opacity-30 flex items-center justify-center">
                        <div className="w-48 h-48 rounded-full border border-neutral-600"></div>
                        <div className="w-36 h-36 rounded-full border border-neutral-500 absolute"></div>
                        <div className="w-24 h-24 rounded-full border border-neutral-400 absolute"></div>
                      </div>

                      {/* Center Label Circle */}
                      <div className="relative z-10 w-20 h-20 rounded-full bg-[#FF4D00] border-2 border-white flex flex-col items-center justify-center text-black font-headline text-center p-1">
                        <span className="text-[9px] font-meta text-black/80 font-bold">AVG WTG</span>
                        <span className="text-sm leading-none font-bold">{card.weightage}</span>
                        <span className="text-[8px] font-meta text-black/80">{card.pyqCount} Qs</span>
                      </div>

                      {/* Topic Badge in Corner */}
                      <div className="absolute top-2 left-2 font-meta text-[9px] bg-white text-black px-1.5 py-0.5 border border-black font-bold">
                        LP // RECURRENCE
                      </div>
                    </div>

                    {/* Card Footer: View Analysis Pill */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="font-meta text-[10px] text-neutral-500">
                        {card.statLabel}
                      </span>
                      <Link
                        href={card.analyzerUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-black text-white hover:bg-[#FF4D00] hover:text-black font-meta text-xs px-3.5 py-1.5 rounded-full border border-black transition-colors flex items-center gap-1 font-bold"
                      >
                        <span>VIEW ANALYSIS</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Tactile Throw Hint for top card */}
                    {isTop && (
                      <div className="absolute -bottom-8 left-0 right-0 text-center font-meta text-[10px] text-neutral-400 sm:text-xs">
                        [ CLICK OR SWIPE TO THROW ASIDE → ]
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Empty State / Deck Exhausted */}
            {deck.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white text-black border-2 border-black rounded-xl p-8 text-center max-w-sm w-full space-y-4 shadow-2xl"
              >
                <div className="w-12 h-12 bg-[#FF4D00] border-2 border-black rounded-full mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-headline text-2xl text-black">
                  DECK EXHAUSTED!
                </h3>
                <p className="font-meta text-xs text-neutral-600 leading-relaxed">
                  You threw all {SLEEVE_DECK_DATA.length} examination sleeves aside. Ready to shuffle and examine again?
                </p>
                <button
                  onClick={handleResetDeck}
                  className="bg-black text-white hover:bg-[#FF4D00] hover:text-black px-6 py-3 border-2 border-black rounded-full font-headline text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 w-full cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RESET DECK & SHUFFLE</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Fast Navigation Shortcuts */}
        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-meta text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF4D00] rounded-full inline-block"></span>
            <span>SUPPORTED ON DESKTOP CLICK & TOUCH MOBILE SWIPE</span>
          </div>
          <Link
            href="/dashboard/exams"
            className="text-white hover:text-[#FF4D00] font-bold flex items-center gap-1 transition-colors"
          >
            <span>VIEW ALL 150+ CHAPTER SLEEVES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
