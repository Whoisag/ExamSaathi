"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface KaTeXMathProps {
  math: string;
  block?: boolean;
  className?: string;
}

export function KaTeXMath({ math, block = false, className = "" }: KaTeXMathProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        output: "htmlAndMathml",
      });
    } catch {
      return `<code class="font-mono text-sm text-red-600">${math}</code>`;
    }
  }, [math, block]);

  return (
    <span
      className={`katex-math-wrapper font-mono ${block ? "block text-center my-3 overflow-x-auto py-1" : "inline-block"} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
