"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface KaTeXMathProps {
  math: string;
  block?: boolean;
  className?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderMixedKaTeX(content: string, block: boolean): string {
  if (!content) return "";

  // Check if string contains inline $...$ or block $$...$$ delimiter
  if (content.includes("$")) {
    const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);
    return parts
      .map((part) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const formula = part.slice(2, -2);
          try {
            return katex.renderToString(formula, {
              displayMode: true,
              throwOnError: false,
              output: "htmlAndMathml",
            });
          } catch {
            return `<code class="text-red-500">${escapeHtml(part)}</code>`;
          }
        } else if (part.startsWith("$") && part.endsWith("$")) {
          const formula = part.slice(1, -1);
          try {
            return katex.renderToString(formula, {
              displayMode: false,
              throwOnError: false,
              output: "htmlAndMathml",
            });
          } catch {
            return `<code class="text-red-500">${escapeHtml(part)}</code>`;
          }
        } else {
          return escapeHtml(part);
        }
      })
      .join("");
  }

  // Pure LaTeX formula
  try {
    return katex.renderToString(content, {
      displayMode: block,
      throwOnError: false,
      output: "htmlAndMathml",
    });
  } catch {
    return `<code class="font-mono text-sm text-red-600">${escapeHtml(content)}</code>`;
  }
}

export function KaTeXMath({ math, block = false, className = "" }: KaTeXMathProps) {
  const html = useMemo(() => {
    return renderMixedKaTeX(math, block);
  }, [math, block]);

  return (
    <span
      className={`katex-math-wrapper ${block ? "block text-center my-3 overflow-x-auto py-1" : "inline"} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
