"use client";

import React, { useEffect, useState } from "react";
import { History, Trash2, MessageSquare, ChevronRight, X } from "lucide-react";

export interface ChatSession {
  id: string;
  exam: string;
  chapter: string;
  title: string;
  createdAt: string;
  messages: { id: string; role: string; content: string; timestamp: string }[];
}

const STORAGE_KEY = "examsaathi_chat_sessions";
const MAX_SESSIONS = 30;

export function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: ChatSession) {
  try {
    const existing = loadSessions().filter((s) => s.id !== session.id);
    const updated = [session, ...existing].slice(0, MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function deleteSession(id: string) {
  try {
    const updated = loadSessions().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

interface Props {
  open: boolean;
  onClose: () => void;
  onRestore: (session: ChatSession) => void;
  currentSessionId: string;
}

export function ChatHistoryPanel({ open, onClose, onRestore, currentSessionId }: Props) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    if (open) setSessions(loadSessions());
  }, [open]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearAll = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setSessions([]);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white border-l-2 border-black z-50 flex flex-col shadow-[-6px_0px_0px_0px_#000000]">
        {/* Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#FF4D00]" />
            <h2 className="font-headline text-base">CHAT HISTORY</h2>
          </div>
          <div className="flex items-center gap-2">
            {sessions.length > 0 && (
              <button
                onClick={handleClearAll}
                className="font-meta text-[10px] text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                CLEAR ALL
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 border border-neutral-700 hover:border-[#FF4D00] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-[#fff7ed] border-b-2 border-black px-4 py-2.5">
          <p className="font-meta text-[10px] text-neutral-600 leading-relaxed">
            💾 Chats auto-save locally. They persist across sessions on this device.
          </p>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-400 p-8">
              <MessageSquare className="w-10 h-10 opacity-30" />
              <p className="font-meta text-xs text-center">
                No saved chats yet. Start a conversation and it will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {sessions.map((session, index) => {
                const isCurrent = session.id === currentSessionId;
                const sessionNum = sessions.length - index;
                const lastAiMsg = [...session.messages].reverse().find((m) => m.role === "assistant");
                const previewText = lastAiMsg?.content?.slice(0, 55) ?? session.title;
                const timeStr = new Date(session.createdAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit", minute: "2-digit",
                });
                const dateStr = new Date(session.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "short",
                });
                return (
                  <button
                    key={session.id}
                    onClick={() => { onRestore(session); onClose(); }}
                    className={`w-full text-left p-4 hover:bg-neutral-50 transition-colors flex items-start gap-3 group cursor-pointer ${
                      isCurrent ? "bg-[#fff7ed] border-l-4 border-[#FF4D00]" : ""
                    }`}
                  >
                    {/* Session number badge */}
                    <div className="w-7 h-7 bg-black border border-black flex items-center justify-center shrink-0 mt-0.5 font-headline text-[10px] text-[#FF4D00] font-bold">
                      #{sessionNum}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title = user's first question */}
                      <p className="font-headline text-xs text-black truncate leading-tight">
                        {session.title || "New conversation"}
                      </p>
                      {/* Last AI reply preview */}
                      <p className="font-meta text-[10px] text-neutral-500 truncate mt-0.5 italic">
                        {previewText}{previewText.length >= 55 ? "…" : ""}
                      </p>
                      {/* Meta row */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-meta text-[9px] text-[#FF4D00] font-bold uppercase">
                          {session.exam}
                        </span>
                        <span className="text-neutral-300">·</span>
                        <span className="font-meta text-[9px] text-neutral-500">
                          {session.messages.length} msgs
                        </span>
                        <span className="text-neutral-300">·</span>
                        <span className="font-meta text-[9px] text-neutral-400 font-bold">
                          {dateStr}, {timeStr}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleDelete(session.id, e)}
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 flex items-center justify-center cursor-pointer"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-[#FF4D00] transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>

          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black p-3 bg-neutral-50 shrink-0">
          <p className="font-meta text-[9px] text-neutral-400 text-center">
            {sessions.length}/{MAX_SESSIONS} sessions saved • This device only
          </p>
        </div>
      </div>
    </>
  );
}
