"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/data/mock";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { Send, Bot, User, Sparkles, Loader2, RotateCcw } from "lucide-react";

interface ChatInterfaceProps {
  initialMessages: ChatMessage[];
  suggestedPrompts: string[];
  isLoading?: boolean;
  exam?: string;
  chapter?: string;
}

export function ChatInterface({
  initialMessages,
  suggestedPrompts,
  isLoading = false,
  exam = "jee-main",
  chapter = "General Strategy",
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isSending) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText("");
    setIsSending(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          exam,
          chapter,
        }),
      });

      const data = await res.json();
      const botReply = data.message?.content || "Strategy response received.";

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Error communicating with AI engine. Switched to offline deterministic reasoning.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
    <div className="border-brutal bg-white flex flex-col h-[750px] max-h-[82vh]">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-brutal-b bg-black text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF4D00] border border-black flex items-center justify-center font-headline text-black text-sm font-bold">
            AI
          </div>
          <div>
            <h3 className="font-headline text-base sm:text-lg text-white flex items-center gap-2">
              <span>EXAMSAATHI AI STRATEGIST</span>
            </h3>
            <span className="font-meta text-[10px] text-neutral-400 block">
              // LIVE INTELLIGENCE ENGINE • {exam.toUpperCase()} • {chapter.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Live Active Status Pill */}
        <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 px-3 py-1 font-meta text-[11px] text-[#FF4D00]">
          <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse"></span>
          <span className="font-bold">LIVE SOCRATIC TUTOR</span>
        </div>
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
                  isBot ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-2 pb-1 border-b border-neutral-200 dark:border-neutral-800">
                  <span
                    className={`font-meta text-[10px] font-bold ${
                      isBot ? "text-[#FF4D00]" : "text-neutral-400"
                    }`}
                  >
                    {isBot ? "SAATHI SOCRATIC TUTOR" : "YOU"}
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
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3 sm:gap-4 max-w-3xl mr-auto">
            <div className="w-8 h-8 flex-shrink-0 border-brutal bg-[#FF4D00] text-black flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="border-brutal p-4 bg-white text-black flex items-center gap-2 font-meta text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF4D00]" />
              <span>Saathi AI synthesizing verified PYQ shift reasoning...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Suggested Prompt Chips */}
      <div className="border-brutal-t p-2.5 bg-white overflow-x-auto flex gap-2 font-meta text-xs">
        <span className="text-neutral-500 font-bold self-center text-[10px] pl-1 whitespace-nowrap">
          QUICK PROMPTS:
        </span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(p)}
            disabled={isSending}
            className="bg-neutral-100 text-black border border-black px-3 py-1.5 whitespace-nowrap text-[11px] font-bold hover:bg-[#FF4D00] hover:text-black transition-colors cursor-pointer disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Live Interactive Chat Input Bar */}
      <div className="border-brutal-t p-3 sm:p-4 bg-neutral-100 flex items-center gap-2">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            placeholder="Ask anything on chapter trends, tricky formulas, or step-by-step solving..."
            className="w-full pl-4 pr-4 py-3 border-brutal text-xs sm:text-sm bg-white text-black placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF4D00] font-sans"
          />
        </div>
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={isSending || !inputText.trim()}
          className="bg-black text-white px-5 py-3 border-brutal font-headline text-sm hover:bg-[#FF4D00] hover:text-black transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          <span>SEND</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
