"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface CbseDataFreshnessBannerProps {
  examSlug: string;
  className?: string;
}

export function CbseDataFreshnessBanner({
  examSlug,
  className = "",
}: CbseDataFreshnessBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  // Is this exam CBSE Class 12?
  // Only when selected exam is CBSE Class 12. Not visible for JEE Main or JEE Advanced.
  const isCbse12 =
    examSlug.toLowerCase() === "cbse-12" ||
    examSlug.toLowerCase() === "cbse" ||
    examSlug.toLowerCase() === "cbse-class-12";

  useEffect(() => {
    if (!isCbse12) {
      setIsVisible(false);
      setHasCheckedStorage(true);
      return;
    }

    try {
      const stored = localStorage.getItem("cbse_banner_dismissed");
      if (stored) {
        const dismissedAt = parseInt(stored, 10);
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();

        // If stored timestamp is less than 7 days old, do not render
        if (!isNaN(dismissedAt) && now - dismissedAt < sevenDaysMs) {
          setIsVisible(false);
          setHasCheckedStorage(true);
          return;
        }
      }
      // If older than 7 days or not set, render it
      setIsVisible(true);
    } catch {
      // In case localStorage is blocked in private browsing
      setIsVisible(true);
    } finally {
      setHasCheckedStorage(true);
    }
  }, [isCbse12]);

  const handleDismiss = () => {
    try {
      localStorage.setItem("cbse_banner_dismissed", Date.now().toString());
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  // If not CBSE 12 or storage check hasn't run, render nothing
  if (!isCbse12 || !hasCheckedStorage) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cbse-freshness-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: -20,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: "#FFF3ED",
            borderLeft: "2px solid #FF4D00",
            padding: "16px",
          }}
          className={`relative text-black font-sans mb-6 shadow-sm ${className}`}
        >
          <div className="flex items-start justify-between gap-3">
            {/* Banner Text Content */}
            <p
              className="text-[14px] leading-[1.5] text-[#333333] font-normal pr-2"
              style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
            >
              <strong className="font-bold text-black mr-1.5">
                📊 Data Source: AI-Generated Estimate
              </strong>
              Chapter distributions are derived from a synthetic question bank, not actual CBSE PYQs.
              Trend predictions are unavailable until 3+ years of real exam data are loaded.
            </p>

            {/* 
              Close button: an "×" icon in the top-right corner of the banner, 
              #000000, 18px, clickable area 32×32px.
            */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="w-8 h-8 -mr-2 -mt-2 flex items-center justify-center text-black hover:opacity-70 transition-opacity cursor-pointer shrink-0 rounded"
              title="Dismiss for 7 days"
            >
              <span
                style={{
                  fontSize: "18px",
                  lineHeight: "18px",
                  color: "#000000",
                  fontWeight: 400,
                }}
              >
                ×
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
