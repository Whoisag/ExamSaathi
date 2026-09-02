"use client";

import React, { useMemo } from "react";
import katex from "katex";
import { findScientificDiagram } from "@/lib/scientificDiagrams";

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

      // Downloadable PDF Card: :::pdf-download{...}:::
      if (line.includes(":::pdf-download")) {
        const match = line.match(/:::pdf-download(\{.*?\})?:::/);
        let meta = { title: "Class 12 Revision Guide", chapter: "Chapter Revision", exam: "CBSE Class 12" };
        if (match && match[1]) {
          try {
            meta = { ...meta, ...JSON.parse(match[1]) };
          } catch {}
        }
        const jsonStr = escapeHtml(JSON.stringify(meta));
        parsedLines.push(`
          <div class="my-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
            <div class="bg-black text-white px-3.5 py-2.5 flex items-center justify-between border-b-2 border-black">
              <span class="font-meta text-xs font-bold text-[#FF4D00] flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse"></span>
                OFFICIAL REVISION CHEATSHEET (PDF)
              </span>
              <span class="font-meta text-[10px] uppercase font-bold bg-[#FF4D00] text-black px-2 py-0.5 border border-black">
                READY FOR DOWNLOAD
              </span>
            </div>
            <div class="p-4 bg-neutral-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 class="font-headline text-base text-black font-bold uppercase tracking-tight">${escapeHtml(meta.title)}</h4>
                <p class="font-sans text-xs text-neutral-700 mt-1">
                  Complete Class 12 Master Guide • Formulas • Principal Value Branches &amp; PYQs
                </p>
              </div>
              <button
                type="button"
                onclick="window.dispatchEvent(new CustomEvent('examsaathi:download-pdf', { detail: ${jsonStr} }))"
                class="cursor-pointer bg-[#FF4D00] hover:bg-black text-black hover:text-white px-4 py-2.5 border-2 border-black font-headline text-xs font-bold transition-all shadow-[2px_2px_0px_0px_#000000] hover:translate-y-0.5 hover:shadow-none shrink-0 flex items-center gap-2"
              >
                <span>📥 DOWNLOAD PDF</span>
              </button>
            </div>
          </div>
        `);
        continue;
      }

      // Curated SVG Scientific Diagram: :::diagram{...}:::
      if (line.includes(":::diagram")) {
        const match = line.match(/:::diagram(\{.*?\})?:::/);
        let id = "compound-microscope";
        if (match && match[1]) {
          try {
            const parsed = JSON.parse(match[1]);
            id = parsed.id || id;
          } catch {}
        }
        const diag = findScientificDiagram(id);
        if (diag) {
          parsedLines.push(`
            <figure class="my-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
              <div class="bg-black px-3 py-2 border-b-2 border-black flex items-center justify-between text-white">
                <span class="font-meta text-[11px] uppercase font-bold text-[#FF4D00] flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-[#FF4D00] inline-block animate-pulse"></span>
                  SCIENTIFIC SCHEMATIC // ${escapeHtml(diag.title)}
                </span>
                <span class="font-meta text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                  VECTOR SVG
                </span>
              </div>
              <div class="p-3 bg-white flex items-center justify-center overflow-x-auto">
                ${diag.svg}
              </div>
              <figcaption class="px-3.5 py-2.5 border-t-2 border-black bg-neutral-50 font-sans text-xs text-neutral-800">
                <div class="font-bold text-black mb-1">Key Components &amp; Construction:</div>
                <ul class="list-disc pl-4 space-y-0.5 text-neutral-700">
                  ${diag.parts.map(p => `<li>${escapeHtml(p)}</li>`).join("")}
                </ul>
              </figcaption>
            </figure>
          `);
          continue;
        }
      }

      // Markdown Images: ![caption](url)
      if (line.includes("![") && line.includes("](")) {
        line = line.replace(/!\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g, (_, cap, u) => {
          const caption = cap || "Educational Scientific Diagram";
          // If this matches any verified scientific diagram, render real vector SVG rather than psychedelic bubble art!
          const diag = findScientificDiagram(caption + " " + u);
          if (diag) {
            return `
              <figure class="my-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
                <div class="bg-black px-3 py-2 border-b-2 border-black flex items-center justify-between text-white">
                  <span class="font-meta text-[11px] uppercase font-bold text-[#FF4D00] flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-[#FF4D00] inline-block animate-pulse"></span>
                    SCIENTIFIC SCHEMATIC // ${escapeHtml(diag.title)}
                  </span>
                  <span class="font-meta text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                    VECTOR SVG
                  </span>
                </div>
                <div class="p-3 bg-white flex items-center justify-center overflow-x-auto">
                  ${diag.svg}
                </div>
                <figcaption class="px-3.5 py-2.5 border-t-2 border-black bg-neutral-50 font-sans text-xs text-neutral-800">
                  <div class="font-bold text-black mb-1">Key Components &amp; Construction:</div>
                  <ul class="list-disc pl-4 space-y-0.5 text-neutral-700">
                    ${diag.parts.map(p => `<li>${escapeHtml(p)}</li>`).join("")}
                  </ul>
                </figcaption>
              </figure>
            `;
          }

          return `
            <figure class="my-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
              <div class="bg-black px-3 py-2 border-b-2 border-black flex items-center justify-between text-white">
                <span class="font-meta text-[11px] uppercase font-bold text-[#FF4D00] flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-[#FF4D00] inline-block animate-pulse"></span>
                  VISUAL DIAGRAM // ${escapeHtml(caption)}
                </span>
                <a href="${escapeHtml(u)}" target="_blank" rel="noopener noreferrer" class="font-meta text-[10px] uppercase tracking-wider text-white hover:text-[#FF4D00] underline font-bold">
                  VIEW FULL SIZE ↗
                </a>
              </div>
              <div class="p-3 bg-neutral-100 flex items-center justify-center">
                <img src="${escapeHtml(u)}" alt="${escapeHtml(caption)}" class="max-h-[420px] w-auto max-w-full object-contain border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000000]" loading="lazy" />
              </div>
              <figcaption class="px-3.5 py-2 border-t-2 border-black bg-white font-sans text-xs text-neutral-800 flex items-center justify-between gap-2">
                <span class="font-medium">${escapeHtml(caption)}</span>
                <a href="${escapeHtml(u)}" target="_blank" rel="noopener noreferrer" class="font-meta text-[10px] bg-[#FF4D00] text-black px-2 py-0.5 border border-black font-bold uppercase hover:bg-black hover:text-white transition-colors shrink-0">
                  OPEN IMAGE
                </a>
              </figcaption>
            </figure>
          `;
        });
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
