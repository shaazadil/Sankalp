"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
} from "lucide-react";
import { sendChatMessage } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  preview?: any;
  quickReplies?: string[];
}

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string | null;
  onApplyPlanFromChat?: (preview: any) => void;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  token,
  onApplyPlanFromChat,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Namaste! 🙏 I'm your Sankalp financial co-pilot. You can talk to me just like you would to a trusted friend or elder sibling.\n\nTell me what's on your mind—like moving to a new city, planning a wedding, or figuring out your real in-hand salary—and I'll help you map out the numbers with zero jargon.",
      quickReplies: [
        "Moving Kolkata to Bengaluru for 9 LPA",
        "Plan ₹15L Wedding in 18 Months",
        "Explain CTC vs. Take-Home Salary",
      ],
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      const data = await sendChatMessage(text, token);
      const botMsg: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: data.response,
        quickReplies: data.suggested_quick_replies,
        preview: data.computed_preview,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: "Oops! Couldn't reach the advisor. Please check that the backend is active, or try asking in a moment.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 h-full border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-900/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Sankalp AI Advisor
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Groq LPU (~300ms)
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Jargon-Free Indian Financial Guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="/chat"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Open full-page chat"
            >
              <Maximize2 className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 ${
                  m.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-none shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 rounded-bl-none border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm"
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{m.content}</p>

                {/* Instant preview card if returned by backend */}
                {m.preview && onApplyPlanFromChat && (
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 space-y-2 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Live Math Preview Ready</span>
                    </div>
                    {m.preview.estimated_in_hand && (
                      <div className="text-xs flex justify-between">
                        <span>Calculated In-Hand:</span>
                        <span className="font-extrabold">₹{Math.round(m.preview.estimated_in_hand).toLocaleString("en-IN")}/mo</span>
                      </div>
                    )}
                    {m.preview.security_deposit_shock && (
                      <div className="text-xs flex justify-between text-amber-600 dark:text-amber-400">
                        <span>Locked Deposit:</span>
                        <span className="font-extrabold">₹{Math.round(m.preview.security_deposit_shock).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <button
                      onClick={() => onApplyPlanFromChat(m.preview)}
                      className="w-full mt-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1 transition"
                    >
                      <span>Load into Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Quick reply chips */}
                {m.quickReplies && m.quickReplies.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {m.quickReplies.map((qr, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(qr)}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 transition active:scale-95 cursor-pointer"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-zinc-400 text-xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span className="font-medium animate-pulse">Sankalp AI is thinking...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything in plain English..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white disabled:text-zinc-500 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <span className="text-[10px] text-zinc-400 block text-center mt-2">
            AI calculations verified by deterministic math engine. No hallucinated arithmetic.
          </span>
        </div>
      </div>
    </div>
  );
};
