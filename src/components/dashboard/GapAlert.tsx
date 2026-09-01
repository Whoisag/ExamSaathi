"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMotion, containerVariants, cardVariants } from "@/hooks/useMotion";
import { GapAlertItem } from "@/data/mock";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertTriangle, Clock, Calendar, CheckCircle2 } from "lucide-react";

interface GapAlertProps {
  alerts?: GapAlertItem[] | null;
  isLoading?: boolean;
  isEmpty?: boolean;
  title?: string;
  subtitle?: string;
}

export function GapAlert({
  alerts,
  isLoading = false,
  isEmpty = false,
  title = "Recurrence Gap Alerts",
  subtitle = "High-probability topics overdue based on historical cyclic patterns",
}: GapAlertProps) {
  const { shouldAnimate } = useMotion();
  if (isLoading) {
    return (
      <div className="space-y-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isEmpty || !alerts || alerts.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircle2 className="w-6 h-6 text-[#059669]" />}
        title="No Gap Anomalies"
        description="All standard curriculum topics are currently within expected cyclic distribution intervals."
      />
    );
  }

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-4 sm:p-6 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-neutral-100 gap-2">
        <div>
          <h3 className="font-headline text-base sm:text-xl text-black flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF4D00]" />
            {title}
          </h3>
          <p className="font-meta text-xs text-neutral-500 mt-0.5">{subtitle}</p>
        </div>
        <span className="font-meta text-[10px] font-bold px-3 py-1 bg-[#FF4D00] text-black border border-black shadow-[2px_2px_0px_0px_#000000] self-start sm:self-auto">
          {alerts.length} OVERDUE TOPICS
        </span>
      </div>

      <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="show">
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            variants={cardVariants}
            whileHover={shouldAnimate ? { y: -2, transition: { duration: 0.18 } } : {}}
            style={{ willChange: 'transform' }}
            className="p-4 border-2 border-black bg-white hover:bg-neutral-50 transition-all space-y-3 shadow-[3px_3px_0px_0px_#000000]"
          >
            {/* Title & Badge */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-headline text-sm sm:text-base text-black leading-snug">
                  {alert.topicName}
                </h4>
                <p className="font-meta text-xs text-[#FF4D00] font-bold mt-0.5">{alert.subtopic}</p>
              </div>
              <span
                className={`font-meta text-[10px] font-bold px-2 py-0.5 border border-black uppercase tracking-wider shrink-0 ${
                  alert.predictedUrgency === "High"
                    ? "bg-[#FF4D00] text-black shadow-[1px_1px_0px_0px_#000000]"
                    : "bg-black text-white"
                }`}
              >
                {alert.predictedUrgency} PRIORITY
              </span>
            </div>

            {/* Gap Stats Pill Badges */}
            <div className="flex items-center gap-2 text-xs flex-wrap font-meta text-[11px]">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 border border-black bg-white text-black font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#FF4D00]" />
                LAST: <strong>{alert.lastAppearedYear}</strong>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 border border-black bg-white text-black font-bold">
                <Clock className="w-3.5 h-3.5 text-[#FF4D00]" />
                CYCLE: <strong>EVERY {alert.recurrenceCycleYears} YRS</strong>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 border border-black bg-orange-100 text-black font-bold">
                ⚠️ OVERDUE BY {alert.overdueByYears} YRS
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 border border-black bg-black text-[#FF4D00] font-bold sm:ml-auto">
                +{alert.marksAtStake} MARKS AT STAKE
              </span>
            </div>

            {/* Explanation */}
            <p className="font-sans text-xs text-neutral-700 leading-relaxed pt-2 border-t border-neutral-200">
              {alert.explanation}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
