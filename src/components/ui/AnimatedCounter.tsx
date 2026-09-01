"use client";
import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/hooks/useMotion";

export function AnimatedCounter({ value, duration = 1200, suffix = "" }: { value: number; duration?: number; suffix?: string }) {
  const { shouldAnimate } = useMotion();
  const [display, setDisplay] = useState(shouldAnimate ? 0 : value);
  const rafRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!shouldAnimate) { setDisplay(value); return; }
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration, shouldAnimate]);
  
  return <span>{display}{suffix}</span>;
}
