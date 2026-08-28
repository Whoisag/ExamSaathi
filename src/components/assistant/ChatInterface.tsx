"use client";

import React from "react";
import Link from "next/link";
import { ChatMessage } from "@/data/mock";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { Send, Bot, User, ArrowRight, Lock, Eye } from "lucide-react";

interface ChatInterfaceProps {
  initialMessages: ChatMessage[];
  suggestedPrompts: string[];
  isLoading?: boolean;
}

export function ChatInterface({
  initialMessages,
  suggestedPrompts,
  isLoading = false,
}: ChatInterfaceProps) {
  if (isLoading) {
    return (
      <div className="border-brutal bg-white p-6 animate-pulse space-y-4">
        <div className="h-6 bg-neutral-300 w-1/4"></div>
        <div className="h-40 bg-neutral-100 border-2 border-neutral-200"></div>
        <div className="h-12 bg-neutral-200 w-full"></div>
      </div>
    );
  }

  return (
    <div className="border-brutal bg-white flex flex-col h-[700px] max-h-[80vh]">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-brutal-b bg-black text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF4D00] border border-black flex items-center justify-center font-headline text-black text-sm">
            AI
          </div>
          <div>
            <h3 className="font-headline text-base sm:text-lg text-white">
              EXAMSAATHI NEURAL CHAT
            </h3>
            <span className="font-meta text-[10px] text-neutral-400 block">
              // MOCK AI PYQ AUDIT ENGINE • PREVIEW SESSION
            </span>
          </div>
        </div>

        {/* Read-Only Preview Pill */}
        <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 px-3 py-1 font-meta text-[11px] text-[#FF4D00]">
          <Eye className="w-3.5 h-3.5" />
          <span className="font-bold">PREVIEW MODE ONLY</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-neutral-50">
        {initialMessages.map((msg) => {
          const isBot = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 max-w-3xl ${
                isBot ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 flex-shrink-0 border-brutal flex items-center justify-center font-headline text-xs ${
                  isBot ? "bg-[#FF4D00] text-black" : "bg-black text-white"
                }`}
              >
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div
                className={`border-brutal p-4 sm:p-5 relative ${
                  isBot ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-2 pb-1 border-b border-neutral-200 dark:border-neutral-800">
                  <span
                    className={`font-meta text-[10px] font-bold ${
                      isBot ? "text-[#FF4D00]" : "text-neutral-400"
                    }`}
                  >
                    {isBot ? "EXAMSAATHI AI" : "STUDENT PROMPT"}
                  </span>
                  <span className="font-meta text-[10px] text-neutral-400">
                    {msg.timestamp}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line">
                  {msg.content}
                </div>

                {/* Optional KaTeX Math */}
                {msg.mathLatex && (
                  <div className="mt-3 p-3 bg-neutral-100 text-black border border-black overflow-x-auto text-xs sm:text-sm">
                    <KaTeXMath math={msg.mathLatex} block={true} />
                  </div>
                )}

                {/* Action Chips (Preview Links) */}
                {msg.actionChips && msg.actionChips.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap gap-2">
                    {msg.actionChips.map((chip, idx) => (
                      <React.Fragment key={idx}>
                        {chip.href ? (
                          <Link
                            href={chip.href}
                            className="bg-neutral-100 hover:bg-[#FF4D00] hover:text-black text-neutral-800 font-meta text-[10px] sm:text-xs px-2.5 py-1 border border-black flex items-center gap-1 transition-colors"
                          >
                            <span>{chip.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span
                            key={idx}
                            className="bg-neutral-100 text-neutral-600 font-meta text-[10px] sm:text-xs px-2.5 py-1 border border-neutral-300 flex items-center gap-1 select-none cursor-default"
                          >
                            <span>{chip.label}</span>
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Prompt Chips (Read-Only Preview) */}
      <div className="border-brutal-t p-3 bg-white overflow-x-auto flex gap-2 font-meta text-xs">
        <span className="text-neutral-400 font-bold self-center text-[10px] pl-1 whitespace-nowrap">
          SAMPLE PROMPTS:
        </span>
        {suggestedPrompts.map((p, idx) => (
          <span
            key={idx}
            className="bg-neutral-100 text-neutral-600 border border-neutral-300 px-3 py-1.5 whitespace-nowrap text-[11px] select-none cursor-default"
          >
            {p}
          </span>
        ))}
      </div>

      {/* Disabled Chat Input Bar (Preview Purpose Only) */}
      <div className="border-brutal-t p-3 sm:p-4 bg-neutral-100 flex items-center gap-2">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            disabled
            readOnly
            value=""
            placeholder="Chat input disabled — preview mode only (no live API calls in this shell)"
            className="w-full pl-9 pr-4 py-3 border-brutal text-xs sm:text-sm bg-neutral-200 text-neutral-500 placeholder:text-neutral-500 cursor-not-allowed font-sans select-none"
          />
          <Lock className="w-4 h-4 text-neutral-500 absolute left-3" />
        </div>
        <button
          type="button"
          disabled
          className="bg-neutral-300 text-neutral-500 px-5 py-3 border-brutal font-headline text-sm cursor-not-allowed flex items-center gap-2 select-none opacity-80"
          title="Chat disabled for preview"
        >
          <span>SEND</span>
          <Send className="w-4 h-4 text-neutral-500" />
        </button>
      </div>
    </div>
  );
}
