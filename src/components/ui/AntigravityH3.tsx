"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export type AntigravityH3Variant =
  | "default"
  | "hero"
  | "display"
  | "section"
  | "card"
  | "accent"
  | "muted";

export interface AntigravityH3Props {
  /**
   * Plain text string or React children to animate.
   * If a string is provided or children is a string, letters will animate individually.
   */
  text?: string;
  children?: React.ReactNode;
  /**
   * Tailwind classes to customize or extend the heading style.
   */
  className?: string;
  /**
   * Preset styling variant optimized for different page areas.
   * - hero: Large impact typography for hero banners and intro showcases
   * - section: Bold section headers with responsive sizing and tight tracking
   * - card: Ideal for feature cards, catalog items, and interactive deck sleeves
   * - accent: Kinetic brand orange emphasis with smooth transition
   * - muted: Subtle technical subheader styling
   */
  variant?: AntigravityH3Variant;
  /**
   * Delay before starting the letter animation cascade (in seconds).
   * @default 0.05
   */
  delay?: number;
  /**
   * Stagger duration between consecutive letters (in seconds).
   * @default 0.028
   */
  stagger?: number;
  /**
   * Initial blur strength in pixels before reducing to 0.
   * @default 10
   */
  blurAmount?: number;
  /**
   * Starting vertical slide-up distance in pixels.
   * @default 28
   */
  yOffset?: number;
  /**
   * Per-letter animation duration (in seconds).
   * @default 0.55
   */
  duration?: number;
  /**
   * If true, animation triggers only once when entering viewport.
   * If false, retriggers each time scrolled into view.
   * @default false
   */
  once?: boolean;
  /**
   * Viewport trigger threshold (0 to 1).
   * @default 0.2
   */
  threshold?: number;
  /**
   * Optional words or phrases to highlight in the kinetic accent color (#FF4D00).
   */
  highlightWords?: string[];
  /**
   * Custom accent color override.
   * @default "#FF4D00"
   */
  accentColor?: string;
  /**
   * Semantic HTML element.
   * @default "h3"
   */
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
}

const VARIANT_STYLES: Record<AntigravityH3Variant, string> = {
  default:
    "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-headline tracking-tight text-white hover:text-[#FF4D00]",
  hero:
    "text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-headline tracking-tighter text-white hover:text-[#FF4D00]",
  display:
    "text-[11vw] sm:text-[9vw] md:text-[8vw] lg:text-[7.5vw] font-headline tracking-tight leading-[0.88] text-black",
  section:
    "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-headline tracking-tight text-black hover:text-[#FF4D00]",
  card:
    "text-lg sm:text-xl md:text-2xl font-headline tracking-tight text-black group-hover:text-[#FF4D00]",
  accent:
    "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-headline tracking-tighter text-[#FF4D00] hover:text-white",
  muted:
    "text-base sm:text-lg md:text-xl font-meta tracking-normal text-neutral-400 hover:text-white uppercase",
};

/**
 * AntigravityH3
 * 
 * An Antigravity UI & Motion design H3 heading component built with Tailwind CSS
 * and Framer Motion.
 * 
 * Features:
 * - Responsive font sizing (`text-xl sm:text-2xl md:text-3xl lg:text-4xl`)
 * - Tight letter tracking (`tracking-tight` / `tracking-tighter`)
 * - Smooth color transitions (`transition-colors duration-300 ease-out`)
 * - Complex kinetic motion: each letter fades in (opacity: 0 -> 1),
 *   slides up (y: yOffset -> 0), and reduces blur (blur(Npx) -> blur(0px))
 * - Word-level wrapping preservation (prevents mid-word line-breaks)
 * - Accessible: aria-label preserves natural screen-reader pronunciation
 * - Respects prefers-reduced-motion
 */
export function AntigravityH3({
  text,
  children,
  className = "",
  variant = "default",
  delay = 0.05,
  stagger = 0.028,
  blurAmount = 10,
  yOffset = 28,
  duration = 0.55,
  once = false,
  threshold = 0.2,
  highlightWords = [],
  accentColor = "#FF4D00",
  as = "h3",
}: AntigravityH3Props) {
  const shouldReduceMotion = useReducedMotion();

  // Extract raw string content for character splitting & aria-label
  const contentString = useMemo(() => {
    if (typeof text === "string") return text;
    if (typeof children === "string") return children;
    if (Array.isArray(children)) {
      return children.filter((c) => typeof c === "string").join("");
    }
    return "";
  }, [text, children]);

  // Break string into words for safe line wrapping
  const words = useMemo(() => {
    if (!contentString) return [];
    return contentString.split(/\s+/).filter(Boolean);
  }, [contentString]);

  // Clean set of highlight keywords (case-insensitive)
  const highlightSet = useMemo(() => {
    return new Set(highlightWords.map((w) => w.trim().toLowerCase()));
  }, [highlightWords]);

  // Container variants with staggered children
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : stagger,
        delayChildren: shouldReduceMotion ? 0 : delay,
      },
    },
  };

  // Complex letter-level kinetic variants: fade-in + slide-up + blur-reduction
  const letterVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: yOffset,
          filter: `blur(${blurAmount}px)`,
          scale: 0.96,
        },
    visible: shouldReduceMotion
      ? {
          opacity: 1,
          transition: { duration: 0.25 },
        }
      : {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          transition: {
            type: "spring",
            damping: 18,
            stiffness: 140,
            duration,
          },
        },
  };

  const Component = motion[as];
  const baseStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.default;

  // Fallback for non-string children when no text prop is provided
  if (!contentString && children) {
    return (
      <Component
        initial={{ opacity: 0, y: yOffset, filter: `blur(${blurAmount}px)` }}
        whileInView={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration, ease: [0.22, 1, 0.36, 1] },
        }}
        viewport={{ once, amount: threshold }}
        className={`inline-block transition-colors duration-300 ease-out select-none ${baseStyle} ${className}`}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={containerVariants}
      aria-label={contentString}
      className={`inline-block transition-colors duration-300 ease-out select-none ${baseStyle} ${className}`}
    >
      <span aria-hidden="true" className="inline">
        {words.map((word, wordIndex) => {
          const cleanWord = word.replace(/[^\w-]/g, "").toLowerCase();
          const isHighlighted = highlightSet.has(cleanWord);

          return (
            <span
              key={`${word}-${wordIndex}`}
              className="inline-block whitespace-nowrap"
            >
              {word.split("").map((char, charIndex) => (
                <motion.span
                  key={`${char}-${charIndex}`}
                  variants={letterVariants}
                  style={{
                    willChange: "transform, opacity, filter",
                    color: isHighlighted ? accentColor : undefined,
                  }}
                  className="inline-block transition-colors duration-300 ease-out"
                >
                  {char}
                </motion.span>
              ))}
              {/* Maintain natural inter-word spacing */}
              {wordIndex < words.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          );
        })}
      </span>
    </Component>
  );
}

export default AntigravityH3;
