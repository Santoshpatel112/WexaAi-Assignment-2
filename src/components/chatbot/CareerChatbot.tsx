"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { MessageSquare, X, Send, Sparkles, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

export function CareerChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "assistant",
      text: `Hi ${user.name}! I am your personalized CareerGraph Assistant. Ask me about your job matches, missing skills, or career path!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, message: currentQuery }),
      });
      const json = await res.json();
      if (json.success && json.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: "assistant",
            text: json.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-2xl shadow-purple-500/30 transition-transform hover:scale-110 flex items-center justify-center ring-4 ring-purple-500/20"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 animate-pulse" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[460px] bg-slate-900/95 border border-slate-700/60 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                  Career Assistant
                </h3>
                <span className="text-[10px] text-purple-400 font-mono">Context: {user.name}</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] p-3 rounded-2xl leading-relaxed",
                  m.sender === "user"
                    ? "ml-auto bg-purple-600 text-white rounded-br-none shadow-md"
                    : "mr-auto bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none"
                )}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span className="text-[9px] opacity-60 block mt-1 text-right font-mono">{m.timestamp}</span>
              </div>
            ))}
            {loading && (
              <div className="mr-auto bg-slate-950 border border-slate-800 p-3 rounded-2xl text-xs text-purple-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Querying CognoDB user graph...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about your matching jobs or skills..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
