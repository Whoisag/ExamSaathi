"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChatMessage } from "@/data/mock";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { Send, Bot, User, Sparkles, ArrowRight, CornerDownLeft, RefreshCw } from "lucide-react";

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
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputVal, setInputVal] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsReplying(true);

    // Mock intelligent assistant reply
    setTimeout(() => {
      let replyContent = "Here is the statistical breakdown for your query based on our 2019-2025 shift audit:";
      let mathFormula: string | undefined = undefined;

      if (text.toLowerCase().includes("overdue") || text.toLowerCase().includes("gap")) {
        replyContent =
          "According to our Poisson recurrence cycle model, **Davisson-Germer Electron Diffraction** and **Single Slit Central Maxima Width** have the highest overdue intensity ($>1.5$ years overdue cycle). High probability for upcoming Session 1 shifts.";
        mathFormula = "P(\\text{return in shift } t) = 1 - e^{-\\lambda_0 (1 + 1.4 \\Delta t)}";
      } else if (text.toLowerCase().includes("formula") || text.toLowerCase().includes("rotational")) {
        replyContent =
          "For Rotational Dynamics, 64% of recent numericals test parallel and perpendicular axis theorems combined with rolling without slipping energy conservation:";
        mathFormula = "K_{\\text{total}} = \\frac{1}{2} M v_{\\text{cm}}^2 \\left(1 + \\frac{k^2}{R^2}\\right)";
      } else {
        replyContent =
          `I analyzed your query: "${text}". In the post-2024 rationalized syllabus, NTA questions have shifted toward concept-synthesis questions rather than simple single-step substitutions. Focus heavily on core NCERT derivations and high-frequency PYQs.`;
      }

      const botMsg: ChatMessage = {
        id: "bot-" + Date.now(),
        role: "assistant",
        content: replyContent,
        mathLatex: mathFormula,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionChips: [
          { label: "Open Modern Physics Analyzer", href: "/analyzer/jee-main/modern-physics" },
          { label: "Formula Sheet", href: "/formulas/jee-main/physics" },
        ],
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsReplying(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
              // MOCK AI PYQ AUDIT ENGINE • ACTIVE LOCAL SESSION
            </span>
          </div>
        </div>

        <button
          onClick={() => setMessages(initialMessages)}
          className="font-meta text-xs text-neutral-400 hover:text-white flex items-center gap-1 border border-neutral-700 px-2 py-1"
          title="Reset conversation"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">RESET CHAT</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-neutral-50">
        {messages.map((msg) => {
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
                  isBot
                    ? "bg-white text-black"
                    : "bg-black text-white"
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-2 pb-1 border-b border-neutral-200 dark:border-neutral-800">
                  <span
                    className={`font-meta text-[10px] font-bold ${
                      isBot ? "text-[#FF4D00]" : "text-neutral-400"
                    }`}
                  >
                    {isBot ? "EXAMSAATHI AI" : "YOU"}
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

                {/* Action Chips */}
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
                          <button
                            onClick={() => handleSend(chip.label)}
                            className="bg-neutral-100 hover:bg-[#FF4D00] hover:text-black text-neutral-800 font-meta text-[10px] sm:text-xs px-2.5 py-1 border border-black flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>{chip.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isReplying && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-8 h-8 border-brutal bg-[#FF4D00] flex items-center justify-center">
              <Bot className="w-4 h-4 text-black" />
            </div>
            <div className="border-brutal bg-white p-3 font-meta text-xs text-neutral-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FF4D00] animate-ping"></span>
              <span>SYNTHESIZING SHIFT PROBABILITIES...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="border-brutal-t p-3 bg-white overflow-x-auto flex gap-2 font-meta text-xs">
        <span className="text-neutral-400 font-bold self-center text-[10px] pl-1 whitespace-nowrap">
          SUGGESTIONS:
        </span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="bg-neutral-50 hover:bg-black hover:text-white text-neutral-800 border border-black px-3 py-1.5 whitespace-nowrap text-[11px] transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box Bar */}
      <div className="border-brutal-t p-3 sm:p-4 bg-white flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about topic weightage, recurring gap alerts, or formula derivations..."
          className="flex-1 px-4 py-3 border-brutal text-xs sm:text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00] font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputVal.trim() || isReplying}
          className="bg-[#FF4D00] text-black px-5 py-3 border-brutal font-headline text-sm hover:bg-black hover:text-[#FF4D00] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>SEND</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
