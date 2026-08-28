"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ArrowRight, UserPlus } from "lucide-react";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function LoginPromptModal({
  isOpen,
  onClose,
  title = "PLEASE LOGIN FIRST",
  message = "You must be signed in to access complete high-yield formula cheatsheets and examine live chapter predictive models.",
}: LoginPromptModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
          />

          {/* Brutalist Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md bg-white border-4 border-black p-6 sm:p-8 shadow-[10px_10px_0px_0px_#000000]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 border-2 border-black bg-black text-white hover:bg-[#FF4D00] hover:text-black flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Brutalist Tag */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-meta text-xs font-bold text-black bg-[#FF4D00] px-3 py-1 border-2 border-black inline-flex items-center gap-1.5 shadow-[3px_3px_0px_0px_#000000]">
                <Lock className="w-3.5 h-3.5 text-black" />
                <span>AUTHENTICATION REQUIRED</span>
              </span>
            </div>

            {/* Headline */}
            <h3 className="font-headline text-3xl sm:text-4xl text-black tracking-tight leading-[0.92] mt-3 mb-4">
              {title}
            </h3>

            {/* Body Description */}
            <p className="font-sans text-sm sm:text-base text-neutral-800 font-medium leading-relaxed mb-8">
              {message}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <Link
                href="/login"
                onClick={onClose}
                className="flex-1 bg-[#FF4D00] text-black hover:bg-black hover:text-white px-5 py-3.5 border-2 border-black font-headline text-sm tracking-wider uppercase text-center flex items-center justify-center gap-2 transition-colors shadow-[4px_4px_0px_0px_#000000]"
              >
                <span>LOGIN NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="flex-1 bg-black text-white hover:bg-white hover:text-black px-5 py-3.5 border-2 border-black font-headline text-sm tracking-wider uppercase text-center flex items-center justify-center gap-2 transition-colors shadow-[4px_4px_0px_0px_#000000]"
              >
                <span>SIGN UP</span>
                <UserPlus className="w-4 h-4" />
              </Link>
            </div>

            {/* Dismiss note */}
            <div className="mt-4 text-center">
              <button
                onClick={onClose}
                className="font-meta text-xs text-neutral-500 hover:text-black underline cursor-pointer"
              >
                [ CLOSE THIS POPUP ]
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
