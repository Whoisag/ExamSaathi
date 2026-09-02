"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChatMessage } from "@/data/mock";
import { MarkdownMath } from "@/components/ui/MarkdownMath";
import {
  Send, Bot, User, Loader2, Maximize2, Minimize2,
  History, Plus, Sparkles, Copy, Check, Download, Palette,
} from "lucide-react";
import {
  ChatHistoryPanel,
  ChatSession,
  saveSession,
} from "./ChatHistoryPanel";

interface ChatInterfaceProps {
  initialMessages: ChatMessage[];
  suggestedPrompts: string[];
  isLoading?: boolean;
  exam?: string;
  chapter?: string;
  prepHubContext?: string;
  initialQuery?: string;
}

function generateSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ChatInterface({
  initialMessages,
  suggestedPrompts,
  isLoading = false,
  exam = "jee-main",
  chapter = "General Strategy",
  prepHubContext,
  initialQuery,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState(initialQuery || "");
  const [isSending, setIsSending] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sessionId] = useState(generateSessionId);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const hasAutoSentRef = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isSending, scrollToBottom]);

  // ── Persist chat to localStorage whenever messages change ─────────────────
  useEffect(() => {
    const userMsgs = messages.filter((m) => m.role === "user");
    if (userMsgs.length === 0) return;
    const session: ChatSession = {
      id: sessionId,
      exam,
      chapter,
      title: userMsgs[0].content.slice(0, 60) + (userMsgs[0].content.length > 60 ? "…" : ""),
      createdAt: new Date().toISOString(),
      messages,
    };
    saveSession(session);
  }, [messages, sessionId, exam, chapter]);

  // ── Fullscreen toggle (uses browser Fullscreen API on the container) ───────
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fallback: CSS-based fullscreen if browser API blocked
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  // Sync state if user presses Escape key to exit fullscreen natively
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
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
          prepHubContext: prepHubContext || "",
        }),
      });

      const data = await res.json();
      let botReply = data.message?.content || "Strategy response received.";

      // Strip accidental thinking scratchpads
      if (/^(?:Here['']?s a thinking process:?|Thinking Process:?)/i.test(botReply.trim())) {
        const splitMatch = botReply.match(/\n(?:\s*---+\s*\n|\s*#{1,4}\s+|\s*\*\*[A-Z0-9]|\s*(?:Here (?:are|is)|Top \d|Below is|In this chapter|Based on))\b/i);
        if (splitMatch?.index && splitMatch.index > 20) {
          botReply = botReply.slice(splitMatch.index).trim();
        }
      }

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Error communicating with AI engine. Switched to offline deterministic reasoning.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages(initialMessages);
    setInputText("");
    inputRef.current?.focus();
  };

  const handleRestoreSession = (session: ChatSession) => {
    setMessages(session.messages as ChatMessage[]);
  };

  // Auto-send initial query on mount (e.g. from Practice Question or Prep Hub)
  useEffect(() => {
    if (initialQuery && !hasAutoSentRef.current) {
      hasAutoSentRef.current = true;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleCopyMessage = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard fallback
    }
  };

  const handleExportChat = () => {
    const header = `# ExamSaathi AI Strategy Session\n- Exam: ${exam.toUpperCase()}\n- Chapter: ${chapter}\n- Date: ${new Date().toLocaleString()}\n\n---\n\n`;
    const body = messages
      .map(
        (m) =>
          `### ${m.role === "assistant" ? "🤖 Saathi Socratic Tutor" : "👤 Student"} (${m.timestamp})\n\n${m.content}\n`
      )
      .join("\n---\n\n");
    const blob = new Blob([header + body], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `examsaathi-chat-${exam}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="border-brutal bg-white p-6 animate-pulse space-y-4">
        <div className="h-6 bg-neutral-300 w-1/4" />
        <div className="h-40 bg-neutral-100 border-2 border-neutral-200" />
        <div className="h-12 bg-neutral-200 w-full" />
      </div>
    );
  }

  // ── Fullscreen CSS fallback classes ───────────────────────────────────────
  const fsClass = isFullscreen && !document.fullscreenElement
    ? "fixed inset-0 z-[9999] !h-screen !max-h-screen"
    : "";

  return (
    <>
      {/* History Panel */}
      <ChatHistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onRestore={handleRestoreSession}
        currentSessionId={sessionId}
      />

      {/* Chat Container */}
      <div
        ref={containerRef}
        className={`border-brutal bg-white flex flex-col h-[750px] max-h-[82vh] ${fsClass} fullscreen:h-screen fullscreen:max-h-screen fullscreen:border-0`}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="p-3 sm:p-4 border-brutal-b bg-black text-white flex items-center justify-between shrink-0 gap-2">
          {/* Left: AI branding */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-[#FF4D00] border border-black flex items-center justify-center font-headline text-black text-sm font-bold shrink-0">
              AI
            </div>
            <div className="min-w-0">
              <h3 className="font-headline text-sm sm:text-base text-white truncate">
                EXAMSAATHI AI STRATEGIST
              </h3>
              <span className="font-meta text-[10px] text-neutral-400 block truncate flex items-center gap-2">
                // {exam.toUpperCase()} • {chapter.toUpperCase()}
                {prepHubContext && (
                  <span className="font-meta text-[9px] bg-[#FF4D00] text-black px-2 py-0.5 font-bold">PREP HUB LINKED</span>
                )}
              </span>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Live pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 px-2.5 py-1 font-meta text-[10px] text-[#FF4D00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-pulse" />
              <span className="font-bold">LIVE</span>
            </div>

            {/* New Chat */}
            <button
              onClick={handleNewChat}
              title="New Chat"
              className="w-8 h-8 border border-neutral-700 hover:border-[#FF4D00] hover:bg-neutral-900 flex items-center justify-center cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Export Chat */}
            <button
              onClick={handleExportChat}
              title="Export Conversation as Markdown"
              className="w-8 h-8 border border-neutral-700 hover:border-[#FF4D00] hover:bg-neutral-900 flex items-center justify-center cursor-pointer transition-colors text-neutral-300 hover:text-[#FF4D00]"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* History */}
            <button
              onClick={() => setHistoryOpen(true)}
              title="Chat History"
              className="w-8 h-8 border border-neutral-700 hover:border-[#FF4D00] hover:bg-neutral-900 flex items-center justify-center cursor-pointer transition-colors"
            >
              <History className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              className="w-8 h-8 border border-neutral-700 hover:border-[#FF4D00] hover:bg-neutral-900 flex items-center justify-center cursor-pointer transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* ── Messages Area ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-neutral-50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <div className="w-14 h-14 bg-black border-2 border-black flex items-center justify-center">
                <Bot className="w-7 h-7 text-[#FF4D00]" />
              </div>
              <div>
                <h3 className="font-headline text-base text-black mb-1">EXAMSAATHI AI STRATEGIST</h3>
                <p className="font-meta text-xs text-neutral-500 max-w-xs leading-relaxed">
                  Ask anything — high-yield topics, formula derivations, gap alerts, or a custom revision sprint.
                </p>
              </div>
            </div>
          )}
          {messages.map((msg) => {
            const isBot = msg.role === "assistant";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
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
                    <div className="flex items-center gap-2">
                      <span className="font-meta text-[10px] text-neutral-400">
                        {msg.timestamp}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className={`p-1 border transition-colors cursor-pointer text-[10px] flex items-center gap-1 ${
                          copiedId === msg.id
                            ? "bg-emerald-500 text-black border-black font-bold"
                            : isBot
                            ? "bg-neutral-100 hover:bg-[#FF4D00] text-black border-neutral-300"
                            : "bg-neutral-800 hover:bg-[#FF4D00] text-white hover:text-black border-neutral-700"
                        }`}
                        title="Copy message to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-2.5 h-2.5" />
                            <span>COPIED</span>
                          </>
                        ) : (
                          <Copy className="w-2.5 h-2.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isBot ? (
                    <MarkdownMath content={msg.content} />
                  ) : (
                    <div className="text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line text-white">
                      {msg.content}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}

          {isSending && (
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="flex gap-3 sm:gap-4 max-w-3xl mr-auto">
              <div className="w-8 h-8 flex-shrink-0 border-brutal bg-[#FF4D00] text-black flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="border-brutal p-4 bg-white text-black flex items-center gap-2 font-meta text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#FF4D00]" />
                <span>Saathi AI synthesizing verified PYQ shift reasoning...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick Prompts ────────────────────────────────────────────── */}
        <div className="border-brutal-t p-2.5 bg-white overflow-x-auto flex gap-2 font-meta text-xs shrink-0 items-center">
          <span className="text-neutral-500 font-bold self-center text-[10px] pl-1 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FF4D00]" /> QUICK:
          </span>
          {/* Draw Diagram Action */}
          <button
            type="button"
            onClick={() => handleSendMessage(`Draw a detailed labeled diagram of ${chapter && chapter !== "General Strategy" ? chapter : "Compound Microscope ray optics"} with key labeled components, working principle, and CBSE/JEE scoring tips.`)}
            disabled={isSending}
            className="bg-[#FF4D00] text-black border border-black px-3 py-1.5 whitespace-nowrap text-[11px] font-bold hover:bg-black hover:text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000]"
            title="Generate a labeled scientific diagram"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>🎨 DRAW DIAGRAM</span>
          </button>
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

        {/* ── Input Bar ────────────────────────────────────────────────── */}
        <div className="border-brutal-t p-3 sm:p-4 bg-neutral-100 flex items-center gap-2 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            placeholder="Ask anything — chapter trends, formulas, step-by-step solving..."
            className="flex-1 pl-4 pr-4 py-3 border-brutal text-xs sm:text-sm bg-white text-black placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF4D00] font-sans"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isSending || !inputText.trim()}
            className="bg-black text-white px-5 py-3 border-brutal font-headline text-sm hover:bg-[#FF4D00] hover:text-black transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            title="Send message"
          >
            <span className="hidden sm:inline">SEND</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
