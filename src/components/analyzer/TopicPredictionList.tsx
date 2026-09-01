"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMotion, containerVariants, cardVariants } from "@/hooks/useMotion";
import { TopicPrediction } from "@/data/mock";
import { MarkdownMath } from "@/components/ui/MarkdownMath";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TopicPredictionListProps {
  predictions: TopicPrediction[];
  isLoading?: boolean;
}

export function TopicPredictionList({
  predictions,
  isLoading = false,
}: TopicPredictionListProps) {
  const { shouldAnimate } = useMotion();
  if (isLoading) {
    return (
      <div className="border-brutal bg-white p-6 animate-pulse space-y-4">
        <div className="h-6 bg-neutral-300 w-1/3"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-neutral-100 border-2 border-neutral-200"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-brutal bg-white p-6">
      <div className="flex items-center justify-between border-brutal-b pb-3 mb-5">
        <div>
          <span className="font-meta text-xs text-[#FF4D00] font-bold block">
            // POISSON & DIRICHLET SCORING
          </span>
          <h3 className="font-headline text-xl text-black">
            PREDICTED TOPIC YIELD RANKING
          </h3>
        </div>
        <span className="bg-black text-white font-meta text-xs px-2.5 py-1 font-bold">
          TOP {predictions.length} YIELD
        </span>
      </div>

      <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="show">
        {predictions.map((p, index) => {
          return (
            <motion.div
              key={p.id}
              variants={cardVariants}
              whileHover={shouldAnimate ? { y: -2 } : {}}
              className="border-brutal bg-neutral-50 p-4 sm:p-5 relative group hover:bg-white transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-black text-white font-headline text-sm flex items-center justify-center flex-shrink-0">
                    #{p.rank}
                  </span>
                  <div>
                    <h4 className="font-headline text-base sm:text-lg text-black group-hover:text-[#FF4D00] transition-colors">
                      <MarkdownMath content={p.topicName} />
                    </h4>
                    <span className="font-meta text-[11px] text-neutral-500">
                      {p.category} • {p.shiftCoverage}
                    </span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 self-start sm:self-auto font-meta text-xs">
                  {p.trend === "rising" && (
                    <span className="bg-[#FF4D00] text-black px-2 py-0.5 font-bold flex items-center gap-1 border border-black">
                      <TrendingUp className="w-3.5 h-3.5" /> RISING
                    </span>
                  )}
                  {p.trend === "falling" && (
                    <span className="bg-neutral-200 text-black px-2 py-0.5 font-bold flex items-center gap-1 border border-black">
                      <TrendingDown className="w-3.5 h-3.5" /> FALLING
                    </span>
                  )}
                  {p.trend === "stable" && (
                    <span className="bg-white text-black px-2 py-0.5 font-bold flex items-center gap-1 border border-black">
                      <Minus className="w-3.5 h-3.5" /> STABLE
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar & Probability */}
              <div className="mb-3">
                <div className="flex justify-between font-meta text-xs mb-1">
                  <span className="text-neutral-500">PREDICTED SHIFT PROBABILITY</span>
                  <span className="font-bold text-black">{p.predictedProbability}%</span>
                </div>
                <div className="w-full h-3 bg-neutral-200 border border-black">
                  <motion.div
                    className="h-full bg-[#FF4D00]"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.predictedProbability}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Rationale explanation */}
              <div className="text-xs text-neutral-750 font-sans bg-white p-3 border border-neutral-300">
                <span className="font-bold text-black font-meta mr-2">RATIONALE:</span>
                <span className="text-neutral-700 font-sans"><MarkdownMath content={p.trendReason} /></span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
