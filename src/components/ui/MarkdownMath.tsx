"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MarkdownMathProps {
  content: string;
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

function renderMathToHtml(math: string, displayMode: boolean): string {
  try {
    return katex.renderToString(math.trim(), {
      displayMode,
      throwOnError: false,
      output: "htmlAndMathml",
    });
  } catch {
    return `<code class="bg-neutral-100 text-red-600 px-1 font-mono">${escapeHtml(math)}</code>`;
  }
}

/**
 * Parses markdown text while preserving and rendering KaTeX math equations
 */
export function MarkdownMath({ content, className = "" }: MarkdownMathProps) {
  const renderedHtml = useMemo(() => {
    if (!content) return "";

    // 1. First, replace all block math $$...$$ and inline math $...$ with unique placeholders
    const mathMap: Array<{ placeholder: string; html: string; isBlock: boolean }> = [];
    let mathIndex = 0;

    // Replace block math $$...$$
    let text = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      const placeholder = `___MATH_BLOCK_${mathIndex++}___`;
      const html = `<div class="my-3 p-3 bg-neutral-50 border-2 border-black overflow-x-auto text-center">${renderMathToHtml(math, true)}</div>`;
      mathMap.push({ placeholder, html, isBlock: true });
      return placeholder;
    });

    // Replace inline math $...$ (ensure not matched with escaped \$ or within currencies like $10)
    text = text.replace(/(?<!\\)\$([^\$\n]+?)(?<!\\)\$/g, (_, math) => {
      const placeholder = `___MATH_INLINE_${mathIndex++}___`;
      const html = `<span class="inline-math font-medium px-0.5">${renderMathToHtml(math, false)}</span>`;
      mathMap.push({ placeholder, html, isBlock: false });
      return placeholder;
    });

    // 2. Parse Markdown elements
    const lines = text.split("\n");
    const parsedLines: string[] = [];
    let inTable = false;
    let tableRows: string[] = [];

    const flushTable = () => {
      if (tableRows.length > 0) {
        let tableHtml = `<div class="overflow-x-auto my-3"><table class="w-full border-collapse border-2 border-black font-sans text-xs sm:text-sm">`;
        tableRows.forEach((row, idx) => {
          const cells = row
            .split("|")
            .map((c) => c.trim())
            .filter((c, i, arr) => i > 0 && i < arr.length - 1);

          // Skip separator row like |---|---|
          if (cells.every((c) => /^[:-]+$/.test(c))) {
            return;
          }

          if (idx === 0) {
            tableHtml += `<thead class="bg-black text-white"><tr>`;
            cells.forEach((cell) => {
              tableHtml += `<th class="border-2 border-black p-2 font-headline font-bold text-left">${cell}</th>`;
            });
            tableHtml += `</tr></thead><tbody>`;
          } else {
            tableHtml += `<tr class="${idx % 2 === 0 ? "bg-white" : "bg-neutral-100"}">`;
            cells.forEach((cell) => {
              tableHtml += `<td class="border border-neutral-300 p-2 font-medium">${cell}</td>`;
            });
            tableHtml += `</tr>`;
          }
        });
        tableHtml += `</tbody></table></div>`;
        parsedLines.push(tableHtml);
        tableRows = [];
      }
      inTable = false;
    };

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Table line detection
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        inTable = true;
        tableRows.push(line.trim());
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Horizontal Rule
      if (/^(\*\*\*|---|___)$/.test(line.trim())) {
        parsedLines.push(`<hr class="my-4 border-t-2 border-black" />`);
        continue;
      }

      // Headings
      if (line.startsWith("### ")) {
        const title = line.replace(/^###\s+/, "");
        parsedLines.push(`<h4 class="font-headline text-base sm:text-lg text-black mt-4 mb-2 flex items-center gap-1.5 font-bold">${title}</h4>`);
        continue;
      }
      if (line.startsWith("## ")) {
        const title = line.replace(/^##\s+/, "");
        parsedLines.push(`<h3 class="font-headline text-lg sm:text-xl text-black mt-5 mb-2 pb-1 border-b-2 border-black font-bold">${title}</h3>`);
        continue;
      }
      if (line.startsWith("# ")) {
        const title = line.replace(/^#\s+/, "");
        parsedLines.push(`<h2 class="font-headline text-xl sm:text-2xl text-black mt-6 mb-3 font-bold uppercase tracking-tight">${title}</h2>`);
        continue;
      }

      // Blockquotes
      if (line.startsWith("> ")) {
        const quote = line.replace(/^>\s+/, "");
        parsedLines.push(`<blockquote class="border-l-4 border-[#FF4D00] bg-neutral-100 p-3 my-2 text-xs sm:text-sm font-medium italic text-neutral-800">${quote}</blockquote>`);
        continue;
      }

      // Bullet lists
      if (/^[-*]\s+/.test(line.trim())) {
        const bulletText = line.trim().replace(/^[-*]\s+/, "");
        parsedLines.push(`<div class="flex items-start gap-2 my-1 pl-1"><span class="w-1.5 h-1.5 rounded-full bg-[#FF4D00] mt-1.5 flex-shrink-0"></span><span class="text-xs sm:text-sm font-sans">${bulletText}</span></div>`);
        continue;
      }

      // Numbered lists
      if (/^\d+\.\s+/.test(line.trim())) {
        const match = line.trim().match(/^(\d+)\.\s+(.*)$/);
        if (match) {
          const num = match[1];
          const itemText = match[2];
          parsedLines.push(`<div class="flex items-start gap-2 my-1.5 pl-1"><span class="font-meta font-bold text-xs bg-black text-white w-5 h-5 flex items-center justify-center flex-shrink-0 text-[10px]">${num}</span><span class="text-xs sm:text-sm font-sans">${itemText}</span></div>`);
          continue;
        }
      }

      // Empty line
      if (!line.trim()) {
        parsedLines.push(`<div class="h-2"></div>`);
        continue;
      }

      // Regular paragraph line
      parsedLines.push(`<p class="my-1 text-xs sm:text-sm leading-relaxed">${line}</p>`);
    }

    if (inTable) {
      flushTable();
    }

    let finalHtml = parsedLines.join("");

    // Bold formatting: **text**
    finalHtml = finalHtml.replace(/\*\*(.+?)\*\*/g, `<strong class="font-bold text-black">$1</strong>`);

    // Italic formatting: *text* (avoiding math tags)
    finalHtml = finalHtml.replace(/(?<![\\_])\*([^\*]+?)\*(?![\\_])/g, `<em class="italic">$1</em>`);

    // 3. Re-inject rendered KaTeX math HTML into placeholders
    for (const item of mathMap) {
      finalHtml = finalHtml.replace(item.placeholder, item.html);
    }

    return finalHtml;
  }, [content]);

  return (
    <div
      className={`markdown-math-renderer font-sans text-black leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
