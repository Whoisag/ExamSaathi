"use client";

import React from "react";
import { TopicPrediction } from "@/data/mock";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react";

interface TopicPredictionListProps {
  predictions: TopicPrediction[];
  isLoading?: boolean;
}

export function TopicPredictionList({
  predictions,
  isLoading = false,
}: TopicPredictionListProps) {
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

      <div className="space-y-4">
        {predictions.map((p) => {
          return (
            <div
              key={p.id}
              className="border-brutal bg-neutral-50 p-4 sm:p-5 relative group hover:bg-white transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-black text-white font-headline text-sm flex items-center justify-center flex-shrink-0">
                    #{p.rank}
                  </span>
                  <div>
                    <h4 className="font-headline text-base sm:text-lg text-black group-hover:text-[#FF4D00] transition-colors">
                      {p.topicName}
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
                  <div
                    className="h-full bg-[#FF4D00]"
                    style={{ width: `${p.predictedProbability}%` }}
                  ></div>
                </div>
              </div>

              {/* Rationale explanation */}
              <div className="text-xs text-neutral-700 font-sans bg-white p-2.5 border border-neutral-300">
                <span className="font-bold text-black font-meta mr-1.5">RATIONALE:</span>
                <KaTeXMath math={p.trendReason} block={false} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
