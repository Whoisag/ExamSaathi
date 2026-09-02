"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChatMessage } from "@/data/mock";
import { MarkdownMath } from "@/components/ui/MarkdownMath";
import {
  Send, Bot, User, Loader2, Maximize2, Minimize2,
  History, Plus, Sparkles, Copy, Check, Download, Palette,
  Square, Pencil, FileText, X,
} from "lucide-react";
import toast from "react-hot-toast";
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
  const [diagramModalOpen, setDiagramModalOpen] = useState(false);
  const [customDiagramPrompt, setCustomDiagramPrompt] = useState("");
  const hasAutoSentRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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

    const controller = new AbortController();
    abortControllerRef.current = controller;

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
        signal: controller.signal,
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
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            id: `stopped-${Date.now()}`,
            role: "assistant",
            content: "*[Response generation paused by student]*",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: "Error communicating with AI engine. Switched to offline deterministic reasoning.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } finally {
      setIsSending(false);
      abortControllerRef.current = null;
      inputRef.current?.focus();
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsSending(false);
    toast.success("Generation stopped.");
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

  const handleEditPrompt = (msgId: string, content: string) => {
    const idx = messages.findIndex((m) => m.id === msgId);
    if (idx !== -1) {
      setMessages((prev) => prev.slice(0, idx));
    }
    setInputText(content);
    inputRef.current?.focus();
    toast("Prompt loaded into editor. Edit and press Send.", { icon: "✏️" });
  };

  const handleGenerateCustomDiagram = () => {
    if (!customDiagramPrompt.trim()) return;
    const promptToSend = `Draw a detailed labeled scientific diagram of ${customDiagramPrompt.trim()} with key components, working principle, ray tracing or circuit path, and CBSE/JEE scoring tips.`;
    setDiagramModalOpen(false);
    setCustomDiagramPrompt("");
    handleSendMessage(promptToSend);
  };

  const handleGeneratePdf = () => {
    const printWindow = window.open("", "_blank", "width=850,height=900");
    if (!printWindow) {
      toast.error("Please allow popups to generate your custom PDF study sheet.");
      return;
    }

    const title = `${chapter.toUpperCase()} - ${exam.toUpperCase()} AI Revision Guide`;
    const dateStr = new Date().toLocaleString();

    const renderedMessagesHtml = messages
      .map((m) => {
        const isBot = m.role === "assistant";
        return `
          <div class="message-card ${isBot ? "assistant-card" : "user-card"}">
            <div class="card-header">
              <span class="role-badge ${isBot ? "bot-badge" : "user-badge"}">
                ${isBot ? "🤖 SAATHI SOCRATIC TUTOR" : "👤 STUDENT QUESTION"}
              </span>
              <span class="timestamp">${m.timestamp}</span>
            </div>
            <div class="card-body">
              ${m.content
                .replace(/\n\n/g, "</p><p>")
                .replace(/\n/g, "<br/>")
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>")}
            </div>
          </div>
        `;
      })
      .join("");

    const printHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 14mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #000;
              background: #fff;
              line-height: 1.55;
              padding: 0;
              margin: 0;
              font-size: 11pt;
            }
            .header-banner {
              border: 3px solid #000;
              padding: 14px 18px;
              background: #fff;
              margin-bottom: 20px;
              box-shadow: 4px 4px 0px #000;
            }
            .logo-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #000;
              padding-bottom: 8px;
              margin-bottom: 10px;
            }
            .logo-text {
              font-size: 18pt;
              font-weight: 900;
              letter-spacing: -0.5px;
            }
            .accent-dot {
              color: #FF4D00;
              display: inline;
            }
            .exam-tag {
              background: #FF4D00;
              color: #000;
              font-size: 8pt;
              font-weight: 800;
              padding: 3px 8px;
              border: 1.5px solid #000;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .title-text {
              font-size: 15pt;
              font-weight: 800;
              margin: 0 0 6px 0;
              text-transform: uppercase;
            }
            .meta-text {
              font-size: 8.5pt;
              color: #444;
              font-family: monospace;
            }
            .message-card {
              border: 2px solid #000;
              margin-bottom: 16px;
              page-break-inside: avoid;
              background: #fff;
            }
            .user-card {
              border-left: 6px solid #000;
              background: #f8f8f8;
            }
            .assistant-card {
              border-left: 6px solid #FF4D00;
              background: #fff;
            }
            .card-header {
              padding: 6px 12px;
              border-bottom: 1px solid #ddd;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-family: monospace;
              font-size: 8pt;
            }
            .role-badge {
              font-weight: 800;
              text-transform: uppercase;
            }
            .bot-badge {
              color: #FF4D00;
            }
            .user-badge {
              color: #000;
            }
            .timestamp {
              color: #777;
            }
            .card-body {
              padding: 12px 16px;
              font-size: 9.5pt;
            }
            .card-body p {
              margin: 0 0 8px 0;
            }
            strong {
              font-weight: 700;
            }
            figure {
              border: 2px solid #000;
              margin: 12px 0;
              padding: 6px;
              background: #f9f9f9;
              text-align: center;
            }
            figure img {
              max-width: 90%;
              max-height: 280px;
              object-fit: contain;
              border: 1px solid #000;
            }
            figcaption {
              font-size: 8.5pt;
              font-weight: bold;
              margin-top: 6px;
              font-family: monospace;
            }
            .footer-note {
              margin-top: 24px;
              border-top: 2px solid #000;
              padding-top: 10px;
              text-align: center;
              font-size: 8pt;
              color: #666;
              font-family: monospace;
            }
            @media print {
              .no-print { display: none !important; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div class="logo-row">
              <div class="logo-text">EXAMSAATHI<span class="accent-dot">.</span>AI</div>
              <div class="exam-tag">${exam.toUpperCase()} SPECIALIZED TUTOR</div>
            </div>
            <div class="title-text">${chapter} // REVISION TRANSCRIPT</div>
            <div class="meta-text">
              SESSION DATE: ${dateStr} &bull; TARGET: ${exam.toUpperCase()} &bull; TOTAL TURNS: ${messages.length}
            </div>
          </div>

          <div class="transcript-container">
            ${renderedMessagesHtml}
          </div>

          <div class="footer-note">
            ExamSaathi &bull; AI-Powered Academic Socratic Tutoring &bull; Indira Gandhi Memorial High School &bull; All Rights Reserved
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
    toast.success("PDF generator dialog launched!");
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

            {/* Export Markdown */}
            <button
              onClick={handleExportChat}
              title="Export Conversation as Markdown"
              className="w-8 h-8 border border-neutral-700 hover:border-[#FF4D00] hover:bg-neutral-900 flex items-center justify-center cursor-pointer transition-colors text-neutral-300 hover:text-[#FF4D00]"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Generate Custom PDF */}
            <button
              onClick={handleGeneratePdf}
              title="Generate Custom PDF Revision Guide"
              className="w-8 h-8 border border-neutral-700 hover:border-[#FF4D00] hover:bg-neutral-900 flex items-center justify-center cursor-pointer transition-colors text-neutral-300 hover:text-[#FF4D00]"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Custom Diagram Generator Modal Button */}
            <button
              onClick={() => setDiagramModalOpen(true)}
              title="Open Custom Diagram Generator"
              className="w-8 h-8 border border-neutral-700 hover:border-[#FF4D00] hover:bg-neutral-900 flex items-center justify-center cursor-pointer transition-colors text-[#FF4D00]"
            >
              <Palette className="w-4 h-4" />
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
                      {!isBot && (
                        <button
                          type="button"
                          onClick={() => handleEditPrompt(msg.id, msg.content)}
                          className="px-1.5 py-0.5 border border-neutral-700 bg-neutral-800 hover:bg-[#FF4D00] text-neutral-300 hover:text-black font-meta text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Edit this prompt and re-submit"
                        >
                          <Pencil className="w-2.5 h-2.5" />
                          <span>EDIT</span>
                        </button>
                      )}
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
          {/* Custom Diagram Modal Trigger */}
          <button
            type="button"
            onClick={() => setDiagramModalOpen(true)}
            disabled={isSending}
            className="bg-black text-[#FF4D00] border border-black px-3 py-1.5 whitespace-nowrap text-[11px] font-bold hover:bg-[#FF4D00] hover:text-black transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000]"
            title="Open custom diagram designer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>📐 CUSTOM DIAGRAM</span>
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
          {isSending ? (
            <button
              type="button"
              onClick={handleStopGeneration}
              className="bg-red-600 text-white hover:bg-black px-5 py-3 border-brutal font-headline text-sm transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-[2px_2px_0px_0px_#000000] animate-pulse"
              title="Stop AI response generation"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>STOP</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="bg-black text-white px-5 py-3 border-brutal font-headline text-sm hover:bg-[#FF4D00] hover:text-black transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title="Send message"
            >
              <span className="hidden sm:inline">SEND</span>
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Custom Diagram Generator Modal ──────────────────────────── */}
      {diagramModalOpen && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border-2 border-black w-full max-w-lg shadow-[8px_8px_0px_0px_#000000] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="border-b-2 border-black bg-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#FF4D00]" />
                <h3 className="font-headline text-sm sm:text-base text-white tracking-tight">
                  CUSTOM DIAGRAM &amp; SCHEMATIC GENERATOR
                </h3>
              </div>
              <button
                onClick={() => setDiagramModalOpen(false)}
                className="p-1 hover:bg-neutral-800 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 font-sans text-xs">
              <div>
                <label className="block font-meta text-[11px] font-bold text-black uppercase mb-1.5">
                  DESCRIBE ANY CUSTOM DIAGRAM TO GENERATE:
                </label>
                <textarea
                  rows={3}
                  value={customDiagramPrompt}
                  onChange={(e) => setCustomDiagramPrompt(e.target.value)}
                  placeholder="e.g. Concave mirror ray diagram with object at C, or Full-wave bridge rectifier with filter capacitor, or Galvanic cell with zinc-copper electrodes..."
                  className="w-full p-3 border-2 border-black bg-neutral-50 text-black font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4D00] shadow-[2px_2px_0px_0px_#000000]"
                />
              </div>

              <div>
                <span className="block font-meta text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  ONE-CLICK EXAM PRESETS:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {[
                    "Compound Microscope Ray Optics",
                    "Full-Wave Rectifier Circuit with Filter",
                    "Galvanic Cell with Salt Bridge",
                    "Bohr Model of Hydrogen Atom",
                    "Wheatstone Bridge Balanced Condition",
                    "Astronomical Telescope Ray Tracing",
                    "Carnot Engine P-V Indicator Diagram",
                    "Young Double Slit Interference Fringes",
                    "AC Generator Rotating Coil Schematic",
                    "Moving Coil Galvanometer Diagram",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCustomDiagramPrompt(preset)}
                      className="px-2 py-1 bg-neutral-100 hover:bg-[#FF4D00] hover:text-black border border-neutral-300 font-meta text-[10px] font-bold transition-colors cursor-pointer text-left"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t-2 border-black bg-neutral-100 p-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDiagramModalOpen(false)}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-200 text-black font-headline text-xs transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleGenerateCustomDiagram}
                disabled={!customDiagramPrompt.trim() || isSending}
                className="px-5 py-2 border-2 border-black bg-[#FF4D00] text-black hover:bg-black hover:text-white font-headline text-xs font-bold transition-all shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>GENERATE IN CHAT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
