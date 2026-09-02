"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMotion, containerVariants, cardVariants } from "@/hooks/useMotion";
import { TopicPrediction } from "@/data/mock";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sparkles, TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react";

interface TopicPredictorProps {
  predictions?: TopicPrediction[] | null;
  isLoading?: boolean;
  isEmpty?: boolean;
  title?: string;
  subtitle?: string;
}

export function TopicPredictor({
  predictions,
  isLoading = false,
  isEmpty = false,
  title = "Predicted High-Yield Topics",
  subtitle = "Ranked likelihood for upcoming 2026 examination shifts",
}: TopicPredictorProps) {
  const { shouldAnimate } = useMotion();
  if (isLoading) {
    return (
      <div className="space-y-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isEmpty || !predictions || predictions.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles className="w-6 h-6 text-slate-400" />}
        title="No Predictions Available"
        description="Predictive model outputs have not been generated for the selected subject."
      />
    );
  }

  const getTrendBadge = (trend: TopicPrediction["trend"]) => {
    switch (trend) {
      case "rising":
        return (
          <span className="inline-flex items-center gap-1 font-meta text-[10px] font-bold px-2.5 py-0.5 bg-[#FF4D00] text-black border border-black shadow-[1px_1px_0px_0px_#000000]">
            <TrendingUp className="w-3 h-3" />
            RISING
          </span>
        );
      case "falling":
        return (
          <span className="inline-flex items-center gap-1 font-meta text-[10px] font-bold px-2.5 py-0.5 bg-neutral-200 text-black border border-black">
            <TrendingDown className="w-3 h-3" />
            FALLING
          </span>
        );
      case "stable":
      default:
        return (
          <span className="inline-flex items-center gap-1 font-meta text-[10px] font-bold px-2.5 py-0.5 bg-white text-black border border-black">
            <Minus className="w-3 h-3" />
            STABLE
          </span>
        );
    }
  };

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-4 sm:p-6 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-neutral-100 gap-2">
        <div>
          <h3 className="font-headline text-base sm:text-xl text-black flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF4D00]" />
            {title}
          </h3>
          <p className="font-meta text-xs text-neutral-500 mt-0.5">{subtitle}</p>
        </div>
        <span className="font-meta text-[10px] font-bold px-3 py-1 bg-black text-[#FF4D00] border border-black shadow-[2px_2px_0px_0px_#FF4D00] self-start sm:self-auto">
          TOP {predictions.length} HIGH-YIELD
        </span>
      </div>

      <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="show">
        {predictions.map((item, index) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={shouldAnimate ? { y: -3, transition: { duration: 0.2 } } : {}}
            style={{ willChange: 'transform' }}
            className={`p-4 border-2 border-black bg-white hover:bg-neutral-50 transition-all space-y-3 shadow-[3px_3px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#000000] group ${
              item.rank === 1 ? "border-l-4 border-l-[#FF4D00]" : ""
            }`}
          >
            {/* Header: Rank + Title + Trend Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <span
                  className={`w-7 h-7 border-2 border-black flex items-center justify-center font-headline text-xs font-bold shrink-0 mt-0.5 ${
                    item.rank === 1
                      ? "bg-[#FF4D00] text-black shadow-[2px_2px_0px_0px_#000000]"
                      : item.rank === 2
                      ? "bg-black text-[#FF4D00]"
                      : item.rank === 3
                      ? "bg-neutral-200 text-black"
                      : "bg-white text-neutral-700"
                  }`}
                >
                  #{item.rank}
                </span>
                <div>
                  <h4 className="font-headline text-sm sm:text-base text-black group-hover:text-[#FF4D00] transition-colors leading-snug">
                    {item.topicName}
                  </h4>
                  <div className="flex items-center gap-2 font-meta text-[11px] text-neutral-600 mt-1 flex-wrap">
                    <span className="font-bold text-black">{item.category}</span>
                    <span>•</span>
                    <span className="font-mono text-black">{item.expectedQuestions}</span>
                    <span>•</span>
                    <span className="text-[#FF4D00] font-bold">{item.shiftCoverage}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">{getTrendBadge(item.trend)}</div>
            </div>

            {/* Probability Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-meta text-[10px] text-neutral-600 uppercase font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]" />
                  Shift Probability
                </span>
                <span className="font-mono font-bold text-black text-xs">
                  {item.predictedProbability}%
                </span>
              </div>
              <div className="w-full bg-neutral-100 border border-black h-2.5 overflow-hidden">
                <motion.div
                  className="h-full bg-[#FF4D00] shadow-[0_0_8px_rgba(255,77,0,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.predictedProbability}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Reasoning Note + Direct Drill Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-50 p-2.5 border border-black">
              <p className="font-meta text-[11px] text-neutral-800 leading-relaxed flex-1">
                💡 {item.trendReason}
              </p>
              <a
                href={`/dashboard/practice?topic=${encodeURIComponent(item.topicName)}`}
                className="font-meta text-[10px] font-bold text-black hover:text-white bg-[#FF4D00] hover:bg-black px-2.5 py-1 border border-black transition-colors shrink-0 self-start sm:self-auto flex items-center gap-1 shadow-[1px_1px_0px_0px_#000000]"
              >
                <span>DRILL PYQs</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
